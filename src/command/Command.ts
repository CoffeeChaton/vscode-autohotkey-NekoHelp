/* eslint-disable @typescript-eslint/no-misused-promises */
import * as vscode from 'vscode';
import { A1DevTools } from './A1DevTools/A1DevTools';
import { AnalysisFuncReferenceWrap } from './AnalysisFuncReference/AnalysisFuncReference';
import { DeepAnalysisAllFiles } from './DeepAnalysisAllFiles';
import { FormatAllFile } from './FormatAllFile/FormatAllFile';
import { ListAllFuncMain } from './ListAllFunc';
import { ListAllInclude } from './ListAllInclude';
import { ListIncludeTree } from './ListIncludeTree';
import { UpdateCacheUi } from './UpdateCache';

export function statusBarClick(): void {
    type TPick = {
        label: string,
        fn: () => void,
    };

    void vscode.window.showQuickPick<TPick>([
        { label: '0 -> Refresh Resource from workspace', fn: UpdateCacheUi },
        { label: '1 -> dev tools', fn: A1DevTools },
        { label: '2 -> list all #Include List', fn: ListAllInclude },
        { label: '3 -> list all #Include Tree', fn: ListIncludeTree },
        { label: '4 -> list all Function()', fn: ListAllFuncMain },
        { label: '5 -> DeepAnalysis All File', fn: DeepAnalysisAllFiles },
        { label: '6 -> format All File', fn: FormatAllFile },
        { label: '7 -> Analysis this file def func Reference', fn: AnalysisFuncReferenceWrap },
    ])
        .then((pick: TPick | undefined): null => {
            //
            pick?.fn();
            return null;
        });
}
