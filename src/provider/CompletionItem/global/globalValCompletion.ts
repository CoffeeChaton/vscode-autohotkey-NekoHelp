import path from 'node:path';
import * as vscode from 'vscode';
import type { TGlobalVarUpNameMap } from '../../../core/ParserTools/ahkGlobalVarTool';
import { getGlobalUpNameMap } from '../../../core/ParserTools/ahkGlobalVarTool';
import type { TTokenStream } from '../../../globalEnum';

function globalValCompletionCore(): vscode.CompletionItem[] {
    const map: TGlobalVarUpNameMap = getGlobalUpNameMap();

    const need: vscode.CompletionItem[] = [];
    for (const { fsPathList, keyRawName } of map.values()) {
        //
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: keyRawName,
            description: 'Global',
        });

        item.insertText = keyRawName;
        item.detail = 'neko help';

        item.kind = vscode.CompletionItemKind.Variable;

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        const list: string = [...fsPathList]
            .map((fsPath: string) => `- [${path.basename(fsPath)}](${fsPath})`)
            .sort()
            .join('\n');
        item.documentation = new vscode.MarkdownString('', true)
            .appendCodeblock(`global ${keyRawName}`)
            .appendMarkdown('is def/ref at\n')
            .appendMarkdown(list);

        need.push(item);
    }

    return need;
}

export function globalValCompletion(DocStrMap: TTokenStream, position: vscode.Position): vscode.CompletionItem[] {
    const { lStr, fistWordUp } = DocStrMap[position.line];
    if (fistWordUp !== 'GLOBAL') return [];

    const lStrSlice: string = lStr.slice(0, position.character);

    if (lStrSlice.includes(':') || lStrSlice.includes('=')) return [];

    return globalValCompletionCore();
}
