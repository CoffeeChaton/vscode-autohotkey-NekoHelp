/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from 'vscode';
import { initNlsDefMap, readNlsJson } from '../nls_json.tools';
import type { BiVariables } from './BiVariables.data';

/**
 * built-in variables
 */

type TBi_VarMDMap = ReadonlyMap<string, vscode.MarkdownString>;
type TBi_snippet_list = readonly vscode.CompletionItem[];

export const [Bi_VarMDMap, snippetBiVar] = ((): [TBi_VarMDMap, TBi_snippet_list] => {
    const map1 = new Map<string, vscode.MarkdownString>();
    const List2: vscode.CompletionItem[] = [];
    //
    const BiVariablesData = readNlsJson('BiVariables') as typeof BiVariables;
    for (const v of BiVariablesData) {
        const {
            keyRawName,
            link,
            doc,
            exp,
        } = v;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(keyRawName, 'ahk')
            .appendMarkdown(`Built-in Variables ([Read Doc](${link}))`)
            .appendMarkdown('\n\n')
            .appendMarkdown(doc.join('\n'))
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');
        md.supportHtml = true;

        map1.set(keyRawName.toUpperCase(), md);
        //
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: keyRawName, // Left
            description: 'var', // Right
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

export function hoverBiVar(wordUp: string): vscode.MarkdownString | undefined {
    return Bi_VarMDMap.get(wordUp);
}

export function getSnipBiVar(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('A_')
        ? []
        : snippetBiVar;
}

export const biBVarDefMap: ReadonlyMap<string, [vscode.Location]> = initNlsDefMap('BiVariables');
