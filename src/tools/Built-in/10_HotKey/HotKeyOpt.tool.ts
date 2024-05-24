// Hotkey Modifier Symbols
// https://www.autohotkey.com/docs/v1/Hotkeys.htm#Symbols

import type * as vscode from 'vscode';
import { CAhkHotKeys } from '../../../AhkSymbol/CAhkHotKeys';
import type { TAhkFileData } from '../../../core/ProjectManager';

export function HotKeyOpt(
    position: vscode.Position,
    AhkFileData: TAhkFileData,
): vscode.MarkdownString | null {
    const { AST } = AhkFileData;
    for (const ahkHotKeys of AST) {
        if (!(ahkHotKeys instanceof CAhkHotKeys)) continue;

        const { selectionRange, mdMeta } = ahkHotKeys;
        if (selectionRange.contains(position)) {
            const { md, range } = mdMeta;
            if (range.contains(position)) {
                return md;
            }

            return null;
        }
    }
    return null;
}
