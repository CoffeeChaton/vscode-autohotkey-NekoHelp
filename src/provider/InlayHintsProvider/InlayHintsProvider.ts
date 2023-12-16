/* eslint-disable max-depth */
import type * as vscode from 'vscode';
import { getInlayHintsConfig } from '../../configUI';
import type { TConfigs } from '../../configUI.data';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TFnRefEx } from '../../tools/DeepAnalysis/FnVar/def/getFileFnUsing';
import { getFileFnUsing } from '../../tools/DeepAnalysis/FnVar/def/getFileFnUsing';
import type { TFullFuncMap } from '../../tools/Func/getAllFunc';
import { getAllFunc } from '../../tools/Func/getAllFunc';
import { InlayHintsFunc } from './InlayHintsFunc';

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
        // func
        /**
         * func
         *
         * can not memo -> fullFuncMap && config
         */
        need.push(...InlayHintsFunc(allFileFnUsing, line, AST, fullFuncMap, config));

        // CMD
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
