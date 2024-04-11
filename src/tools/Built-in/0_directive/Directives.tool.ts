import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { EDetail } from '../../../globalEnum';
import { initNlsDefMap, readNlsJson } from '../nls_json.tools';
import type { TDirectivesList } from './Directives.data';

export type TDirectivesMeta = {
    md: vscode.MarkdownString,
    keyRawName: `#${string}`,
};

type TDirectivesMDMap = ReadonlyMap<string, TDirectivesMeta>;

/**
 * replace('#', '')
 */
type TSnippetDirective = readonly vscode.CompletionItem[];

export const [SnippetDirectives, DirectivesMDMap] = ((): [TSnippetDirective, TDirectivesMDMap] => {
    //
    // initialize
    const map = new Map<string, { md: vscode.MarkdownString, keyRawName: `#${string}` }>();

    const List1: vscode.CompletionItem[] = [];
    const DirectivesList = readNlsJson('Directives') as TDirectivesList[];
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
            .appendMarkdown(doc.join('\n'))
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

    return [List1, map]; // [Array(29),Map(35)]
})();

export function getSnipDirectives(subStr: string): readonly vscode.CompletionItem[] {
    return (/^#\w*$/iu).test(subStr)
        ? SnippetDirectives
        : [];
}

export function getDirectivesMeta(
    position: vscode.Position,
    AhkTokenLine: TAhkTokenLine,
): TDirectivesMeta | null {
    const { detail, lStr } = AhkTokenLine;
    if (!detail.includes(EDetail.isDirectivesLine)) {
        return null;
    }

    const ma: RegExpMatchArray | null = lStr.match(/(#\w+)/u);
    if (ma === null) return null;

    const { character } = position;
    const upName: string = ma[1].toUpperCase();

    const col: number = lStr.indexOf('#');
    if (col <= character && col + upName.length >= character) {
        const meta: TDirectivesMeta | undefined = DirectivesMDMap.get(upName.replace('#', ''));
        if (meta !== undefined) return meta;
    }

    return null;
}

export const DirectivesDefMap: ReadonlyMap<string, [vscode.Location]> = initNlsDefMap('Directives');

export function gotoDirectivesDef(
    position: vscode.Position,
    AhkTokenLine: TAhkTokenLine,
): [vscode.Location] | null {
    const meta: TDirectivesMeta | null = getDirectivesMeta(position, AhkTokenLine);
    if (meta === null) return null;

    const searchKey: string = meta.keyRawName.toUpperCase();
    return DirectivesDefMap.get(searchKey) ?? null;
}
