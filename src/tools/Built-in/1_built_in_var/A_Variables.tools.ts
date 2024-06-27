import * as vscode from 'vscode';
import { initNlsDefMap, readNlsJson } from '../nls_json.tools';
import type { TAElement } from './A_Variables.data';

type TA_MD_Map = ReadonlyMap<string, vscode.MarkdownString>;
type TA_snippet_list = readonly vscode.CompletionItem[];

const temp_AVariables = ((): [TA_MD_Map, TA_snippet_list] => {
    const map1 = new Map<string, vscode.MarkdownString>();
    const List2: vscode.CompletionItem[] = [];
    //
    const AVariablesList = readNlsJson('A_Variables') as TAElement[];
    for (const vv of AVariablesList) {
        const {
            uri,
            group,
            doc,
            keyRawName,
        } = vv;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(keyRawName, 'ahk')
            .appendMarkdown(group)
            .appendMarkdown(`\n\n[(Read Doc)](${uri})\n\n`)
            .appendMarkdown(doc.join('\n'));

        md.supportHtml = true;
        map1.set(keyRawName.toUpperCase(), md);
        //
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: keyRawName, // Left
            description: group, // Right
        });
        item.kind = vscode.CompletionItemKind.Variable; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = keyRawName;
        item.detail = 'Built-in Variables (neko-help)';
        item.documentation = md;
        //
        List2.push(item);
    }

    return [map1, List2];
})();

export const AVar_MDMap: TA_MD_Map = temp_AVariables[0];
export const AVar_snip: TA_snippet_list = temp_AVariables[1];

export function getSnippetStartWihA(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('A')
        ? AVar_snip
        : [];
}

export function hoverAVar(wordUp: string): vscode.MarkdownString | undefined {
    return AVar_MDMap.get(wordUp);
}

export const biAVarDefMap: ReadonlyMap<string, [vscode.Location]> = initNlsDefMap('A_Variables');
