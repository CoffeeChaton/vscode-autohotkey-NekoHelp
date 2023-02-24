import * as vscode from 'vscode';
import { DirectivesList } from './Directives.data';

type TDirectivesMDMap = ReadonlyMap<string, vscode.MarkdownString>;
type TSnippetDirective = readonly vscode.CompletionItem[];

export const [SnippetDirectives, DirectivesMDMap] = ((): [TSnippetDirective, TDirectivesMDMap] => {
    //
    // initialize
    const map2 = new Map<string, vscode.MarkdownString>();
    const List1: vscode.CompletionItem[] = [];
    for (const v of DirectivesList) {
        const {
            keyRawName,
            insert,
            doc,
            link,
            exp,
            recommended,
        } = v;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown('#Directives')
            .appendCodeblock(keyRawName, 'ahk')
            .appendMarkdown(doc)
            .appendMarkdown('\n')
            .appendMarkdown(`[(Read Doc)](${link})`)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'));

        md.supportHtml = true;

        map2.set(keyRawName.toUpperCase().replace('#', ''), md);

        if (!recommended) continue;

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: keyRawName, // Left
            description: '#Directives', // Right
        });
        item.kind = vscode.CompletionItemKind.Event;
        item.insertText = new vscode.SnippetString(insert.replace('#', ''));

        item.detail = '#Directives (neko-help)';
        item.documentation = md;

        List1.push(item);
    }

    /**
     * after initialization clear
     */
    DirectivesList.length = 0;
    return [List1, map2]; // [Array(29),Map(35)]
})();

export function snipDirectives(subStr: string): readonly vscode.CompletionItem[] {
    return (/^#\w*$/iu).test(subStr)
        ? SnippetDirectives
        : [];
}
