/* eslint-disable max-depth */
import type * as vscode from 'vscode';
import type { THotStrData } from '../../../AhkSymbol/CAhkHotString';
import { CAhkHotString } from '../../../AhkSymbol/CAhkHotString';
import type { TAhkFileData } from '../../../core/ProjectManager';

export function HotStringsOptions(
    position: vscode.Position,
    AhkFileData: TAhkFileData,
): vscode.MarkdownString | null {
    const { AST } = AhkFileData;
    for (const cHotString of AST) {
        if (!(cHotString instanceof CAhkHotString)) continue;

        const { selectionRange } = cHotString;
        if (selectionRange.contains(position)) {
            const List: readonly THotStrData[] = cHotString.getOption();
            for (const { md, range } of List) {
                if (range.contains(position)) {
                    return md;
                }
            }
            return null;
        }
    }
    return null;
}
