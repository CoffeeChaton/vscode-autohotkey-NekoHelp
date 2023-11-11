import type * as vscode from 'vscode';

const isAhkReg: Readonly<RegExp> = /\.ahk$/iu;
export function isAhk(fsPath: string): boolean {
    return isAhkReg.test(fsPath);
}

export function isAhkTab(uri: vscode.Uri): boolean {
    return uri.scheme === 'file' && isAhk(uri.fsPath);
}
