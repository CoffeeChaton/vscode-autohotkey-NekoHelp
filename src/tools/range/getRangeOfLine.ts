import * as vscode from 'vscode';

export function getRangeOfLine(line: number, lStr: string, textRawLen: number): vscode.Range {
    // const col = lStr.search(/\S/u);
    const col: number = lStr.length - lStr.trimStart().length;

    return new vscode.Range(
        new vscode.Position(line, col),
        new vscode.Position(line, textRawLen),
    );
}
