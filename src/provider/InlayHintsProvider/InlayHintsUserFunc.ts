import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TConfigs } from '../../configUI.data';
import type { TArgs } from '../../tools/DeepAnalysis/FnVar/def/getFileFnUsing';

export function InlayHintsUserFunc(
    useDefFunc: CAhkFunc,
    args: readonly TArgs[],
    config: TConfigs['inlayHints'],
): vscode.InlayHint[] {
    const { parameterNamesSuppressWhenArgumentMatchesName, HideSingleParameters } = config;
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

        const label: vscode.InlayHintLabelPart = useDefFunc.getParamInlayHintLabelPart(comma);
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
