import type * as vscode from 'vscode';

export function isAhk(fsPath: string): boolean {
    return (/\.ahk$/iu).test(fsPath);
}

export function isAhkTab(uri: vscode.Uri): boolean {
    return uri.scheme === 'file' && isAhk(uri.fsPath);
}
