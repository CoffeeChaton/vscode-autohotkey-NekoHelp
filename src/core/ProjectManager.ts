import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import type { CAhkInclude } from '../AhkSymbol/CAhkInclude';
import { EInclude, pathJoinMagic } from '../AhkSymbol/CAhkInclude';
import { collectInclude } from '../command/tools/collectInclude';
import {
    getConfig,
    getIgnoredList,
    setStatusBarText,
} from '../configUI';
import type { TTryParserIncludeLog } from '../configUI.data';
import { EFileRenameEvent } from '../configUI.data';
import type { TFsPath } from '../globalEnum';
import { getFileMap, type TIncludeMap } from '../provider/event/renameFileEvent';
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
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
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
        const eventMsg: readonly string[] = e.files
            .filter(({ oldUri, newUri }): boolean => isAhk(oldUri.fsPath) || isAhk(newUri.fsPath))
            .map((
                { oldUri, newUri },
                index: number,
            ): string => `    ${index} "${oldUri.fsPath}" -> "${newUri.fsPath}",`);

        if (eventMsg.length === 0) return;

        log.info([
            '> ["FileRenameEvent"] -> "please check #Include"',
            '[',
            ...eventMsg,
            ']',
        ].join('\n'));

        const eventConfig: EFileRenameEvent = getConfig().event; // fo();
        if (eventConfig === EFileRenameEvent.AJustLog || eventConfig === EFileRenameEvent.BLogAndShow) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            for (const doc of await Promise.all(renameFileNameBefore(e))) pm.updateDocDef(doc);
            if (eventConfig === EFileRenameEvent.BLogAndShow) {
                log.show();
            }
        }

        if (eventConfig === EFileRenameEvent.CTryRename) {
            await renameFileEvent(e);
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

        setStatusBarText(path.basename(fsPath), pm.DocMap.size);
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

            setStatusBarText(path.basename(AhkFileData.uri.fsPath), pm.DocMap.size);

            const TryParserInclude: 'auto' | 'close' | 'open' = getConfig().files.tryParserIncludeOpt;

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
                    // TODO
                    //
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

export async function renameFileEvent(e: vscode.FileRenameEvent): Promise<void> {
    const oldAhkFileDataList: readonly TIncludeMap[] = getFileMap(pm.getDocMapValue());
    // old -> new
    for (const { oldUri, newUri } of e.files) {
        if (isAhk(oldUri.fsPath)) delOldCache(oldUri);
        if (isAhk(newUri.fsPath)) {
            // eslint-disable-next-line no-await-in-loop
            pm.updateDocDef(await vscode.workspace.openTextDocument(newUri));
        }
    }
    //
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    const uriList: vscode.Uri[] = [];

    //
    for (const AhkFileData of pm.getDocMapValue()) {
        const { AST, uri } = AhkFileData;
        for (const ahkInclude of collectInclude(AST)) {
            const {
                name,
                range,
                rawData,
            } = ahkInclude;
            const { mayPath, type } = rawData;
            if (
                type !== EInclude.isUnknown
                && type !== EInclude.A_ScriptDir
                && type !== EInclude.A_WorkingDir
                && fs.existsSync(mayPath)
            ) {
                continue;
            }

            // log.warn(`"${name}" is not exists`);

            // try auto rewrite
            const find: TIncludeMap | undefined = oldAhkFileDataList.find((v: TIncludeMap): boolean => v.name === name);
            if (find === undefined) {
                log.error(`"${uri.fsPath}:${range.start.line + 1}" unknown error-1-308`);
                continue;
            }
            const find2 = e.files.find(({ oldUri }) => oldUri.fsPath === find.uriFsPath);
            if (find2 === undefined) {
                log.warn(`"${uri.fsPath}:${range.start.line + 1}" is unknown case`);
                continue;
            }
            const { oldUri, newUri } = find2;

            const { line, character } = range.start;
            const Remarks = `"${oldUri.fsPath}" -> "${newUri.fsPath}" ;; at ${new Date().toISOString()}`;

            const {
                isIncludeAgain,
                IgnoreErrors,
            } = ahkInclude;
            const head = isIncludeAgain
                ? '#IncludeAgain'
                : '#Include';
            const i_flag = IgnoreErrors
                ? ' *i'
                : '';
            const a_space = ' ';
            const newText = `${head}${i_flag}${a_space}${newUri.fsPath} ; ${Remarks} ;`;
            const newPos: vscode.Position = new vscode.Position(line, character);
            edit.insert(uri, newPos, newText);
            log.info(`auto edit "${uri.fsPath}:${line + 1}"`);
            uriList.push(uri);
        }
    }

    await vscode.workspace.applyEdit(edit);
    await Promise.all(uriList.map((uri: vscode.Uri) => vscode.window.showTextDocument(uri)));
    log.show();
}
