import * as vscode from 'vscode';
import { DirectivesList } from './Directives.data';

type TDirectivesMDMap = ReadonlyMap<string, {
    md: vscode.MarkdownString,
    keyRawName: `#${string}`,
}>;
/**
 * replace('#', '')
 */
type TSnippetDirective = readonly vscode.CompletionItem[];

export const [SnippetDirectives, DirectivesMDMap] = ((): [TSnippetDirective, TDirectivesMDMap] => {
    //
    // initialize
    const map = new Map<string, { md: vscode.MarkdownString, keyRawName: `#${string}` }>();

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

        map.set(keyRawName.toUpperCase().replace('#', ''), {
            md,
            keyRawName,
        });

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
    return [List1, map]; // [Array(29),Map(35)]
})();

export function getSnipDirectives(subStr: string): readonly vscode.CompletionItem[] {
    return (/^#\w*$/iu).test(subStr)
        ? SnippetDirectives
        : [];
}
