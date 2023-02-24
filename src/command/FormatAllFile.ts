/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4,5,6,7,8] }] */

import * as vscode from 'vscode';
import { EFormatChannel } from '../globalEnum';
import { FormatCore, FormatCoreWrap } from '../provider/Format/FormatProvider';
import { log } from '../provider/vscWindows/log';
import { getUriList } from '../tools/fsTools/getUriList';
import type { TShowFileParam } from '../tools/fsTools/showFileList';
import { showFileList } from '../tools/fsTools/showFileList';
import { UpdateCacheAsync } from './UpdateCache';

async function formatByPathAsync(
    uri: vscode.Uri,
    options: vscode.FormattingOptions,
): Promise<TShowFileParam> {
    const t1: number = Date.now();
    const document: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);

    const WorkspaceEdit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    WorkspaceEdit.set(
        uri,
        FormatCoreWrap(FormatCore({
            document,
            options,
            fmtStart: 0,
            fmtEnd: document.lineCount - 1,
            from: EFormatChannel.byFormatAllFile,
            needDiff: true,
        })),
    );
    const ms: number = Date.now() - t1;

    await vscode.workspace.applyEdit(WorkspaceEdit); // vscode check more thing of format?

    return {
        fsPath: uri.fsPath,
        ms,
    };
}

async function setFormattingOptions(): Promise<vscode.FormattingOptions | null> {
    type TSelectTabOrSpace = {
        label: string,
        useTabs: boolean,
    };

    const TabOrSpacePick: TSelectTabOrSpace | undefined = await vscode.window.showQuickPick<TSelectTabOrSpace>([
        { label: '1 -> indent Using Tabs', useTabs: true },
        { label: '2 -> indent Using Spaces', useTabs: false },
    ], { title: 'Select Formatting Options' });

    if (TabOrSpacePick === undefined) return null;

    if (TabOrSpacePick.useTabs) { // Tab
        return {
            tabSize: 0,
            insertSpaces: false,
        };
    }

    type TSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    type TTabSize = {
        label: `${TSize}`,
        size: TSize,
    };

    const sizePick: TTabSize | undefined = await vscode.window.showQuickPick<TTabSize>([
        { label: '1', size: 1 },
        { label: '2', size: 2 },
        { label: '3', size: 3 },
        { label: '4', size: 4 },
        { label: '5', size: 5 },
        { label: '6', size: 6 },
        { label: '7', size: 7 },
        { label: '8', size: 8 },
    ], { title: 'set format ident size' });
    if (sizePick === undefined) return null;

    return {
        tabSize: sizePick.size,
        insertSpaces: true,
    };
}

export async function FormatAllFile(): Promise<null> {
    const uriList: vscode.Uri[] = getUriList();
    if (uriList.length === 0) return null;

    const fmtOpt: vscode.FormattingOptions | null = await setFormattingOptions();
    if (fmtOpt === null) return null;

    const t1: number = Date.now();
    const results: TShowFileParam[] = [];
    for (const uri of uriList) {
        // eslint-disable-next-line no-await-in-loop
        results.push(await formatByPathAsync(uri, fmtOpt));
    }
    const t2: number = Date.now();

    log.info(`${showFileList(results)}\nFormatAllFile -> ${t2 - t1} ms`);
    log.show();

    await UpdateCacheAsync(false);
    return null;
}
