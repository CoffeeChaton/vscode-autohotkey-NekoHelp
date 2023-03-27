import type * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { EDetail } from '../../../globalEnum';
import { DirectivesMDMap } from '../../../tools/Built-in/Directives.tool';

export function hoverDirectives(
    position: vscode.Position,
    AhkTokenLine: TAhkTokenLine,
): vscode.MarkdownString | null {
    const { detail, lStr } = AhkTokenLine;
    if (!detail.includes(EDetail.isDirectivesLine)) {
        return null;
    }

    const ma: RegExpMatchArray | null = lStr.match(/(#\w+)/u);
    if (ma === null) return null;

    const { character } = position;
    const upName: string = ma[1].toUpperCase();

    const col: number = lStr.indexOf('#');
    if (col <= character && col + upName.length >= character) {
        const md: vscode.MarkdownString | undefined = DirectivesMDMap.get(upName.replace('#', ''))?.md;
        if (md !== undefined) return md;
    }

    return null;
}
