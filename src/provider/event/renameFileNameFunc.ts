/* eslint-disable no-await-in-loop */
import * as vscode from 'vscode';
import { collectInclude } from '../../command/tools/collectInclude';
import type { TAhkFileData } from '../../core/ProjectManager';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { log } from '../vscWindows/log';

export async function renameFileNameFunc(
    oldUri: vscode.Uri,
    newUri: vscode.Uri,
    AhkFileDataList: TAhkFileData[],
): Promise<null> {
    const logList: string[] = [`"${oldUri.fsPath}" -> "${newUri.fsPath}" ("AhkNekoHelp.event.FileRenameEvent" : 2)`];

    if (oldUri.fsPath === newUri.fsPath) {
        // just move file...how show i do?
        log.info(logList.join('\n'));
        return null;
    }

    const oldPath: string = ToUpCase(oldUri.fsPath.replaceAll('/', '\\'));

    const uriList: vscode.Uri[] = [];
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    for (const { uri, AST } of AhkFileDataList) {
        for (const ahkInclude of collectInclude(AST)) {
            const {
                range,
                rawData,
                isIncludeAgain,
                IgnoreErrors,
            } = ahkInclude;
            const { mayPath } = rawData;

            if (oldPath !== ToUpCase(mayPath)) continue;

            const { line, character } = range.start;
            const Remarks = `"${oldUri.fsPath}" -> "${newUri.fsPath}" ;; at ${new Date().toISOString()}`;

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
            logList.push(`    auto edit "${uri.fsPath}" line ${line + 1}`);
            uriList.push(uri);
        }
    }

    // Taken over by vscode-auto-save
    // for (const editUri of editUriList) {
    //     void vscode.window.showTextDocument(editUri);
    // }

    log.info(logList.join('\n'));
    await vscode.workspace.applyEdit(edit);
    await Promise.all(uriList.map((uri: vscode.Uri) => vscode.window.showTextDocument(uri)));
    return null;
}
