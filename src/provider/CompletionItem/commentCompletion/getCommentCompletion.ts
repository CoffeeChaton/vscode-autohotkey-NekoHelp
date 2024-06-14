import * as vscode from 'vscode';
import { $t } from '../../../i18n';
import { nekoExComment, nekoFormatIgnoreBlock } from '../../../tools/Built-in/100_other/nekoEx/nekoExComment.tool';
import { snippetAhk2exeKeep, snippetAhk2exeLine } from '../../../tools/Built-in/99_Ahk2Exe_compiler/Ahk2exe.tools';

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

export const regionCompletion: readonly vscode.CompletionItem[] = [
    // eslint-disable-next-line no-template-curly-in-string
    '#MARK: ${0:text}',
    '#Region', // i don't why use "#region" send "r" , vscode will miss it... need to use UpCase...
    '#Endregion',
].map((s: string): vscode.CompletionItem => {
    //
    const item = new vscode.CompletionItem({
        label: s.replace(/:.*/u, ''),
        description: '#region',
    }, vscode.CompletionItemKind.Snippet);
    item.insertText = new vscode.SnippetString(s.replace('#', ''));
    item.detail = ';#region (neko-help)';
    const md = new vscode.MarkdownString($t('about.code.folding'), true);
    item.documentation = md;

    return item;
});
