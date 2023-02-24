import * as vscode from 'vscode';

export function getWorkspaceRoot(): readonly vscode.Uri[] {
    const WorkspaceFolderList: readonly vscode.WorkspaceFolder[] | undefined = vscode.workspace.workspaceFolders;
    if (WorkspaceFolderList === undefined) return [];

    return WorkspaceFolderList.map((ws: vscode.WorkspaceFolder): vscode.Uri => ws.uri);
}
