/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-param-reassign */
import * as vscode from 'vscode';
import { initNlsDefMap, readNlsJson } from '../nls_json.tools';
import { CAhkBiObjCompletionItem } from './CAhkBiObjCompletionItem';
import type { ObjBase } from './ObjBase.data';
import type { ObjException } from './ObjException.data';
import type { ObjFile } from './ObjFile.data';
import type { ObjFunc } from './ObjFunc.data';
import type { ObjInputHook } from './ObjInputHook.data';

type TMdMapValue = { md: vscode.MarkdownString, keyRawName: string };

type TAhkObj = {
    snip: readonly CAhkBiObjCompletionItem[],
    MdMap: ReadonlyMap<string, TMdMapValue>,
    DefMap: ReadonlyMap<string, [vscode.Location]>,
};

export type TAhkBaseObj = {
    // ahkArray: boolean,
    ahkFileOpen: boolean,
    ahkFuncObject: boolean,
    ahkBase: boolean,
    ahkCatch: boolean, // https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception
    ahkInputHook: boolean,
};

type TA = {
    [k in keyof TAhkBaseObj]: TAhkObj;
};

const a: TA = ((): TA => {
    const ahkBase: TAhkObj = ((): TAhkObj => {
        const MdMap = new Map<string, TMdMapValue>();
        const itemS: CAhkBiObjCompletionItem[] = [];
        for (
            const {
                insert,
                doc,
                uri,
                keyRawName,
            } of readNlsJson('ObjBase') as typeof ObjBase
        ) {
            const isMethod: boolean = insert.includes('(');
            const kind = isMethod
                ? vscode.CompletionItemKind.Method
                : vscode.CompletionItemKind.Property;

            const detail = isMethod
                ? 'neko help : AhkObj Methods'
                : 'neko help : AhkObj Property';

            const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
                .appendCodeblock(`{}.${keyRawName} or [].${keyRawName}`, 'ahk')
                .appendMarkdown(`\n\n[(Read Doc)](${uri})\n\n`)
                .appendMarkdown(doc.join('\n'));
            md.supportHtml = true;

            const item2 = new CAhkBiObjCompletionItem(
                keyRawName,
                kind,
                detail,
                'BaseObj',
                md,
                new vscode.SnippetString(insert),
            );
            itemS.push(item2);
            MdMap.set(keyRawName.toUpperCase().replace('()', ''), { md, keyRawName });
        }

        return {
            snip: itemS,
            MdMap,
            DefMap: initNlsDefMap('ObjBase'),
        };
    })();

    const ahkFileOpen: TAhkObj = ((): TAhkObj => {
        const MdMap = new Map<string, TMdMapValue>();
        const itemS: CAhkBiObjCompletionItem[] = [];

        for (
            const {
                insert,
                keyRawName,
                doc,
                uri,
            } of readNlsJson('ObjFile') as typeof ObjFile
        ) {
            const isMethod: boolean = keyRawName.includes('(');
            const kind = isMethod
                ? vscode.CompletionItemKind.Method
                : vscode.CompletionItemKind.Property;

            const detail = isMethod
                ? 'neko help : FileOpen() -> Method'
                : 'neko help : FileOpen() -> Properties';

            const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
                .appendCodeblock(`FileOpen().${keyRawName}`, 'ahk')
                .appendMarkdown(`\n\n[(Read Doc)](${uri})\n\n`)
                .appendMarkdown(doc.join('\n'));
            md.supportHtml = true;

            const item2 = new CAhkBiObjCompletionItem(
                keyRawName,
                kind,
                detail,
                'File := FileOpen()',
                md,
                new vscode.SnippetString(insert),
            );
            itemS.push(item2);
            MdMap.set(keyRawName.toUpperCase().replace('()', ''), { md, keyRawName });
        }

        return {
            snip: itemS,
            MdMap,
            DefMap: initNlsDefMap('ObjFile'),
        };
    })();

    const ahkFuncObject: TAhkObj = ((): TAhkObj => {
        const MdMap = new Map<string, TMdMapValue>();
        const itemS: CAhkBiObjCompletionItem[] = [];

        for (const v of readNlsJson('ObjFunc') as typeof ObjFunc) {
            const {
                keyRawName,
                exp,
                doc,
                uri,
            } = v;

            const isMethod: boolean = keyRawName.includes('(');
            const kind = isMethod
                ? vscode.CompletionItemKind.Method
                : vscode.CompletionItemKind.Property;

            const st = isMethod
                ? 'Method'
                : 'property';

            const insertText: vscode.SnippetString = isMethod
                ? new vscode.SnippetString(keyRawName.replace('()', '($0)'))
                : new vscode.SnippetString(keyRawName);

            const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
                .appendCodeblock(`Func().${keyRawName}`, 'ahk')
                .appendMarkdown(`\n[(Read Doc)](${uri})\n`)
                .appendMarkdown(doc.join('\n\n'))
                .appendMarkdown('\n\n***')
                .appendMarkdown('\n\n*exp:*')
                .appendCodeblock(exp.join('\n'));
            md.supportHtml = true;

            md.supportHtml = true;
            const item2 = new CAhkBiObjCompletionItem(
                keyRawName,
                kind,
                `neko help : Func() ${st}`,
                'fn := Func()',
                md,
                insertText,
            );
            itemS.push(item2);
            MdMap.set(keyRawName.toUpperCase().replace('()', ''), { md, keyRawName });
        }

        return {
            snip: itemS,
            MdMap,
            DefMap: initNlsDefMap('ObjFunc'),
        };
    })();

    const ahkCatch: TAhkObj = ((): TAhkObj => {
        const MdMap = new Map<string, TMdMapValue>();
        const itemS: CAhkBiObjCompletionItem[] = [];
        for (
            const {
                doc,
                insert,
                keyRawName,
                uri,
            } of readNlsJson('ObjException') as typeof ObjException
        ) {
            const md = new vscode.MarkdownString('', true)
                .appendCodeblock(`Exception().${keyRawName}`, 'ahk')
                .appendMarkdown(`\n\n[(Read Doc)](${uri})\n\n`)
                .appendMarkdown(doc.join('\n\n'))
                .appendCodeblock([
                    'Key1 := "F11"',
                    'Try, Hotkey, %Key1%, label1',
                    '',
                    'Catch err {',
                    '    MsgBox, % "Extra : " err.Extra ;Extra : label1',
                    '    MsgBox, % "File : " err.File ; C:\\XXXX\\exp.ahk',
                    '    MsgBox, % "Line : " err.Line ; 10',
                    '    MsgBox, % "Message : " err.Message ;Target label does not exist.',
                    '    MsgBox, % "What : " err.What ;Hotkey',
                    '}',
                ].join('\n'));
            md.supportHtml = true;

            const item2 = new CAhkBiObjCompletionItem(
                keyRawName,
                vscode.CompletionItemKind.Property,
                'neko help: error -> Exception()',
                'catch err',
                md,
                new vscode.SnippetString(insert),
            );
            itemS.push(item2);
            MdMap.set(keyRawName.toUpperCase().replace('()', ''), { md, keyRawName });
        }

        return {
            snip: itemS,
            MdMap,
            DefMap: initNlsDefMap('ObjException'),
        };
    })();

    const ahkInputHook: TAhkObj = ((): TAhkObj => {
        const MdMap = new Map<string, TMdMapValue>();
        const itemS: CAhkBiObjCompletionItem[] = [];
        for (
            const {
                doc,
                exp,
                insert,
                keyRawName,
                uri,
            } of readNlsJson('ObjInputHook') as typeof ObjInputHook
        ) {
            const isMethod: boolean = insert.includes('(');

            const md = new vscode.MarkdownString('', true)
                .appendCodeblock(`InputHook().${keyRawName}`, 'ahk')
                .appendMarkdown(`\n\n[(Read Doc)](${uri})\n\n`)
                .appendMarkdown(doc.join('\n\n'))
                .appendMarkdown('\n\n***')
                .appendMarkdown('\n\n*exp:*')
                .appendCodeblock(exp.join('\n'));

            md.supportHtml = true;

            const item2 = new CAhkBiObjCompletionItem(
                keyRawName,
                isMethod
                    ? vscode.CompletionItemKind.Method
                    : vscode.CompletionItemKind.Property,
                isMethod
                    ? 'neko help : InputHook() Methods'
                    : 'neko help : InputHook() Property',
                'InputHook()',
                md,
                new vscode.SnippetString(insert),
            );

            itemS.push(item2);
            MdMap.set(keyRawName.toUpperCase().replace('()', ''), { md, keyRawName });
        }

        return {
            snip: itemS,
            MdMap,
            DefMap: initNlsDefMap('ObjInputHook'),
        };
    })();

    return {
        ahkBase,
        ahkCatch,
        ahkFileOpen,
        ahkFuncObject,
        ahkInputHook,
    };
})();

