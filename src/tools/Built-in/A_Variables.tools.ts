/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from 'vscode';
import { AVariablesList } from './A_Variables.data';

type TA_MD_Map = ReadonlyMap<string, vscode.MarkdownString>;
type TA_snippet_list = readonly vscode.CompletionItem[];

export const [AVariablesMDMap, snippetStartWihA] = ((): [TA_MD_Map, TA_snippet_list] => {
    const map1 = new Map<string, vscode.MarkdownString>();
    const List2: vscode.CompletionItem[] = [];
    //
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
            .appendMarkdown(`\n\n${doc}\n\n`)
            .appendMarkdown(`[Read Doc](${uri})`);
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

    /**
     * after initialization clear
     */
    AVariablesList.length = 0;
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
