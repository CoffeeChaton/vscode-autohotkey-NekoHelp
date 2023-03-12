/* eslint-disable no-await-in-loop */
import * as path from 'node:path';
import * as vscode from 'vscode';
import { collectInclude } from '../../command/tools/collectInclude';
import type { TAhkFileData } from '../../core/ProjectManager';
import { log } from '../vscWindows/log';

export function renameFileNameFunc(
    oldUri: vscode.Uri,
    newUri: vscode.Uri,
    AhkFileDataList: TAhkFileData[],
): vscode.WorkspaceEdit {
    const oldFileName: string = path.basename(oldUri.fsPath, '.ahk');
    const newFileName: string = path.basename(newUri.fsPath, '.ahk');
    log.info(`${oldFileName} -> ${newFileName} ("AhkNekoHelp.event.FileRenameEvent" : 2)`);

    // eslint-disable-next-line security/detect-non-literal-regexp
    const re = new RegExp(`\\b${oldFileName}$`, 'iu');

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

                const Remarks = `\n;;${oldFileName} -> ${newFileName} ; at ${new Date().toISOString()} \n;    `;
                const head: string = textRaw.replace(path1, '');
                const newText: string = head + path1.replace(oldFileName, newFileName) + Remarks;
                //
                const newPos: vscode.Position = new vscode.Position(line, 0);
                edit.insert(uri, newPos, newText);
                log.info(`auto edit "${uri.fsPath}" line ${line + 1}`);
            }
        }
    }

    // Taken over by vscode-auto-save
    // for (const editUri of editUriList) {
    //     void vscode.window.showTextDocument(editUri);
    // }

    // void vscode.workspace.applyEdit(edit);
    return edit;
}
