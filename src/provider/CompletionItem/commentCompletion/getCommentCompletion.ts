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

export function getCommentCompletion(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] | null {
    const subStr: string = document.lineAt(position.line).text.slice(0, position.character);

    if ((/^\s*\/\*@$/u).test(subStr)) {
        return [...snippetAhk2exeKeep];
    }

    return (/^\s*;@$/u).test(subStr)
        ? [...nekoExComment, ...snippetAhk2exeLine]
        : null;
}