export function ahkBaseWrap(Obj: TAhkBaseObj): vscode.CompletionItem[] {
    // if (Obj.ahkArray) itemS.push(...ItemOfAhkArray);
    // if (Obj.ahkBase) itemS.push(...a.ahkBase.snip);
    // if (Obj.ahkCatch) itemS.push(...a.ahkCatch.snip);
    // if (Obj.ahkFileOpen) itemS.push(...a.ahkFileOpen.snip);
    // if (Obj.ahkFuncObject) itemS.push(...a.ahkFuncObject.snip);
    // if (Obj.ahkInputHook) itemS.push(...a.ahkInputHook.snip);

    const itemS: vscode.CompletionItem[] = [];
    for (const [k, v] of Object.entries(Obj)) {
        if (v) {
            const d0: TAhkObj = a[k as keyof TAhkBaseObj];
            itemS.push(...d0.snip);
        }
    }
    return itemS;
}

export function ahkBaseGetMd(Obj: TAhkBaseObj, wordLast: string): string[] {
    const itemS: string[] = [];
    for (const [k, v] of Object.entries(Obj)) {
        if (v) {
            const d0: TAhkObj = a[k as keyof TAhkBaseObj];
            const d1: TMdMapValue | undefined = d0.MdMap.get(wordLast);
            if (d1 !== undefined) itemS.push(d1.md.value);
        }
    }
    return itemS;
}

