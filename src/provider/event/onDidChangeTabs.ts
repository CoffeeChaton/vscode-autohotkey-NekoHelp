import * as fs from 'node:fs';
import * as vscode from 'vscode';
import { getIgnoredList, needDiag } from '../../configUI';
import { rmFileDiag } from '../../core/diagColl';
import type { TAhkFileData } from '../../core/ProjectManager';
import { delOldCache, pm } from '../../core/ProjectManager';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';
import { fsPathIsAllow } from '../../tools/fsTools/getUriList';
import { getWorkspaceRoot } from '../../tools/fsTools/getWorkspaceRoot';
import { isAhk, isAhkTab } from '../../tools/fsTools/isAhk';
import { setBaseDiag } from '../Diagnostic/setBaseDiag';

export function onDidChangeActiveTab(e: vscode.TextEditor | undefined): void {
    if (e === undefined) return;

    const { document } = e;
    const { uri } = document;
    if (isAhkTab(uri) && needDiag()) {
        const AhkFileData: TAhkFileData | null = pm.getDocMap(uri.fsPath) ?? pm.updateDocDef(document);
        if (AhkFileData === null) return;

        setBaseDiag(AhkFileData);
        digDAFile(AhkFileData);
    }
}

function checkPmFileExist(): void {
    for (const [fsPath, { uri }] of pm.DocMap) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (!fs.existsSync(fsPath)) {
            delOldCache(uri);
        }
    }
}

export function onDidChangeTabs(tabChangeEvent: vscode.TabChangeEvent): void {
    /**
     * close event
     */
    for (const tab of tabChangeEvent.closed) {
        if (!(tab.input instanceof vscode.TabInputText)) continue;

        const { uri } = tab.input;
        if (isAhkTab(uri)) {
            const { fsPath, scheme } = uri;

            rmFileDiag(uri); // clear all diag of ahk-neko-help

            const externallyVisible: boolean = scheme === 'file'
                && !fsPath.startsWith('\\')
                && isAhk(fsPath)
                && fsPathIsAllow(fsPath, getIgnoredList());

            const wsList: readonly vscode.Uri[] = getWorkspaceRoot();
            const isInWorkspace: boolean = wsList.some((wsUri: vscode.Uri): boolean => fsPath.startsWith(wsUri.fsPath));

            if (!externallyVisible || !isInWorkspace) {
                /**
                 * prevent unlimited memory growth
                 */
                delOldCache(uri);
            }

            // eslint-disable-next-line security/detect-non-literal-fs-filename
            if (!fs.existsSync(fsPath)) {
                delOldCache(uri);
                checkPmFileExist();
            }
        }
    }
}
