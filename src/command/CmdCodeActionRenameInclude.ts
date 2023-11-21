import * as vscode from 'vscode';

export async function CmdCodeActionRenameInclude(
    uri: vscode.Uri,
    range: vscode.Range,
    newPath: string,
): Promise<undefined> {
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    edit.replace(
        uri,
        range,
        newPath,
    );

    await vscode.workspace.applyEdit(edit);
    return undefined;
}
