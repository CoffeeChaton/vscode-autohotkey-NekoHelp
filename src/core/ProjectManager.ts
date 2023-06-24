/* eslint-disable max-lines-per-function */
/* eslint-disable max-depth */
/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import type { CAhkInclude } from '../AhkSymbol/CAhkInclude';
import { pathJoinMagic } from '../AhkSymbol/CAhkInclude';
import { collectInclude } from '../command/tools/collectInclude';
import {
    getEventConfig,
    getIgnoredList,
    getTryParserInclude,
    setStatusBarText,
} from '../configUI';
import type { TTryParserIncludeLog } from '../configUI.data';
import { EFileRenameEvent } from '../configUI.data';
import type { TFsPath } from '../globalEnum';
import { renameFileNameFunc } from '../provider/event/renameFileNameFunc';
import { log } from '../provider/vscWindows/log';
import { fsPathIsAllow, getUriList } from '../tools/fsTools/getUriList';
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
        const eventMsg: string[] = e.files
            .filter(({ oldUri, newUri }): boolean => isAhk(oldUri.fsPath) || isAhk(newUri.fsPath))
            .map((
                { oldUri, newUri },
                index: number,
            ): string => `    ${index} "${oldUri.fsPath}" -> "${newUri.fsPath}",`);

        if (eventMsg.length === 0) return;

        for (const doc of await Promise.all(renameFileNameBefore(e))) pm.updateDocDef(doc);

        log.info([
            '> ["FileRenameEvent"] -> "please check #Include"',
            '[',
            ...eventMsg,
            ']',
        ].join('\n'));

        const isAutoRename: EFileRenameEvent = getEventConfig(); // fo();
        if (isAutoRename === EFileRenameEvent.CTryRename) {
            const AhkFileDataList: TAhkFileData[] = pm.getDocMapValue();
            for (const { oldUri, newUri } of e.files) {
                if (isAhk(oldUri.fsPath) && isAhk(newUri.fsPath)) { // else EXP : let a.ahk -> a.ahk0 or a.0ahk
                    // eslint-disable-next-line no-await-in-loop
                    await renameFileNameFunc(oldUri, newUri, AhkFileDataList);
                }
            }

            log.show();
        } else if (isAutoRename === EFileRenameEvent.BLogAndShow) {
            log.show();
        }
    },

    updateDocDef(document: vscode.TextDocument): TAhkFileData | null {
        const result: TAhkFileData | 'isAhk2' = getFileAST(document);
        if (result === 'isAhk2') return null;

        const { uri, languageId } = document;
        const { fsPath, scheme } = uri;

        // log.info(`updateDocDef, "${from}", "${fsPath}"`);
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
        const { languageId } = document;
        if (languageId === 'ahk') {
            const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
            if (AhkFileData === null) return;

            setStatusBarText(path.basename(AhkFileData.uri.fsPath));

            const TryParserInclude: 'auto' | 'close' | 'open' = getTryParserInclude();

            if (
                TryParserInclude === 'open'
                || (TryParserInclude === 'auto' && vscode.workspace.workspaceFolders === undefined)
            ) {
                const { AST, uri } = AhkFileData;
                const history = new Set<string>();
                void pm.UpdateCacheAsyncCh(collectInclude(AST), uri.fsPath, [], history); // if log is too much
            }
        }
    },

    async UpdateCacheAsyncCh(
        ahkIncludeList: readonly CAhkInclude[],
        rootPath: string,
        byRefLogList: { type: keyof TTryParserIncludeLog, msg: string }[],
        history: Set<string>,
    ): Promise<readonly TAhkFileData[]> {
        const FileListData: TAhkFileData[] = [];
        for (const ahkInclude of ahkIncludeList) {
            const tryPath: string = pathJoinMagic(ahkInclude.rawData, rootPath);

            if (tryPath === '') {
                byRefLogList.push({
                    type: 'not_support_this_style',
                    msg: `"${ahkInclude.name}"`,
                });
                continue;
            }

            try {
                const uri: vscode.Uri = vscode.Uri.file(
                    tryPath.endsWith('\\')
                        ? tryPath.replace(/\\$/u, '')
                        : tryPath,
                );
                const { fsPath } = uri;
                if (history.has(fsPath)) {
                    byRefLogList.push({
                        type: 'parser_duplicate',
                        msg: `"${ahkInclude.name}", to : "${tryPath}", rootPath: "${rootPath}"`,
                    });
                    continue;
                }
                if (!fs.existsSync(fsPath)) {
                    byRefLogList.push({
                        type: 'file_not_exists',
                        msg: `"${tryPath}", "${ahkInclude.name}"`,
                    });
                    continue;
                }
                const Stats: fs.Stats = fs.statSync(fsPath);
                if (Stats.isDirectory()) {
                    const FileListData2: TAhkFileData[] = [];
                    for (const uri2 of getUriList([fsPath])) {
                        try {
                            if (history.has(uri2.fsPath)) {
                                byRefLogList.push({
                                    type: 'parser_duplicate',
                                    msg: `"${ahkInclude.name}", to : "${uri2.fsPath}", rootPath: "${rootPath}"`,
                                });
                                continue;
                            }
                            // eslint-disable-next-line no-await-in-loop
                            const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri2);
                            const AhkFileData: TAhkFileData | null = pm.updateDocDef(doc);
                            history.add(uri2.fsPath);
                            if (AhkFileData === null) continue;

                            byRefLogList.push({
                                type: 'parser_OK',
                                msg: `"${ahkInclude.name}", to : "${uri2.fsPath}", rootPath: "${rootPath}"`,
                            });

                            FileListData2.push(
                                AhkFileData,
                                // eslint-disable-next-line no-await-in-loop
                                ...await pm.UpdateCacheAsyncCh(
                                    collectInclude(AhkFileData.AST),
                                    rootPath,
                                    byRefLogList,
                                    history,
                                ),
                            );
                        } catch {
                            byRefLogList.push({
                                type: 'parser_err',
                                msg: `"${ahkInclude.name}", file: "${tryPath}"`,
                            });
                        }
                    }

                    FileListData.push(...FileListData2);
                    continue;
                }
                if (!Stats.isFile() || !isAhk(fsPath)) {
                    byRefLogList.push({
                        type: 'not_support_this_style',
                        msg: `"${tryPath}", "${ahkInclude.name}"`,
                    });
                    continue;
                }

                // eslint-disable-next-line no-await-in-loop
                const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);
                const AhkFileData: TAhkFileData | null = pm.updateDocDef(doc);
                history.add(fsPath);
                if (AhkFileData === null) continue;

                byRefLogList.push({
                    type: 'parser_OK',
                    msg: `"${ahkInclude.name}", to : "${tryPath}", rootPath: "${rootPath}"`,
                });

                FileListData.push(
                    AhkFileData,
                    // eslint-disable-next-line no-await-in-loop
                    ...await pm.UpdateCacheAsyncCh(
                        collectInclude(AhkFileData.AST),
                        rootPath,
                        byRefLogList,
                        history,
                    ),
                );
            } catch {
                byRefLogList.push({
                    type: 'parser_err',
                    msg: `"${ahkInclude.name}", file: "${tryPath}"`,
                });
            }
        }

        return FileListData;
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
