import type * as vscode from 'vscode';

export function isPosAtStrNext(textRaw: string, lStr: string, position: vscode.Position): boolean {
    const col = position.character;
    if (col > lStr.length) {
        return true; // in ;comment
    }
    let tf = 1;
    const text = textRaw.replaceAll(/`./gu, '  ');
    const sL = text.length;
    for (let i = 0; i < sL; i++) {
        if (col === i) return tf !== 1;
        if (text[i] === '"') {
            tf *= -1;
        }
    }
    return false; // at line end
}
