import path from 'node:path';
import * as vscode from 'vscode';
import { pm } from '../../../core/ProjectManager';

export function IncludeFsPath(fromPath: string): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    for (const fsPath of pm.DocMap.keys()) {
        const item: vscode.CompletionItem = new vscode.CompletionItem(
            {
                label: fsPath,
                description: 'path',
            },
            vscode.CompletionItemKind.File,
        );
        item.detail = 'neko help; (#include)';

        const basename: string = path.basename(fsPath);
        const list: string[] = [
            basename,
            fsPath,
            `%A_LineFile%\\${path.relative(fromPath, fsPath)}`,
            // [v1.1.11+]: Use %A_LineFile%\.. to refer to the directory ...
        ];

        // Lib
        if (fsPath.endsWith(`\\Lib\\${basename}`)) {
            list.push(`<${basename.replace(/\.ahk$/iu, '')}>`);
        }

        item.insertText = new vscode.SnippetString().appendChoice(list);
        need.push(item);
    }

    return need;
}
