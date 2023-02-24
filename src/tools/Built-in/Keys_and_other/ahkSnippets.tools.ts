import * as vscode from 'vscode';
import { ahkSnippetsData } from './ahkSnippets.data';

const ahkSnippetsList: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    const list: readonly vscode.CompletionItem[] = ahkSnippetsData.map((key: string) => {
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(key, 'ahk');

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: key, // Left
            description: 'other', // Right
        });
        // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.kind = vscode.CompletionItemKind.Snippet;
        item.insertText = key;
        item.detail = 'other';
        item.documentation = md;

        return item;
    });

    /**
     * after initialization clear
     */
    ahkSnippetsData.length = 0;
    return list;
})();

export function getSnipJustSnip(subStr: string): readonly vscode.CompletionItem[] {
    return (/(?<![.`#])\b\w+$/iu).test(subStr)
        ? ahkSnippetsList
        : [];
}
