/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable max-depth */
import * as vscode from 'vscode';
import { getAlwaysIncludeFolder, getTryParserInclude, LogParserInclude } from '../configUI';
import type { TTryParserIncludeLog } from '../configUI.data';
import { rmAllDiag } from '../core/diagColl';
import { BaseScanMemo } from '../core/ParserTools/getFileAST';
import type { TAhkFileData } from '../core/ProjectManager';
import { IncludePm, pm } from '../core/ProjectManager';
import { log } from '../provider/vscWindows/log';
import { getUriList } from '../tools/fsTools/getUriList';
import { getWorkspaceRoot } from '../tools/fsTools/getWorkspaceRoot';
import type { TShowFileParam } from '../tools/fsTools/showFileList';
import { showFileList } from '../tools/fsTools/showFileList';
import { collectInclude } from './tools/collectInclude';

async function tryUpdateDocDef(uri: vscode.Uri): Promise<TAhkFileData | null> {
    try {
        const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);
        return pm.updateDocDef(doc);
        //
    } catch (error: unknown) {
        // if vscode.workspace.openTextDocument
        // may say "The file is not displayed in the editor because it is either binary or uses an unsupported text encoding.""
        if (error instanceof Error) {
            log.error(error, `scan to "${uri.fsPath}" has err`);
        } else {
            log.error('Unknown Error', `scan to "${uri.fsPath}" has err`);
        }
    }
    return null;
}

export async function UpdateCacheAsync(clearCache: boolean): Promise<readonly TAhkFileData[]> {
    rmAllDiag();
    pm.DocMap.clear();
    IncludePm.clear();
    if (clearCache) {
        BaseScanMemo.memo.clear();
    }
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    const uriList: vscode.Uri[] = getUriList([...getWorkspaceRoot(), ...getAlwaysIncludeFolder()].sort());
    if (uriList.length === 0) return [];

    const FileListData: TAhkFileData[] = [];
    for (const uri of uriList) {
        // eslint-disable-next-line no-await-in-loop
        const data: TAhkFileData | null = await tryUpdateDocDef(uri);
        if (data !== null) FileListData.push(data);
    }

    const TryParserInclude: 'auto' | 'close' | 'open' = getTryParserInclude();

    if (
        TryParserInclude === 'open'
        || (TryParserInclude === 'auto' && vscode.workspace.workspaceFolders !== undefined)
    ) {
        const byRefLogList: { type: keyof TTryParserIncludeLog, msg: string }[] = [];

        const cloneList: readonly TAhkFileData[] = [...FileListData];
        for (const { AST, uri } of cloneList) {
            FileListData.push(
                // eslint-disable-next-line no-await-in-loop
                ...await pm.UpdateCacheAsyncCh(collectInclude(AST), uri.fsPath, byRefLogList),
            );
        }

        LogParserInclude(byRefLogList);
    }

    return FileListData;
}

export async function UpdateCacheUi(): Promise<void> {
    const t1: number = Date.now();
    const list: readonly TAhkFileData[] = await UpdateCacheAsync(true);
    const t2: number = Date.now();
    const fileList: TShowFileParam[] = list
        .map(({ uri, ms }: TAhkFileData): TShowFileParam => ({ fsPath: uri.fsPath, ms }));
    log.info(`${showFileList(fileList)}\nRefresh Resource ${t2 - t1} ms, file: ${list.length}`);
    log.show();
}
