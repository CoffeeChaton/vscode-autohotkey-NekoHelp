/* eslint-disable max-depth */
import * as vscode from 'vscode';
import { getAlwaysIncludeFolder, getConfig } from '../configUI';
import type { TTryParserIncludeLog } from '../configUI.data';
import { rmAllDiag } from '../core/diagColl';
import { BaseScanMemo } from '../core/ParserTools/getFileAST';
import type { TAhkFileData } from '../core/ProjectManager';
import { pm } from '../core/ProjectManager';
import { log } from '../provider/vscWindows/log';
import { enumLog } from '../tools/enumErr';
import { getUriList } from '../tools/fsTools/getUriList';
import { getWorkspaceRoot } from '../tools/fsTools/getWorkspaceRoot';
import type { TShowFileParam } from '../tools/fsTools/showFileList';
import { showFileList } from '../tools/fsTools/showFileList';
import { collectInclude } from './tools/collectInclude';

function LogParserInclude(byRefLogList: { type: keyof TTryParserIncludeLog, msg: string }[]): void {
    const logOpt: TTryParserIncludeLog = getConfig().files.tryParserIncludeLog;
    for (const { type, msg } of byRefLogList) {
        const msgF = `${type} , ${msg}`;
        switch (type) {
            case 'file_not_exists':
                if (logOpt.file_not_exists === true) log.warn(msgF);
                break;

            case 'parser_OK':
                if (logOpt.parser_OK === true) log.info(msgF);
                break;

            case 'parser_err':
                if (logOpt.parser_err === true) log.error(msgF);
                break;

            case 'parser_duplicate':
                if (logOpt.parser_duplicate === true) log.warn(msgF);
                break;

            case 'not_support_this_style':
                if (logOpt.not_support_this_style === true) log.warn(msgF);
                break;

            default:
                enumLog(type, 'tryParserInclude, UpdateCacheAsync');
        }
    }
}

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
            log.error('Unknown Error', `scan to "${uri.fsPath}" has err`, error);
        }
    }
    return null;
}

export async function UpdateCacheAsync(clearCache: boolean): Promise<readonly TAhkFileData[]> {
    rmAllDiag();
    pm.DocMap.clear();
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

    const TryParserInclude: 'auto' | 'close' | 'open' = getConfig().files.tryParserIncludeOpt;

    if (
        TryParserInclude === 'open'
        || (TryParserInclude === 'auto' && vscode.workspace.workspaceFolders === undefined)
    ) {
        const byRefLogList: { type: keyof TTryParserIncludeLog, msg: string }[] = [];

        const cloneList: readonly TAhkFileData[] = [...FileListData];
        const history = new Set<string>();
        for (const { AST, uri } of cloneList) {
            FileListData.push(
                // eslint-disable-next-line no-await-in-loop
                ...await pm.UpdateCacheAsyncCh(collectInclude(AST), uri.fsPath, byRefLogList, history),
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
