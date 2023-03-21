import * as vscode from 'vscode';
import type { CDiagBase } from '../../Diagnostic/tools/CDiagBase';

export function CACode118fix(diag: CDiagBase, uri: vscode.Uri): vscode.CodeAction {
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    edit.insert(
        uri,
        diag.range.start,
        '\n',
    );

    const CA: vscode.CodeAction = new vscode.CodeAction('fix code118');
    CA.kind = vscode.CodeActionKind.QuickFix;
    CA.edit = edit;

    return CA;
}
