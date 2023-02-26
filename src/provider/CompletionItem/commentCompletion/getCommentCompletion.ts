/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-template-curly-in-string */
import * as vscode from 'vscode';
import { snippetAhk2exe } from '../../../tools/Built-in/Ahk2exe.tools';

const nekoExComment: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    type TData = {
        label: `;@ahk-neko-${string}`,
        insert: `;@ahk-neko-${string}`,
        doc: string,
        exp: readonly string[],
    };
    const data: readonly TData[] = [
        // diag
        {
            label: ';@ahk-neko-ignore XX line',
            insert: ';@ahk-neko-ignore ${1|1,2,999,any number|} line',
            doc: 'ignore diagnosis',
            exp: [
                ';@ahk-neko-ignore 1 line',
                ';@ahk-neko-ignore 2 line',
                ';@ahk-neko-ignore 999 line',
                '',
                ';use 0 to open diag',
                ';@ahk-neko-ignore 0 line',
            ],
        },
        {
            label: ';@ahk-neko-ignore-fn XX line',
            insert: ';@ahk-neko-ignore-fn ${1|1,2,999,any number|} line',
            doc: 'ignore diagnosis (5XX)',
            exp: [
                ';@ahk-neko-ignore-fn 1 line',
                ';@ahk-neko-ignore-fn 2 line',
                ';@ahk-neko-ignore-fn 999 line',
                '',
                ';use 0 to open diag',
                ';@ahk-neko-ignore-fn 0 line',
            ],
        },
        // format
        {
            label: ';@ahk-neko-format-ignore-start',
            insert: ';@ahk-neko-format-ignore-start\n;@ahk-neko-format-ignore-end',
            doc: 'ignore any format',
            exp: [
                ';@ahk-neko-format-ignore-start',
                ';@ahk-neko-format-ignore-end',
            ],
        },
        {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            label: ';@ahk-neko-format-ignore-end',
            insert: ';@ahk-neko-format-ignore-end',
            doc: 'ignore any format',
            exp: [
                ';@ahk-neko-format-ignore-start',
                ';@ahk-neko-format-ignore-end',
            ],
        },
        {
            label: ';@ahk-neko-format-inline-spacing-ignore-start',
            insert: ';@ahk-neko-format-inline-spacing-ignore-start\n;@ahk-neko-format-inline-spacing-ignore-end',
            doc: 'ignore `Alpha test options` format',
            exp: [
                ';@ahk-neko-format-inline-spacing-ignore-start',
                ';@ahk-neko-format-inline-spacing-ignore-end',
            ],
        },
        {
            label: ';@ahk-neko-format-inline-spacing-ignore-end',
            insert: ';@ahk-neko-format-inline-spacing-ignore-end',
            doc: 'ignore `Alpha test options` format',
            exp: [
                ';@ahk-neko-format-inline-spacing-ignore-start',
                ';@ahk-neko-format-inline-spacing-ignore-end',
            ],
        },
    ];
    const arr: vscode.CompletionItem[] = [];
    for (
        const {
            label,
            insert: insertText,
            doc,
            exp,
        } of data
    ) {
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label,
            // description: 'neko',
        });
        item.kind = vscode.CompletionItemKind.Snippet;
        item.insertText = new vscode.SnippetString(insertText.replace(/^;@/u, ''));
        item.detail = 'by-neko-help';

        const md: vscode.MarkdownString = new vscode.MarkdownString(doc, true);
        md.appendCodeblock(exp.join('\n'));
        item.documentation = md;

        arr.push(item);
    }
    return arr;
    //
})();

export function getCommentCompletion(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] | null {
    const subStr: string = document.lineAt(position.line).text.slice(0, position.character);

    return (/^\s*;@$/u).test(subStr)
        ? [...nekoExComment, ...snippetAhk2exe]
        : null;
}
