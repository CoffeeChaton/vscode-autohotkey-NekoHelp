import * as vscode from 'vscode';
import { $t } from '../../../i18n';

const regionCompletion: readonly vscode.CompletionItem[] = [
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

export function getRegionCompletion(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] {
    const subStr: string = document.lineAt(position.line).text.slice(0, position.character);

    if ((/^\s*;\s*#\w*$/u).test(subStr)) {
        return [...regionCompletion];
    }
    return [];
}
