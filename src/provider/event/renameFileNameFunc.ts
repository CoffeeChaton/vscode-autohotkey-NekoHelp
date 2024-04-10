/* eslint-disable no-await-in-loop */
import * as path from 'node:path';
import * as vscode from 'vscode';
import { collectInclude } from '../../command/tools/collectInclude';
import type { TAhkFileData } from '../../core/ProjectManager';
import { log } from '../vscWindows/log';

export async function renameFileNameFunc(
    oldUri: vscode.Uri,
    newUri: vscode.Uri,
    AhkFileDataList: TAhkFileData[],
): Promise<null> {
    const oldFileName: string = path.basename(oldUri.fsPath, '.ahk');
    const newFileName: string = path.basename(newUri.fsPath, '.ahk');

    const logList: string[] = [`"${oldFileName}" -> "${newFileName}" ("AhkNekoHelp.event.FileRenameEvent" : 2)`];

    if (oldFileName === newFileName) {
        // just move file...how show i do?
        log.info(logList.join('\n'));
        return null;
    }

    const re = new RegExp(`(?<=^|[/\\\\<])${oldFileName}$`, 'iu');

    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    for (const { DocStrMap, uri, AST } of AhkFileDataList) {
        for (const ahkInclude of collectInclude(AST)) {
            //
            const { path1, range } = ahkInclude;
            const tryRemoveComment: string = path1
                .replace(/[ \t];.*$/u, '')
                .trim()
                .replace(/\.ahk>?$/iu, '')
                .trim();

            if (re.test(tryRemoveComment)) {
                const { line } = range.start;
                const { textRaw } = DocStrMap[line];

                const Remarks = `    ;; ${oldFileName} -> ${newFileName} ;; at ${new Date().toISOString()} ;;    `;
                const head: string = textRaw.replace(path1, '');
                const newText: string = head + path1.replace(oldFileName, newFileName) + Remarks;
                //
                const newPos: vscode.Position = new vscode.Position(line, 0);
                edit.insert(uri, newPos, newText);
                logList.push(`    auto edit "${uri.fsPath}" line ${line + 1}`);
            }
        }
    }

    // Taken over by vscode-auto-save
    // for (const editUri of editUriList) {
    //     void vscode.window.showTextDocument(editUri);
    // }

    log.info(logList.join('\n'));
    await vscode.workspace.applyEdit(edit);
    return null;
}
