import * as vscode from 'vscode';
import type { TScanData } from '../../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../DeepAnalysis/FnVar/def/spiltCommandAll';
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

export type TFocExParser = {
    FocUpName: 'IF' | 'LOOP',

    /**
     * `IN` of `ifIn`
     */
    exUpName: string,
    /**
     * pos of `in`
     */
    lPos: number,
    strF: string,
};

export function getFocExLoopData(lStr: string, wordUpCol: number): TFocExParser | null {
    const strF: string = lStr
        .slice(wordUpCol)
        .replace(/^\s*Loop\b\s*,?\s*/iu, 'Loop,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);

    // Loop, Files
    //  a0   a1
    const a1: TScanData | undefined = arr.at(1);
    if (a1 === undefined) return null;
    const { lPos, RawNameNew } = a1;

    return {
        FocUpName: 'LOOP',
        exUpName: RawNameNew.trim().toUpperCase(),
        lPos,
        strF,
    };
}

export function getFocExIfData(lStr: string, wordUpCol: number): TFocExParser | null {
    const strF: string = lStr
        .slice(wordUpCol)
        .replace(/^\s*IF\b\s*,?\s*/iu, 'IF,')
        .padStart(lStr.length, ' ');

    const ma: RegExpMatchArray | null = strF.match(/(?<=[ \t])(between|contains|in|is)(?=[ \t])/iu);
    if (ma === null) return null;

    const name: string = ma[1];
    const lPos: number = ma.index ?? strF.indexOf(name);

    return {
        FocUpName: 'IF',
        exUpName: name.trim().toUpperCase(),
        lPos,
        strF,
    };
}
