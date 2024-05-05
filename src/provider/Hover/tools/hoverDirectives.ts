import * as vscode from 'vscode';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import type { TDirectivesMeta } from '../../../tools/Built-in/0_directive/Directives.tool';
import { getDirectivesMeta } from '../../../tools/Built-in/0_directive/Directives.tool';
import { hoverIncludeStr } from './hoverIncludeStr';

export function hoverDirectives(
    position: vscode.Position,
    AhkTokenLine: TAhkTokenLine,
    AhkFileData: TAhkFileData,
): vscode.Hover | null {
    const meta: TDirectivesMeta | null = getDirectivesMeta(position, AhkTokenLine);

    return meta === null
        ? hoverIncludeStr(AhkFileData, position)
        : new vscode.Hover(meta.md);
}
