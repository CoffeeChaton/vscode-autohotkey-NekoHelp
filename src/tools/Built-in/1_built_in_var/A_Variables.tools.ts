import * as vscode from 'vscode';
import { initNlsDefMap, readNlsJson } from '../nls.tools';
import type { TAElement } from './A_Variables.data';

type TA_MD_Map = ReadonlyMap<string, vscode.MarkdownString>;
type TA_snippet_list = readonly vscode.CompletionItem[];

export const [AVariablesMDMap, snippetStartWihA] = ((): [TA_MD_Map, TA_snippet_list] => {
    const map1 = new Map<string, vscode.MarkdownString>();
    const List2: vscode.CompletionItem[] = [];
    //
    const AVariablesList = readNlsJson('A_Variables') as TAElement[];
    for (const vv of AVariablesList) {
        const {
            uri,
            group,
            doc,
            body,
        } = vv;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(body, 'ahk')
            .appendMarkdown(group)
            .appendMarkdown(`\n\n[(Read Doc)](${uri})\n\n`)
            .appendMarkdown(doc.join('\n'));

        md.supportHtml = true;
        map1.set(body.toUpperCase(), md);
        //
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: body, // Left
            description: group, // Right
        });
        item.kind = vscode.CompletionItemKind.Variable; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = body;
        item.detail = 'Built-in Variables (neko-help)';
        item.documentation = md;
        //
        List2.push(item);
    }

    return [map1, List2];
})();

export function getSnippetStartWihA(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('A')
        ? snippetStartWihA
        : [];
}

export function hoverAVar(wordUp: string): vscode.MarkdownString | undefined {
    return AVariablesMDMap.get(wordUp);
}

export const biAVarDefMap: ReadonlyMap<string, [vscode.Location]> = initNlsDefMap('A_Variables', '"body": "');
