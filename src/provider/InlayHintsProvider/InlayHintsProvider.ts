/* eslint-disable max-depth */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { getInlayHintsProviderConfig } from '../../configUI';
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
): vscode.InlayHint[] {
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return [];

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
                    need.push(new vscode.InlayHint(position, [useDefFunc.getParamInlayHintLabelPart(comma)]));
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
        if (getInlayHintsProviderConfig().mainSwitch) {
            return InlayHintsProviderCore(document, range);
        }
        return [];
    },
};
