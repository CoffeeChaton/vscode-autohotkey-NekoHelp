/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
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

const memoCmdSignLabel2Arr = new Map<string, string[]>();

function tryGetCmdSignLabel2Arr(cmdSignLabel: string): string[] {
    const arr: string[] | undefined = memoCmdSignLabel2Arr.get(cmdSignLabel);
    if (arr === undefined) {
        const rr: string[] = cmdSignLabel
            .replaceAll('[', '')
            .replaceAll(']', '')
            .split(',')
            .map((v: string): string => v.trim());
        memoCmdSignLabel2Arr.set(cmdSignLabel, rr);
        return rr;
    }
    return arr;
}

function getInlayHintLabelPart(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    /**
     * 99% case
     */
    if (cmdDataList.length === 1) {
        const rr: string[] = tryGetCmdSignLabel2Arr(cmdDataList[0].cmdSignLabel);
        const value: string = rr.at(comma + 1) ?? 'unknown';
        return new vscode.InlayHintLabelPart(`${value}:`);
    }

    const { keyRawName } = cmdDataList[0];
    if (keyRawName === 'MsgBox') {
        const maxCOmma: number = args.at(-1)?.comma ?? -1;
        const select: string = maxCOmma > 0
            ? cmdDataList[1].cmdSignLabel // Overload
            : cmdDataList[0].cmdSignLabel;

        const rr: string[] = tryGetCmdSignLabel2Arr(select);
        const value: string = rr.at(comma + 1) ?? 'unknown';
        return new vscode.InlayHintLabelPart(`${value}:`);
    }

    if (keyRawName === 'Random') {
        /**
         * ```ahk
         * Random, OutputVar , Min, Max
         * Random, , NewSeed
         * ```
         */
        const firstArgs: string = args
            .filter((v) => v.comma === 0)
            .map((v) => v.StrPart)
            .join('')
            .trim();

        const select: string = firstArgs === ''
            ? cmdDataList[1].cmdSignLabel
            : cmdDataList[0].cmdSignLabel;

        const rr: string[] = tryGetCmdSignLabel2Arr(select);
        const value: string = rr.at(comma + 1) ?? 'unknown';
        return new vscode.InlayHintLabelPart(`${value}:`);
    }

    if (keyRawName === 'Hotkey') {
        /**
         * ```ahk
         * 0 Hotkey, KeyName , Label, Options
         * 1 Hotkey, IfWinActive/Exist , WinTitle, WinText
         * 2 Hotkey, If , Expression
         * 3 Hotkey, If, % FunctionObject
         * ```
         */
        const firstArgs: string = args
            .filter((v) => v.comma === 0)
            .map((v) => v.StrPart)
            .join('')
            .trim()
            .toUpperCase();
        if (firstArgs === 'IF') {
            if (comma === 0) return new vscode.InlayHintLabelPart('');
            if (comma === 1) {
                const arg2 = args
                    .filter((v) => v.comma === 1)
                    .map((v) => v.StrPart)
                    .join('')
                    .trim();

                return arg2.startsWith('%')
                    ? new vscode.InlayHintLabelPart('% FunctionObject:')
                    : new vscode.InlayHintLabelPart('Expression:');
            }
            return new vscode.InlayHintLabelPart('unknown:');
        }

        if (firstArgs.startsWith('IF')) { // IfWinActive/Exist
            if (comma === 0) return new vscode.InlayHintLabelPart(''); // IfWinActive/Exist
            if (comma === 1) return new vscode.InlayHintLabelPart('WinTitle:');
            if (comma === 2) return new vscode.InlayHintLabelPart('WinText:');
            return new vscode.InlayHintLabelPart('unknown:');
        }

        const rr: string[] = tryGetCmdSignLabel2Arr(cmdDataList[0].cmdSignLabel);
        const value: string = rr.at(comma + 1) ?? 'unknown';
        return new vscode.InlayHintLabelPart(`${value}:`);
    }

    if (keyRawName === 'IniRead') {
        /**
         * ```ahk
         * 0 IniRead, OutputVar, Filename, Section, Key , Default
         * 1 IniRead, OutputVarSection, Filename, Section
         * 2 IniRead, OutputVarSectionNames, Filename
         * ```
         */
        const maxComma: number = args.at(-1)?.comma ?? -1;
        // eslint-disable-next-line no-magic-numbers
        if (maxComma >= 3) { // IfWinActive/Exist
            // dprint-ignore
            switch (comma) {
                case 0: return new vscode.InlayHintLabelPart('OutputVar:');
                case 1: return new vscode.InlayHintLabelPart('Filename:');
                case 2: return new vscode.InlayHintLabelPart('Section:');
                // eslint-disable-next-line no-magic-numbers
                case 3: return new vscode.InlayHintLabelPart('Key:');
                // eslint-disable-next-line no-magic-numbers
                case 4: return new vscode.InlayHintLabelPart('Default:');
                default: return new vscode.InlayHintLabelPart('unknown:');
            }
        }

        if (maxComma === 2) { // IfWinActive/Exist
            // dprint-ignore
            switch (comma) {
                case 0: return new vscode.InlayHintLabelPart('OutputVarSection:');
                case 1: return new vscode.InlayHintLabelPart('Filename:');
                case 2: return new vscode.InlayHintLabelPart('Section:');
                default: return new vscode.InlayHintLabelPart('unknown:');
            }
        }
        if (maxComma === 1) { // IfWinActive/Exist
            // dprint-ignore
            switch (comma) {
                case 0: return new vscode.InlayHintLabelPart('OutputVarSectionNames:');
                case 1: return new vscode.InlayHintLabelPart('Filename:');
                default: return new vscode.InlayHintLabelPart('unknown:');
            }
        }

        return new vscode.InlayHintLabelPart('unknown:');
    }

    /**
     * ```ahk
     * MsgBox
     * Random
     * Hotkey
     * IniRead
     * ---
     * IniWrite
     * SplashImage
     * Progress
     * WinMove
     * WinSetTitle
     * ```
     */

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

        const label: vscode.InlayHintLabelPart = getInlayHintLabelPart(comma, args, cmdDataList);

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
