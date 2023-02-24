import * as vscode from 'vscode';
import { rmAllDiag } from '../core/diagColl';
import { BaseScanMemo } from '../core/ParserTools/getFileAST';
import type { TAhkFileData } from '../core/ProjectManager';
import { pm } from '../core/ProjectManager';
import { log } from '../provider/vscWindows/log';
import { getUriList } from '../tools/fsTools/getUriList';
import type { TShowFileParam } from '../tools/fsTools/showFileList';
import { showFileList } from '../tools/fsTools/showFileList';

export async function UpdateCacheAsync(clearCache: boolean): Promise<TAhkFileData[]> {
    rmAllDiag();
    pm.DocMap.clear();
    if (clearCache) {
        BaseScanMemo.memo.clear();
    }

    const uriList: vscode.Uri[] = getUriList();
    if (uriList.length === 0) return [];

    const FileListData: TAhkFileData[] = [];
    for (const uri of uriList) {
        // In the same PC, IO is relatively fast, but this decision is made for the workload of GC each time
        // and await in loop can run faster
        try {
            // eslint-disable-next-line no-await-in-loop
            const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);
            const AhkFileData: TAhkFileData | null = pm.updateDocDef(doc);
            if (AhkFileData !== null) {
                FileListData.push(AhkFileData);
            }
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
    }

    return FileListData;
}

export async function UpdateCacheUi(): Promise<void> {
    const t1: number = Date.now();
    const list: TAhkFileData[] = await UpdateCacheAsync(true);
    const t2: number = Date.now();
    const fileList: TShowFileParam[] = list
        .map(({ uri, ms }: TAhkFileData): TShowFileParam => ({ fsPath: uri.fsPath, ms }));
    log.info(`${showFileList(fileList)}\nRefresh Resource ${t2 - t1} ms, file: ${list.length}`);
    log.show();
}
