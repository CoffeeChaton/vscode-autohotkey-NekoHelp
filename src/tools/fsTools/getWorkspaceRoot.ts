import * as vscode from 'vscode';

export function getWorkspaceRoot(): readonly string[] {
    const WorkspaceFolderList: readonly vscode.WorkspaceFolder[] | undefined = vscode.workspace.workspaceFolders;
    if (WorkspaceFolderList === undefined) return [];

    return WorkspaceFolderList.map((ws: vscode.WorkspaceFolder): string => ws.uri.fsPath);
}
