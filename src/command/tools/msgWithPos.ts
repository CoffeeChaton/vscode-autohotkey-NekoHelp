import type * as vscode from 'vscode';

export function msgWithPos(text: string, fsPath: string, startPos: vscode.Position): string {
    const line: number = startPos.line + 1;
    const col: number = startPos.character + 1;
    return `${text} ;${fsPath}:${line}:${col}`;
}
