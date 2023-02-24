import * as vscode from 'vscode';
import { statement2Data } from './statement2.data';

const statement2snip: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    const List2: vscode.CompletionItem[] = [];

    for (const v of statement2Data) {
        const {
            doc,
            body,
            link,
            exp,
            keyRawName,
        } = v;
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: keyRawName,
            description: 'Flow of Control',
        });
        item.kind = vscode.CompletionItemKind.Snippet; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = new vscode.SnippetString(body);
        item.detail = 'Flow of Control (neko-help)';
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(keyRawName, 'ahk')
            .appendMarkdown(doc)
            .appendMarkdown(`\n'[(Read Doc)](${link})`)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');
        item.documentation = md;

        List2.push(item);
    }
    return List2;
})();

export function getSnipStatement2(subStr: string): readonly vscode.CompletionItem[] {
    return (/^\s*\w*$/iu).test(subStr)
        ? statement2snip
        : [];
}
