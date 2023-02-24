import path from 'node:path';
import * as vscode from 'vscode';
import { pm } from '../../../core/ProjectManager';

export function hoverGlobalVar(wordUp: string): vscode.MarkdownString | null {
    const msg: string[] = [];
    for (const { ModuleVar, uri } of pm.getDocMapValue()) {
        if (ModuleVar.ModuleValMap.has(wordUp)) {
            const fsPath: string = uri.toString();
            msg.push(`- [${path.basename(fsPath)}](${fsPath})`);
        }
    }

    if (msg.length === 0) return null;
    const md: vscode.MarkdownString = new vscode.MarkdownString('Maybe is Global variables?', true)
        .appendCodeblock(`global ${wordUp}`);

    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    md.appendMarkdown(msg.sort().join('\n'));

    return md;
}
