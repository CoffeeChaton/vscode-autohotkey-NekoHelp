import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { EDetail } from '../../../globalEnum';
import { $t } from '../../../i18n';

export function hoverRegion(AhkTokenLine: TAhkTokenLine, position: vscode.Position): vscode.Hover | null {
    if (!AhkTokenLine.detail.includes(EDetail.inComment)) return null;

    const { textRaw } = AhkTokenLine;
    const commentStr: string = textRaw.trimStart();
    const lStrLen: number = textRaw.length - commentStr.length;

    const ma: RegExpMatchArray | null = commentStr.match(/^;\s*\[(?:end)?region\]/iu)
        ?? commentStr.match(/^;\s*#(?:end)?region\b/iu)
        ?? commentStr.match(/^;\s*(?:#\s*)?MARK:/u); // `MARK:` not i-flag vscode 1.88 not support it
    if (ma === null) return null;

    const col: number = lStrLen + ma[0].length;
    const { character, line } = position;
    if (character > lStrLen && character < col) {
        return new vscode.Hover(
            new vscode.MarkdownString($t('about.code.folding')),
            new vscode.Range(
                new vscode.Position(line, lStrLen),
                new vscode.Position(line, col),
            ),
        );
    }

    return null;
}
