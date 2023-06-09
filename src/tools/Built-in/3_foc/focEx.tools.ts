import * as vscode from 'vscode';
import { focExDataList } from './focEx.data';

type TSnipList = readonly vscode.CompletionItem[];

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
export type TFocExMsgMap = ReadonlyMap<string, vscode.MarkdownString>;

const { focExSnip, focExMap } = ((): { focExSnip: TSnipList, focExMap: TFocExMsgMap } => {
    const focExMapRw = new Map<string, vscode.MarkdownString>();
    const List2: vscode.CompletionItem[] = [];

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
            .appendMarkdown(doc)
            .appendMarkdown(`\n[(Read Doc)](${link})`)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');
        item.documentation = md;

        List2.push(item);
        focExMapRw.set(keyRawName.toUpperCase(), md);
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
