import type * as vscode from 'vscode';

export function msgWithPos(text: string, fsPath: string, startPos: vscode.Position): string {
    const line: number = startPos.line + 1;
    const col: number = startPos.character + 1;
    return `${text} ;${fsPath}:${line}:${col}`;
}
/**
 * - file:///some/file.js#73
 * - file:///some/file.js#L73
 * - file:///some/file.js#73,84
 * - file:///some/file.js#L73,84
 * - file:///some/file.js#73-83
 * - file:///some/file.js#L73-L83
 * - file:///some/file.js#73,84-83,52
 * - file:///some/file.js#L73,84-L83,52
 *
 * <https://github.com/microsoft/vscode/blob/b3ec8181fc49f5462b5128f38e0723ae85e295c2/src/vs/platform/opener/common/opener.ts#L151-L160>
 */
export function makeMarkDownLinkPos(fsPath: string, line: number, col: number): string {
    return `file:///${fsPath}#${line + 1},${col + 1}`;
}
