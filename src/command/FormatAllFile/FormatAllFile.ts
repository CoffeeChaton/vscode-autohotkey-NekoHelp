import * as vscode from 'vscode';
import { getAlwaysIncludeFolder } from '../../configUI';
import type { ErmFirstCommaCommand } from '../../configUI.data';
import { EFormatChannel } from '../../globalEnum';
import { FormatCore, FormatCoreWrap } from '../../provider/Format/FormatProvider';
import { log } from '../../provider/vscWindows/log';
import { getUriList } from '../../tools/fsTools/getUriList';
import { getWorkspaceRoot } from '../../tools/fsTools/getWorkspaceRoot';
import type { TShowFileParam } from '../../tools/fsTools/showFileList';
import { showFileList } from '../../tools/fsTools/showFileList';
import { UpdateCacheAsync } from '../UpdateCache';
import { selectCmdTo1_or_2 } from './selectCmdTo1_or_2';
import { setFormattingOptions } from './setFormattingOptions';

async function formatByPathAsync(
    uri: vscode.Uri,
    options: vscode.FormattingOptions,
    cmdTo1_or_2: ErmFirstCommaCommand,
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
            cmdTo1_or_2,
        })),
    );
    const ms: number = Date.now() - t1;

    await vscode.workspace.applyEdit(WorkspaceEdit); // vscode check more thing of format?

    return {
        fsPath: uri.fsPath,
        ms,
    };
}

export async function FormatAllFile(): Promise<null> {
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    const uriList: vscode.Uri[] = getUriList([...getWorkspaceRoot(), ...getAlwaysIncludeFolder()].sort());
    if (uriList.length === 0) return null;

    const fmtOpt: vscode.FormattingOptions | null = await setFormattingOptions();
    if (fmtOpt === null) return null;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const cmdTo1_or_2: ErmFirstCommaCommand | null = await selectCmdTo1_or_2();
    if (cmdTo1_or_2 === null) return null;

    const t1: number = Date.now();
    const results: TShowFileParam[] = [];
    for (const uri of uriList) {
        // eslint-disable-next-line no-await-in-loop
        results.push(await formatByPathAsync(uri, fmtOpt, cmdTo1_or_2));
    }
    const t2: number = Date.now();

    log.info(`${showFileList(results)}\nFormatAllFile -> ${t2 - t1} ms`);
    log.show();

    await UpdateCacheAsync(false);
    return null;
}
