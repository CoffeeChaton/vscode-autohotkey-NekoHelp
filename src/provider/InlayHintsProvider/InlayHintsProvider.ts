/* eslint-disable max-depth */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { getInlayHintsConfig } from '../../configUI';
import type { TConfigs } from '../../configUI.data';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TFnRefEx } from '../../tools/DeepAnalysis/FnVar/def/getFileFnUsing';
import { getFileFnUsing } from '../../tools/DeepAnalysis/FnVar/def/getFileFnUsing';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import type { TFullFuncMap } from '../../tools/Func/getAllFunc';
import { getAllFunc } from '../../tools/Func/getAllFunc';

function InlayHintsProviderCore(
    document: vscode.TextDocument,
    range: vscode.Range,
    config: TConfigs['inlayHints'],
): vscode.InlayHint[] {
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return [];

    const { parameterNamesSuppressWhenArgumentMatchesName, HideSingleParameters } = config;
    const { DocStrMap, AST } = AhkFileData;
    const allFileFnUsing: readonly TFnRefEx[] = getFileFnUsing(DocStrMap);

    const fullFuncMap: TFullFuncMap = getAllFunc();

    const { start, end } = range;

    const need: vscode.InlayHint[] = [];

    // eslint-disable-next-line prefer-destructuring
    for (let line = start.line; line <= end.line; line++) {
        const selectLine: TFnRefEx = allFileFnUsing[line];
        for (const { fnUpName, args } of selectLine.refList) {
            const useDefFunc: CAhkFunc | undefined = fullFuncMap.get(fnUpName);
            if (useDefFunc !== undefined) {
                const commaSet = new Set<number>();
                for (const arg of args) {
                    const {
                        ln,
                        col,
                        comma,
                        StrPart,
                    } = arg;
                    if (commaSet.has(comma)) {
                        continue;
                    }
                    commaSet.add(comma);

                    const colFix = col;
                    const position: vscode.Position = new vscode.Position(ln, colFix);
                    const DA: CAhkFunc | null = getDAWithPos(AST, position);
                    if (
                        DA !== null
                        && DA.selectionRange.contains(position)
                    ) {
                        break;
                    }
                    const label: vscode.InlayHintLabelPart = useDefFunc.getParamInlayHintLabelPart(comma);
                    if (label.value === '') { // len === 0 && comma === 0
                        continue;
                    }
                    if (parameterNamesSuppressWhenArgumentMatchesName) {
                        const { value } = label;
                        if (StrPart.trim() === value.replace(':', '')) continue;
                    }

                    if (HideSingleParameters && args.length === 1 && useDefFunc.paramMap.size === 1) {
                        continue;
                    }
                    need.push(
                        new vscode.InlayHint(
                            position,
                            [label],
                            vscode.InlayHintKind.Parameter,
                        ),
                    );
                }
            }
        }
    }

    return need;
}

//

//
export const InlayHintsProvider: vscode.InlayHintsProvider = {
    provideInlayHints(
        document: vscode.TextDocument,
        range: vscode.Range,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.InlayHint[]> {
        const config: TConfigs['inlayHints'] = getInlayHintsConfig();
        if (config.AMainSwitch) {
            return InlayHintsProviderCore(document, range, config);
        }
        return [];
    },
};
