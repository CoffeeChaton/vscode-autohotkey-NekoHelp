import * as vscode from 'vscode';
import { nekoExCommentData } from './nekoExComment.data';

export const nekoExComment: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    const arr: vscode.CompletionItem[] = [];
    for (
        const {
            label,
            insert,
            doc,
            exp,
        } of nekoExCommentData
    ) {
        const item: vscode.CompletionItem = new vscode.CompletionItem({ label });
        item.kind = vscode.CompletionItemKind.Snippet;
        item.insertText = new vscode.SnippetString(insert.replace(/^;@/u, ''));
        item.detail = 'by-neko-help';

        const md: vscode.MarkdownString = new vscode.MarkdownString(doc.join('\n'), true);
        md.appendCodeblock(exp.join('\n'));
        item.documentation = md;

        arr.push(item);
    }
    nekoExCommentData.length = 0;
    return arr;
})();

export const nekoFormatIgnoreBlock: vscode.CompletionItem = ((): vscode.CompletionItem => {
    const item: vscode.CompletionItem = new vscode.CompletionItem({ label: '@ahk-neko-format-ignore-block' });
    item.kind = vscode.CompletionItemKind.Snippet;
    item.insertText = new vscode.SnippetString('ahk-neko-format-ignore-block\n');
    item.detail = 'by-neko-help';

    /**
     * ```ahk
     * /*@ahk-neko-format-ignore-block
     *
     * ```
     */
    item.documentation = new vscode.MarkdownString(
        'ignore any format in /* block */',
        true,
    ).appendCodeblock([
        '/*@ahk-neko-format-ignore-block',
        '     any code while not format, I think this will reduce the interference with git-diff.',
        '  any code',
        '*/',
    ].join('\n'));

    return item;
})();
