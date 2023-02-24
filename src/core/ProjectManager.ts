import * as vscode from 'vscode';
import { getIgnoredList } from '../configUI';
import type { TFsPath } from '../globalEnum';
import { log } from '../provider/vscWindows/log';
import { fsPathIsAllow } from '../tools/fsTools/getUriList';
import { isAhk } from '../tools/fsTools/isAhk';
import { rmFileDiag } from './diagColl';
import type { TMemo } from './ParserTools/getFileAST';
import { BaseScanMemo, getFileAST } from './ParserTools/getFileAST';

export type TAhkFileData = TMemo;

/**
 * ProjectManager
 */
export const pm = {
    // key : vscode.Uri.fsPath,
    DocMap: new Map<TFsPath, TAhkFileData>(),

    /**
     * ```js
     * 1/3 -> .reverse()
     * ```
     * @exp, funcName double def at 2 files
     */
    getDocMapValue(): TAhkFileData[] {
        const need: TAhkFileData[] = [...pm.DocMap.values()];
        // eslint-disable-next-line no-magic-numbers
        if (Math.random() > 0.3) {
            need.reverse();
        }
        return need;
    },

    getDocMap(fsPath: string): TAhkFileData | undefined {
        return pm.DocMap.get(fsPath);
    },

    delMap(e: vscode.FileDeleteEvent): void {
        for (const uri of e.files) {
            delOldCache(uri);
            rmFileDiag(uri);
        }
    },

    createMap(e: vscode.FileCreateEvent): void {
        for (const uri of e.files) {
            if (isAhk(uri.fsPath)) {
                void vscode.workspace
                    .openTextDocument(uri)
                    .then((doc: vscode.TextDocument): TAhkFileData | null => pm.updateDocDef(doc));
            }
        }
    },

    async renameFiles(e: vscode.FileRenameEvent): Promise<void> {
        // TODO add config of package?
        const eventMsg: string[] = e.files
            .filter(({ oldUri, newUri }): boolean => isAhk(oldUri.fsPath) || isAhk(newUri.fsPath))
            .map(({ oldUri, newUri }): string => `    ${oldUri.fsPath} \n -> ${newUri.fsPath}`);

        if (eventMsg.length === 0) return;

        const docList0: Thenable<vscode.TextDocument>[] = renameFileNameBefore(e);
        for (const doc of await Promise.all(docList0)) pm.updateDocDef(doc);

        log.info([
            '> ["FileRenameEvent"]',
            ...eventMsg,
            '',
            '> "please check #Include"',
        ].join('\n'));
        log.show();
    },

    updateDocDef(document: vscode.TextDocument): TAhkFileData | null {
        const result: TAhkFileData | 'isAhk2' = getFileAST(document);
        if (result === 'isAhk2') return null;

        const { uri, languageId } = document;
        const { fsPath, scheme } = uri;

        if (
            scheme === 'file'
            && languageId === 'ahk'
            && !fsPath.startsWith('\\')
            && isAhk(fsPath)
            && fsPathIsAllow(fsPath, getIgnoredList())
        ) {
            pm.DocMap.set(fsPath, result);
        } else {
            /**
             *  getIgnoredList() may change
             */
            pm.DocMap.delete(fsPath);
        }

        return result;
    },

    /**
     * https://stackoverflow.com/questions/68518501/vscode-workspace-ondidchangetextdocument-is-called-even-when-there-is-no-conte
     * https://github.com/Microsoft/vscode/issues/50344
     *
     * https://github.com/microsoft/vscode-discussions/discussions/90#discussioncomment-3312180
     *
     * - When the user types something
     * - When Undo and Redo are fired
     * - When Save is fired
     * - When Formatters are fired
     */
    changeDoc(e: vscode.TextDocumentChangeEvent): void {
        const { document } = e;
        pm.updateDocDef(document);
    },
} as const;

export function delOldCache(uri: vscode.Uri): void {
    const { fsPath } = uri;
    pm.DocMap.delete(fsPath);
    BaseScanMemo.memo.delete(fsPath);
    rmFileDiag(uri);
}

function renameFileNameBefore(e: vscode.FileRenameEvent): Thenable<vscode.TextDocument>[] {
    const docList0: Thenable<vscode.TextDocument>[] = [];
    for (const { oldUri, newUri } of e.files) {
        if (isAhk(oldUri.fsPath)) {
            delOldCache(oldUri); // ...not't open old .ahk
        }
        if (isAhk(newUri.fsPath)) {
            docList0.push(vscode.workspace.openTextDocument(newUri));
        }
    }
    return docList0;
}
