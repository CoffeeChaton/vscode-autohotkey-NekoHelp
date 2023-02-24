import * as vscode from 'vscode';
import { AnalysisFuncRefCore } from '../AnalysisFuncReference/AnalysisFuncReference';
import { cmd2AnalysisThisFuncSource } from './cmd2AnalysisThisFuncSource';
import { cmd2TryFindGlobalVar } from './cmd3TryFindGlobalVar';

export function getFileReport(document: vscode.TextDocument): null {
    type TPick = {
        label: string,
        fn: () => void,
    };
    // analyze this file ref-func is from
    void vscode.window.showQuickPick<TPick>([
        { label: '1 -> Analysis this file def func Reference', fn: (): void => void AnalysisFuncRefCore(document) },
        { label: '2 -> Analysis this file use-func Source', fn: (): void => void cmd2AnalysisThisFuncSource(document) },
        { label: '3 -> try to find this file global-var', fn: (): void => void cmd2TryFindGlobalVar(document) },
        { label: '4 -> TODO', fn: (): void => void vscode.window.showInformationMessage('under construction...') },
    ])
        .then((pick: TPick | undefined): null => {
            //
            pick?.fn();
            return null;
        });

    return null;
}