export function ahkBaseGetDef(Obj: TAhkBaseObj, wordLast: string): vscode.Location[] {
    const itemS: vscode.Location[] = [];
    for (const [k, v] of Object.entries(Obj)) {
        if (!v) continue;
        const d0: TAhkObj = a[k as keyof TAhkBaseObj];
        const d1: TMdMapValue | undefined = d0.MdMap.get(wordLast);
        if (d1 === undefined) continue;

        const loc: [vscode.Location] | undefined = d0.DefMap.get(d1.keyRawName.toUpperCase());
        if (loc !== undefined) itemS.push(...loc);
    }
    return itemS;
}

export function ahkBaseUp(strPart: string, Obj: TAhkBaseObj): TAhkBaseObj {
    // fileOpen() https://www.autohotkey.com/docs/v1/lib/FileOpen.htm
    // file := FileOpen(Filename, Flags , Encoding)
    //          ^
    if (!Obj.ahkFileOpen && (/^FileOpen\(/iu).test(strPart)) {
        Obj.ahkFileOpen = true;
        Obj.ahkBase = true;
        return Obj;
    }
    // https://www.autohotkey.com/docs/v1/lib/Func.htm
    // FunctionReference := Func(FunctionName)
    //                       ^
    if (!Obj.ahkFuncObject && (/^Func\(/iu).test(strPart)) {
        Obj.ahkFuncObject = true;
        Obj.ahkBase = true;
        return Obj;
    }
    // https://www.autohotkey.com/docs/v1/lib/Array.htm
    // Array := [Item1, Item2, ..., ItemN]
    //          ^ ; this `[`
    if (!Obj.ahkBase && (strPart.startsWith('[') || (/^(?:Array|StrSplit)\(/iu).test(strPart))) {
        Obj.ahkBase = true;
        Obj.ahkBase = true;
        return Obj;
    }

    // https://www.autohotkey.com/docs/v1/Objects.htm#Usage_Freeing_Objects
    // obj := {}  ; Creates an object.
    //        ^ ; this `{'
    //
    // obj1 := Object()
    //            ^
    if (!Obj.ahkBase && (strPart.startsWith('{') || (/^Object\(/iu).test(strPart))) {
        Obj.ahkBase = true;
        return Obj;
    }

    // https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception
    // err := Exception()
    // err.message = "some error"
    // throw err
    //
    // catch e use valTrackCore() to search
    if (!Obj.ahkCatch && (/^Exception\(/iu).test(strPart)) {
        Obj.ahkCatch = true;
        return Obj;
    }

    // https://www.autohotkey.com/docs/v1/lib/InputHook.htm#object
    // InputHook(
    if (!Obj.ahkInputHook && (/^InputHook\(/iu).test(strPart)) {
        Obj.ahkInputHook = true;
        return Obj;
    }
    return Obj;
}
