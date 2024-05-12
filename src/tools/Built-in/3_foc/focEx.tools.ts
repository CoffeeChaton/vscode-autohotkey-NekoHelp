import * as vscode from 'vscode';
import { initNlsDefMap, readNlsJson } from '../nls_json.tools';
import type { TStatementElement } from './foc.data';

type TSnipList = readonly vscode.CompletionItem[];

export type TFocExMeta = {
    ID: string,
    md: vscode.MarkdownString,
};
/**
 * ```ahk
 *  if between
 *  if contains
 *  if in
 *  if is
 *  Loop, Files
 *  Loop, Parse
 *  Loop, Read
 *  Loop, Reg
 *  ```
 */
type TFocExMsgMap = ReadonlyMap<string, TFocExMeta>;

const { focExSnip, focExMap } = ((): { focExSnip: TSnipList, focExMap: TFocExMsgMap } => {
    const focExMapRw = new Map<string, TFocExMeta>();
    const List2: vscode.CompletionItem[] = [];

    const focExDataList: TStatementElement[] = readNlsJson('focEx') as TStatementElement[];
    for (const v of focExDataList) {
        const {
            doc,
            body,
            link,
            exp,
            keyRawName,
        } = v;
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: keyRawName,
            description: 'Flow of Control',
        });
        item.kind = vscode.CompletionItemKind.Snippet; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = new vscode.SnippetString(body);
        item.detail = 'Flow of Control (neko-help)';
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(keyRawName, 'ahk')
            .appendMarkdown(doc.join('\n'))
            .appendMarkdown(`\n[(Read Doc)](${link})`)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');
        item.documentation = md;

        List2.push(item);
        const ID: string = keyRawName.toUpperCase();
        focExMapRw.set(ID, { md, ID });
    }
    return {
        focExSnip: List2,
        focExMap: focExMapRw,
    };
})();

export function getSnipFocEx(subStr: string): TSnipList {
    return (/^\s*\w*$/iu).test(subStr)
        ? focExSnip
        : [];
}

export const focExMapOut: TFocExMsgMap = focExMap;
export const focExDefMap: ReadonlyMap<string, [vscode.Location]> = initNlsDefMap('focEx');
