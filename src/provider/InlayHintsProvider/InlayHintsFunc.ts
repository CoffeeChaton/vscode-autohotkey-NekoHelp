import * as vscode from 'vscode';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import type { TConfigs } from '../../configUI.data';
import { getBuiltInFuncMD, type TBiFuncMsg } from '../../tools/Built-in/2_built_in_function/func.tools';
import { CMemo } from '../../tools/CMemo';
import type { TArgs, TFnRefEx } from '../../tools/DeepAnalysis/FnVar/def/getFileFnUsing';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import type { TFullFuncMap } from '../../tools/Func/getAllFunc';
import { isBuiltin } from '../../tools/isBuiltin';
import { isLookLikeNumber } from '../../tools/isNumber';
import { isString } from '../../tools/isString';
import { InlayHintDllCall } from './InlayHintDllCall';

const BiFuncInlayHint = new CMemo<TBiFuncMsg, readonly string[]>(
    (md: TBiFuncMsg): readonly string[] => {
        const { sign } = md;

        const paramList: readonly string[] = sign
            .replace(/^\w+\s:=\s/u, '')
            .replace(/^\w+\(/u, '')
            .replace(/\)$/u, '')
            .replaceAll('[', '')
            .replaceAll(']', '')
            .split(',')
            .map((s: string): string => (
                s
                    .replace(/^\s*ByRef\s*/u, '')
                    .replace(/:=.*/u, '')
                    .trim()
            ));

        return paramList.map((s: string): string => s.trim());
    },
);

function biFunc2InlayHint(
    biFunc: TBiFuncMsg,
    comma: number,
    args: readonly TArgs[],
): vscode.InlayHintLabelPart {
    const arr: readonly string[] = BiFuncInlayHint.up(biFunc);
    const len: number = arr.length;
    if (len === 0 && comma === 0) {
        return new vscode.InlayHintLabelPart('');
    }

    if (biFunc.keyRawName === 'DllCall') {
        return InlayHintDllCall(comma, args);
    }

    let i = 0;
    for (const v of arr) {
        if (i === comma) {
            const labelNameFix: string = v.endsWith('*')
                ? `${v}[0]:`
                : `${v}:`;

            return new vscode.InlayHintLabelPart(labelNameFix);
        }
        i++;
    }

    if (comma >= len) {
        const lastParam: string | undefined = arr.at(-1);
        if (lastParam !== undefined && lastParam.endsWith('*')) {
            return new vscode.InlayHintLabelPart(`${lastParam}[${comma - len + 1}]:`);
        }
    }
    return new vscode.InlayHintLabelPart('unknown:');
}

function InlayHintsFuncCore(
    args: readonly TArgs[],
    config: TConfigs['inlayHints'],
    ahkFuncData: CAhkFunc | TBiFuncMsg,
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

        const label: vscode.InlayHintLabelPart = ahkFuncData instanceof CAhkFunc
            ? ahkFuncData.getParamInlayHintLabelPart(comma)
            : biFunc2InlayHint(ahkFuncData, comma, args);

        const { value } = label;
        if (value === '') continue; // len === 0 && comma === 0
        if (parameterNamesSuppressWhenArgumentMatchesName && StrPart.trim() === value.replace(':', '')) {
            continue;
        }

        const colPos = StrPart.length - StrPart.trimStart().length;
        const InlayHint = new vscode.InlayHint(
            new vscode.Position(ln, col + colPos),
            [label],
            vscode.InlayHintKind.Parameter,
        );
        InlayHint.paddingRight = true;
        need.push(InlayHint);
    }

    return need;
}

export function InlayHintsFunc(
    allFileFnUsing: readonly TFnRefEx[],
    line: number,
    AST: TAstRoot,
    fullFuncMap: TFullFuncMap,
    config: TConfigs['inlayHints'],
): vscode.InlayHint[] {
    if (config.parameterNamesEnabled === 'none') {
        return [];
    }

    const need: vscode.InlayHint[] = [];
    const selectLine: TFnRefEx = allFileFnUsing[line];
    for (const { fnUpName, args } of selectLine) {
        /**
         * args.at(0)?.col --->\
         * a(0,1,2,3,b())
         * ** b() **
         * ** b() ** -> args.len === 0
         */
        const position: vscode.Position = new vscode.Position(line, args.at(0)?.col ?? 0);
        const DA: CAhkFunc | null = getDAWithPos(AST, position);
        if (DA !== null && DA.selectionRange.contains(position)) {
            break; // at func/method definition range
        }

        const useDefFunc: CAhkFunc | undefined = fullFuncMap.get(fnUpName);
        if (useDefFunc !== undefined) {
            need.push(...InlayHintsFuncCore(
                args,
                config,
                useDefFunc,
            ));
            continue;
        }
        //
        const biFunc: TBiFuncMsg | undefined = getBuiltInFuncMD(fnUpName);
        if (biFunc !== undefined) {
            need.push(...InlayHintsFuncCore(
                args,
                config,
                biFunc,
            ));
        }
    }

    return need;
}
