/* eslint-disable sonarjs/no-duplicate-string */
/* eslint no-magic-numbers: ["error", { "ignore": [0,3] }] */
import * as vscode from 'vscode';
import { funcDataList } from './func.data';

const baseGroup = ['COM', 'IL_', 'LV_', 'OBJ', 'SB_', 'TV_', '_'] as const;

type TrGroup = typeof baseGroup[number];

type TSnip = { readonly [k in TrGroup]: readonly vscode.CompletionItem[] };

export type TBiFuncMsg = {
    readonly md: vscode.MarkdownString,
    readonly keyRawName: string,
    readonly uri: string,
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

    type TV = typeof funcDataList[number];

    const makeMd = (v: TV): vscode.MarkdownString => {
        const {
            keyRawName,
            group,
            msg,
            link,
            exp,
        } = v;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown(`Built-in Function (${group})`)
            .appendCodeblock(`${keyRawName}()`, 'ahk')
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

    const otherComObjFuncList = [
        {
            group: 'COM',
            keyRawName: 'ComObjMissing',
            link: 'https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm',
            msg: [
                'Creates an object which may be used in place of an optional parameter\'s default value when calling a method of a COM object.',
                '[[v1.1.12+]](https://www.autohotkey.com/docs/v1/AHKL_ChangeLog.htm#v1.1.12.00 "Applies to AutoHotkey v1.1.12 and later"):',
                ' This function is obsolete. Instead, simply write two consecutive commas, as in `Obj.Method(1,,3)`',
                '**Deprecated:** The usages shown below are deprecated and may be altered or unavailable in a future release.',
            ],
            insert: 'ComObjMissing($0)',
            exp: [
                '; is Deprecated',
                'ParamObj := ComObjMissing()',
            ],
        },
        {
            group: 'COM',
            keyRawName: 'ComObjParameter',
            link: 'https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm',
            msg: [
                'Wraps a value and type to pass as a parameter to a COM method.',
                'In current versions, any function-call beginning with "ComObj" ',
                'that does not match one of the other COM functions actually calls ComObjActive.',
            ],
            insert: 'ComObjParameter($0)',
            exp: [
                '; is Deprecated',
                'MP := ComObjParameter(10,0x80020004)',
            ],
        },
        {
            group: 'COM',
            keyRawName: 'ComObjEnwrap',
            link: 'https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm',
            msg: [
                'Wraps/unwraps a COM object.',
                'In current versions, any function-call beginning with "ComObj" ',
                'that does not match one of the other COM functions actually calls ComObjActive.',
                'For example, `ComObjEnwrap(DispPtr)` and `[ComObjActive](https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm)(DispPtr)`',
            ],
            insert: 'ComObjEnwrap($0)',
            exp: [
                '; is Deprecated',
                'ComObject := ComObjEnwrap(DispPtr)',
            ],
        },
        {
            group: 'COM',
            keyRawName: 'ComObjUnwrap',
            link: 'https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm',
            msg: [
                'Wraps/unwraps a COM object.',
                '**Deprecated:** The usages shown below are deprecated and may be altered or unavailable in a future release.',
            ],
            insert: 'ComObjUnwrap($0)',
            exp: [
                '; is Deprecated',
                'DispPtr := ComObjUnwrap(ComObject)',
            ],
        },
    ] as const;

    for (const vv of otherComObjFuncList) {
        const { keyRawName, link } = vv;
        const upName = keyRawName.toUpperCase();
        const v = {
            upName,
            ...vv,
        };
        const md: vscode.MarkdownString = makeMd(v);
        map2.set(upName, { keyRawName, md, uri: link });
    }

    for (const v of funcDataList) {
        const { keyRawName, upName, link } = v;
        const md: vscode.MarkdownString = makeMd(v);
        map2.set(upName, { keyRawName, md, uri: link });

        const item: vscode.CompletionItem = makeSnip(v, md);

        const head = upName.slice(0, 3);
        const index: TrGroup = baseGroup.find((search: TrGroup) => search === head) ?? '_';
        Obj1[index].push(item);
    }

    /**
     * after initialization clear
     */
    funcDataList.length = 0;

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
    uri: 'https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm#Remarks',
};

export function getBuiltInFuncMD(keyUp: string): TBiFuncMsg | undefined {
    const result: TBiFuncMsg | undefined = BuiltInFuncMDMap.get(keyUp);
    if (result !== undefined) return result;

    if (keyUp.startsWith('ComObj'.toUpperCase())) {
        return ComObjResult;
    }
    return undefined;
}
