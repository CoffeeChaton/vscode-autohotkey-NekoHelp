import * as vscode from 'vscode';
import { getConfig } from '../configUI';

// {
//     "AhkNekoHelp.customize.CodeActionAddErrorLevelTemplate": [
//         "if ErrorLevel ;$1",
//         "{",
//         "    $0",
//         "}",
//         ""
//     ]
// }

export async function CmdCodeActionAddErrorLevelTemplate(
    editIri: vscode.Uri,
    position: vscode.Position,
    e2: string,
): Promise<null> {
    const newText: string = getConfig().customize.CodeActionAddErrorLevelTemplate
        .join('\n').replace('$1', e2);

    const snippet: vscode.SnippetString = new vscode.SnippetString(newText);
    const WorkspaceEdit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    WorkspaceEdit.set(
        editIri,
        [vscode.SnippetTextEdit.insert(position, snippet)],
    );

    await vscode.workspace.applyEdit(WorkspaceEdit);
    return null;
}
