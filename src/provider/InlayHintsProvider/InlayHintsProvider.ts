/* eslint-disable max-depth */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { getInlayHintsConfig } from '../../configUI';
import type { TConfigs } from '../../configUI.data';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TBiFuncMsg } from '../../tools/Built-in/2_built_in_function/func.tools';
import { getBuiltInFuncMD } from '../../tools/Built-in/2_built_in_function/func.tools';
import type { TFnRefEx } from '../../tools/DeepAnalysis/FnVar/def/getFileFnUsing';
import { getFileFnUsing } from '../../tools/DeepAnalysis/FnVar/def/getFileFnUsing';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import type { TFullFuncMap } from '../../tools/Func/getAllFunc';
import { getAllFunc } from '../../tools/Func/getAllFunc';
import { InlayHintsUserFunc } from './InlayHintsUserFunc';

function InlayHintsProviderCore(
    document: vscode.TextDocument,
    range: vscode.Range,
    config: TConfigs['inlayHints'],
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
                need.push(...InlayHintsUserFunc(
                    args,
                    config,
                    useDefFunc,
                ));
                continue;
            }
            //
            const biFunc: TBiFuncMsg | undefined = getBuiltInFuncMD(fnUpName);
            if (biFunc !== undefined) {
                need.push(...InlayHintsUserFunc(
                    args,
                    config,
                    biFunc,
                ));
            }
        }
    }

    return need;
}

export const InlayHintsProvider: vscode.InlayHintsProvider = {
    provideInlayHints(
        document: vscode.TextDocument,
        range: vscode.Range,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.InlayHint[]> {
        const config: TConfigs['inlayHints'] = getInlayHintsConfig();
        /**
         * // FIXME: if i Provider cmd InlayHints
         *
         * need to clear `config.parameterNamesEnabled !== 'none'`
         */
        if (config.AMainSwitch && config.parameterNamesEnabled !== 'none') {
            return InlayHintsProviderCore(document, range, config);
        }
        return [];
    },
};
