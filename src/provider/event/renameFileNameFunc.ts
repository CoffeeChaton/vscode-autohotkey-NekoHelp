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
    const oldFile: string = path.basename(oldUri.fsPath);
    const newFile: string = path.basename(newUri.fsPath);

    const logList: string[] = [`"${oldFile}" -> "${newFile}" ("AhkNekoHelp.event.FileRenameEvent" : 2)`];

    if (oldFile === newFile) {
        // just move file...how show i do?
        log.info(logList.join('\n'));
        return null;
    }

    const oldFileName: string = oldFile.replace(/.ah[k1]$/iu, '');
    const re = new RegExp(`(?<=^|[/\\\\<])${oldFileName}$`, 'iu');

    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    for (const { DocStrMap, uri, AST } of AhkFileDataList) {
        for (const ahkInclude of collectInclude(AST)) {
            //
            const { path1, range } = ahkInclude;
            const tryRemoveComment: string = path1
                .replace(/[ \t];.*$/u, '')
                .trim()
                .replace(/\.ah[k1]>?$/iu, '')
                .trim();

            if (re.test(tryRemoveComment)) {
                const { line } = range.start;
                const { textRaw } = DocStrMap[line];

                const Remarks = `    ;; ${oldFile} -> ${newFile} ;; at ${new Date().toISOString()} ;;    `;
                const head: string = textRaw.replace(path1, '');
                const newText: string = head + path1.replace(oldFile, newFile) + Remarks;
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
