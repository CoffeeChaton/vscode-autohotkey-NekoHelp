/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-template-curly-in-string */
import * as vscode from 'vscode';
import { snippetAhk2exeKeep, snippetAhk2exeLine } from '../../../tools/Built-in/Ahk2exe.tools';
import { nekoExCommentData } from '../../../tools/Built-in/nekoEx/nekoExComment.data';

const nekoExComment: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    const arr: vscode.CompletionItem[] = [];
    for (
        const {
            label,
            insert,
            doc,
            exp,
        } of nekoExCommentData
    ) {
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label,
            // description: 'neko',
        });
        item.kind = vscode.CompletionItemKind.Snippet;
        item.insertText = new vscode.SnippetString(insert.replace(/^;@/u, ''));
        item.detail = 'by-neko-help';

        const md: vscode.MarkdownString = new vscode.MarkdownString(doc, true);
        md.appendCodeblock(exp.join('\n'));
        item.documentation = md;

        arr.push(item);
    }
    nekoExCommentData.length = 0;
    return arr;
})();

/**
 * ```ahk
 * /*@ahk-neko-format-ignore-block
 *
 * ```
 */
const nekoFormatIgnoreBlockMd: vscode.MarkdownString = new vscode.MarkdownString(
    'ignore any format in /* block */',
    true,
).appendCodeblock([
    '/*@ahk-neko-format-ignore-block',
    '     any code while not format, I think this will reduce the interference with git-diff.',
    '  any code',
    '*/',
].join('\n'));

const nekoFormatIgnoreBlock: vscode.CompletionItem = ((): vscode.CompletionItem => {
    const item: vscode.CompletionItem = new vscode.CompletionItem({
        label: '@ahk-neko-format-ignore-block',
        // description: 'neko',
    });
    item.kind = vscode.CompletionItemKind.Snippet;
    item.insertText = new vscode.SnippetString('ahk-neko-format-ignore-block\n');
    item.detail = 'by-neko-help';
    item.documentation = nekoFormatIgnoreBlockMd;

    return item;
})();

export function getCommentCompletion(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] | null {
    const subStr: string = document.lineAt(position.line).text.slice(0, position.character);

    if ((/^\s*\/\*@$/u).test(subStr)) {
        return [...snippetAhk2exeKeep, nekoFormatIgnoreBlock];
    }

    return (/^\s*;@$/u).test(subStr)
        ? [...nekoExComment, ...snippetAhk2exeLine]
        : null;
}
