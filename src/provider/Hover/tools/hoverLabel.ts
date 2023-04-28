import * as vscode from 'vscode';
import type { CAhkLabel } from '../../../AhkSymbol/CAhkLine';
import type { TAhkFileData } from '../../../core/ProjectManager';
import { getDefWithLabel } from '../../Def/getDefWithLabel';

/** */
export function hoverLabel(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
    wordUp: string,
): vscode.MarkdownString | null {
    const list: CAhkLabel[] | null = getDefWithLabel(
        AhkFileData,
        position,
        wordUp,
    );
    if (list === null) return null;

    const allMd = new vscode.MarkdownString('');
    for (const label of list) {
        allMd
            .appendMarkdown(label.md.value)
            .appendMarkdown('\n***\n');
    }

    return allMd;
}
