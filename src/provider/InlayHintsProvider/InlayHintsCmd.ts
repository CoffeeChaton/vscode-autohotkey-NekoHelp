import * as vscode from 'vscode';
import type { TConfigs } from '../../configUI.data';
import type { TTokenStream } from '../../globalEnum';
import { CommandMDMap, type TCmdMsg } from '../../tools/Built-in/6_command/Command.tools';
import type { TCmdRefEx } from '../../tools/DeepAnalysis/FnVar/def/getFileCmdUsing';
import type { TArgs } from '../../tools/DeepAnalysis/FnVar/def/getFileFnUsing';
import { isBuiltin } from '../../tools/isBuiltin';
import { isLookLikeNumber } from '../../tools/isNumber';
import { isString } from '../../tools/isString';
import { SignatureCmdOverloadMap } from '../SignatureHelpProvider/SignatureCmdOverload';

const mapCmdSignLabel2Arr = new Map<string, string[]>();

function tryGetCmdSignLabel2Arr(cmdSignLabel: string): string[] {
    const arr: string[] | undefined = mapCmdSignLabel2Arr.get(cmdSignLabel);
    if (arr === undefined) {
        const rr: string[] = cmdSignLabel
            .replaceAll('[', '')
            .replaceAll(']', '')
            .split(',')
            .map((v: string): string => v.trim());
        mapCmdSignLabel2Arr.set(cmdSignLabel, rr);
        return rr;
    }
    return arr;
}

function foo(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    const maxCOmma: number = args.at(-1)?.comma ?? -1;
    //
    // const selectSign: TCmdMsg[] = cmdDataList.filter(
    //     (v) =>
    //         // eslint-disable-next-line implicit-arrow-linebreak
    //         v.cmdSignLabel
    //             .split(',')
    //             .length
    //             < maxCOmma,
    // );

    const rr: string[] = tryGetCmdSignLabel2Arr(cmdDataList[0].cmdSignLabel);
    const value: string = rr.at(comma + 1) ?? 'unknown';
    return new vscode.InlayHintLabelPart(`${value}:`);
}

function InlayHintsCmdCore(
    args: readonly TArgs[],
    config: TConfigs['inlayHints'],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHint[] {
    const { parameterNamesSuppressWhenArgumentMatchesName, HideSingleParameters, parameterNamesEnabled } = config;
    if (HideSingleParameters && args.length === 1) {
        return [];
    }

    const need: vscode.InlayHint[] = [];
    const commaSet = new Set<number>();
    for (const arg of args) {
        const {
            ln,
            col,
            comma,
            StrPart,
        } = arg;
        if (commaSet.has(comma)) continue;
        commaSet.add(comma);

        if (parameterNamesEnabled === 'literals') {
            const str: string = StrPart.trim();
            if (isBuiltin(str) || isString(str) || isLookLikeNumber(str)) {
                //
            } else {
                continue;
            }
        }

        const label: vscode.InlayHintLabelPart = foo(comma, args, cmdDataList);

        const { value } = label;
        if (value === '') continue; // len === 0 && comma === 0
        if (parameterNamesSuppressWhenArgumentMatchesName && StrPart.trim() === value.replace(':', '')) {
            continue;
        }

        need.push(
            new vscode.InlayHint(
                new vscode.Position(ln, col),
                [label],
                vscode.InlayHintKind.Parameter,
            ),
        );
    }

    return need;
}

export function InlayHintsCmd(
    DocStrMap: TTokenStream,
    allFileCmdUsing: readonly TCmdRefEx[],
    line: number,
    config: TConfigs['inlayHints'],
): vscode.InlayHint[] {
    const need: vscode.InlayHint[] = [];
    const selectLine: TCmdRefEx = allFileCmdUsing[line];

    for (const { CmdUpName, args } of selectLine) {
        if (CmdUpName === '') {
            continue;
        }
        const cmdData2: TCmdMsg | undefined = CommandMDMap.get(CmdUpName);
        if (cmdData2 === undefined) {
            // GLOBAL  IF RETURN CONTINUE ...etc
            continue;
        }

        const cmdDataOverloadMap: readonly TCmdMsg[] = SignatureCmdOverloadMap.get(CmdUpName) ?? [];
        const cmdInlayHintsData: readonly TCmdMsg[] = [cmdData2, ...cmdDataOverloadMap];

        need.push(...InlayHintsCmdCore(
            args,
            config,
            cmdInlayHintsData,
        ));
    }

    return need;
}
