import * as vscode from 'vscode';
import type { THotStrData } from '../../../AhkSymbol/CAhkHotString';
import { CAhkHotString } from '../../../AhkSymbol/CAhkHotString';
import type { TAhkFileData } from '../../../core/ProjectManager';
import { $t } from '../../../i18n';

export function HotStringsOptions(
    position: vscode.Position,
    AhkFileData: TAhkFileData,
    document: vscode.TextDocument,
): vscode.Hover | null {
    const { AST } = AhkFileData;
    for (const cHotString of AST) {
        if (!(cHotString instanceof CAhkHotString)) continue;

        const { selectionRange } = cHotString;
        if (selectionRange.contains(position)) {
            const List: readonly THotStrData[] = cHotString.getOption();
            for (const { md, range } of List) {
                if (range.contains(position)) {
                    return new vscode.Hover(md, range);
                }
            }
            return null;
        }

        // eslint-disable-next-line unicorn/consistent-destructuring
        if (cHotString.range.contains(position)) {
            const r: vscode.Range = new vscode.Range(
                new vscode.Position(position.line, position.character - 1),
                new vscode.Position(position.line, position.character + 1),
            );
            const partText: string = document.getText(r);
            if (partText.includes('`')) {
                const md = new vscode.MarkdownString(
                    $t('AhkHotKeys.hover.HotString.Escape_Sequences.md'),
                    true,
                );
                return new vscode.Hover(md, r);
            }
        }
    }
    return null;
}
