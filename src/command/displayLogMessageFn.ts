import * as vscode from 'vscode';
import { getCustomize } from '../configUI';

/**
 * ctrl+alt+l
 */
export function displayLogMessageFn(): void {
    const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    if (editor === undefined) return;

    const { document, selections } = editor;
    const { displayLogMessage } = getCustomize();

    for (const select of selections) {
        const rangeUnderCursor: vscode.Range | undefined = document.getWordRangeAtPosition(select.active);
        if (rangeUnderCursor === undefined) continue;

        const selectVar: string = document.getText(select).trim();
        if (selectVar === '') continue;

        const { line } = select.active;

        if (selectVar.length > 0) {
            const { text } = document.lineAt(line);

            const space0: string = text.slice(0, text.search(/\S/u));
            const nextText: string = displayLogMessage.replaceAll('{selectText}', selectVar);

            void editor.edit((editBuilder: vscode.TextEditorEdit): void => {
                editBuilder.insert(new vscode.Position(line + 1, 0), `${space0}${nextText}\n`);
            });
            // https://code.visualstudio.com/docs/editor/userdefinedsnippets#_variables
        }
    }

    //
}
