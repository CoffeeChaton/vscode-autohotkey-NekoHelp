import * as vscode from 'vscode';

export function c501ignoreArgNeverUsed(uri: vscode.Uri, position: vscode.Position): vscode.CodeAction {
    const edit = new vscode.WorkspaceEdit();
    edit.insert(uri, position, '_');

    const CA = new vscode.CodeAction('Prefix arg with underscore');
    CA.edit = edit;
    CA.kind = vscode.CodeActionKind.QuickFix;

    return CA;
}
