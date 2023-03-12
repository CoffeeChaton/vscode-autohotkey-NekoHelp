import * as vscode from 'vscode';
import type { CAhkInclude } from '../AhkSymbol/CAhkInclude';
import { pm } from '../core/ProjectManager';
import { collectInclude } from './tools/collectInclude';

export function ListAllInclude(): null {
    const t1: number = Date.now();

    const AllList: string[] = [];
    for (const { uri, AST } of pm.DocMap.values()) { // should keep output order
        const List: readonly CAhkInclude[] = collectInclude(AST);

        if (List.length > 0) {
            AllList.push(`\n;${uri.fsPath}`, ...List.map((ahkInclude) => `    ${ahkInclude.name}`));
        }
    }

    void vscode.workspace.openTextDocument({
        language: 'ahk',
        content: [
            'this is not ahk, just Report',
            '> "List All #Include"',
            ...AllList,
            '',
            `Done : ${Date.now() - t1} ms`,
        ].join('\n'),
    }).then((doc: vscode.TextDocument): Thenable<vscode.TextEditor> => vscode.window.showTextDocument(doc));

    return null;
}
