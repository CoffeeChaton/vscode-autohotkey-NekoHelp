import type * as vscode from 'vscode';
import type { TTokenStream } from '../globalEnum';

export function getTextInRange(range: vscode.Range, DocStrMap: TTokenStream): string {
    if (range.isSingleLine) {
        return DocStrMap[range.start.line].textRaw.slice(range.start.character, range.end.character);
    }

    const startLineIndex = range.start.line;
    const endLineIndex = range.end.line;
    const resultLines: string[] = [];

    resultLines.push(DocStrMap[startLineIndex].textRaw.slice(Math.max(0, range.start.character)));
    for (let i = startLineIndex + 1; i < endLineIndex; i++) {
        resultLines.push(DocStrMap[i].textRaw);
    }
    resultLines.push(DocStrMap[endLineIndex].textRaw.slice(0, Math.max(0, range.end.character)));

    return resultLines.join('\n');
}
