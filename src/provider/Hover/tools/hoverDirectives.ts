import type * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import type { TDirectivesMeta } from '../../../tools/Built-in/0_directive/Directives.tool';
import { getDirectivesMeta } from '../../../tools/Built-in/0_directive/Directives.tool';

export function hoverDirectives(
    position: vscode.Position,
    AhkTokenLine: TAhkTokenLine,
): vscode.MarkdownString | null {
    const meta: TDirectivesMeta | null = getDirectivesMeta(position, AhkTokenLine);
    return meta?.md ?? null;
}
