/* eslint-disable sonarjs/no-duplicate-string */
/* eslint no-magic-numbers: ["error", { "ignore": [0,3] }] */
import * as vscode from 'vscode';
import { initNlsDefMap, readNlsJson } from '../nls.tools';
import type { TBuiltInFuncElement } from './func.data';

const baseGroup = ['COM', 'IL_', 'LV_', 'OBJ', 'SB_', 'TV_', '_'] as const;

type TrGroup = typeof baseGroup[number];

type TSnip = { readonly [k in TrGroup]: readonly vscode.CompletionItem[] };

export type TBiFuncMsg = {
    readonly md: vscode.MarkdownString,
    readonly keyRawName: string,
    readonly link: string,
    readonly sign: string,
};
type TBiFuncMap = ReadonlyMap<string, TBiFuncMsg>;

//
const [SnippetObj, BuiltInFuncMDMap] = ((): [TSnip, TBiFuncMap] => {
    // initialize
    type TSnipTemp = { [k in TrGroup]: vscode.CompletionItem[] };

    const Obj1: TSnipTemp = {
        COM: [],
        IL_: [],
        LV_: [],
        OBJ: [],
        SB_: [],
        TV_: [],
        _: [],
    };

    const map2 = new Map<string, TBiFuncMsg>();

    type TV = TBuiltInFuncElement;

    const makeMd = (v: TV): vscode.MarkdownString => {
        const {
            group,
            msg,
            link,
            exp,
            sign,
        } = v;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown(`Built-in Function (${group})`)
            .appendCodeblock(sign, 'ahk')
            .appendMarkdown(msg.join('\n'))
            .appendMarkdown('\n')
            .appendMarkdown(`[(Read Doc)](${link})`)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'));

        md.supportHtml = true;
        return md;
    };

    const makeSnip = (v: TV, md: vscode.MarkdownString): vscode.CompletionItem => {
        const { keyRawName, group, insert } = v;
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: `${keyRawName}()`, // Left
            description: group, // Right
        });
        item.kind = vscode.CompletionItemKind.Function;
        item.insertText = new vscode.SnippetString(insert);

        item.detail = 'Built-in Function (neko-help)';
        item.documentation = md;

        return item;
    };

    const r: TV[] = readNlsJson('func') as TV[];

    for (const v of r) {
        const {
            keyRawName,
            upName,
            link,
            sign,
        } = v;
        const md: vscode.MarkdownString = makeMd(v);
        map2.set(upName, {
            keyRawName,
            md,
            link,
            sign,
        });

        const item: vscode.CompletionItem = makeSnip(v, md);

        const head: string = upName.slice(0, 3);
        const index: TrGroup = baseGroup.find((search: TrGroup) => search === head) ?? '_';
        Obj1[index].push(item);
    }

    return [Obj1, map2];
})();

export function BuiltInFunc2Completion(PartStr: string): readonly vscode.CompletionItem[] {
    if (PartStr.length < 3) {
        const result: vscode.CompletionItem[] = [];
        for (const v of Object.values(SnippetObj)) {
            result.push(...v);
        }
        return result; // all case
    }

    // head.len is 3 !== '_'
    const head: string = PartStr.slice(0, 3).toUpperCase();
    const index: TrGroup = baseGroup.find((v: TrGroup) => v === head) ?? '_';

    return SnippetObj[index]; // some case
}

const ComObjResult: TBiFuncMsg = {
    keyRawName: 'some function start with "ComObj"',
    md: new vscode.MarkdownString('', true)
        .appendMarkdown('Built-in Function (COM)')
        .appendCodeblock('ComObjActive()', 'ahk')
        .appendMarkdown(
            'In current versions, any function-call beginning with "ComObj" that does not match one of the other COM functions actually calls `ComObjActive`. For example, `ComObjEnwrap(DispPtr)` and `[ComObjActive](https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm)(DispPtr)` are both equivalent to `[ComObject](https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm)(DispPtr)` (_VarType_ 9 is implied). However, this behaviour will be unavailable in a future release, so it is best to use only `[ComObject](https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm)()` and `[ComObjActive](https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm)()` as shown on this page.',
        )
        .appendMarkdown('\n')
        .appendMarkdown('[(Read Doc)](https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm#Remarks)'),
    link: 'https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm#Remarks',
    sign: 'ComObj_XXX()',
};

export function getBuiltInFuncMD(keyUp: string): TBiFuncMsg | undefined {
    const result: TBiFuncMsg | undefined = BuiltInFuncMDMap.get(keyUp);
    if (result !== undefined) return result;

    if (keyUp.startsWith('ComObj'.toUpperCase())) {
        return ComObjResult;
    }
    return undefined;
}

export const biFuDefMap: ReadonlyMap<string, [vscode.Location]> = initNlsDefMap('func', '"keyRawName": "');
