/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-param-reassign */
import * as vscode from 'vscode';
import { readNlsJson } from '../nls_json.tools';
import type { TBiObj } from './ObjBase.data';
import type { TFuncCompletion } from './ObjFunc.data';
import type { TObjInputHook } from './ObjInputHook.data';

const ItemOfAhkObj: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const itemS: vscode.CompletionItem[] = [];
    for (const { insert, doc, uri } of readNlsJson('ObjBase') as TBiObj[]) {
        const isMethod: boolean = insert.includes('(');
        const kind = isMethod
            ? vscode.CompletionItemKind.Method
            : vscode.CompletionItemKind.Property;

        const item = new vscode.CompletionItem({
            label: insert,
            description: 'BaseObj',
        }, kind);
        item.detail = isMethod
            ? 'neko help : AhkObj Methods'
            : 'neko help : AhkObj Property';
        item.documentation = new vscode.MarkdownString(`\n[(Read Doc)](${uri})\n${doc.join('\n\n')}`, true);
        itemS.push(item);
    }
    return itemS;
})();

const ItemOfAhkFile: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    // File := FileOpen()
    const itemS: vscode.CompletionItem[] = [];

    for (
        const {
            insert,
            keyRawName,
            doc,
            uri,
        } of readNlsJson('ObjFile') as TBiObj[]
    ) {
        const isMethod: boolean = keyRawName.includes('(');
        const kind = isMethod
            ? vscode.CompletionItemKind.Method
            : vscode.CompletionItemKind.Property;

        const item = new vscode.CompletionItem({
            label: keyRawName, // Left
            description: 'File := FileOpen()', // Right
        }, kind);
        item.insertText = new vscode.SnippetString(insert);
        item.detail = isMethod
            ? 'neko help : FileOpen() -> Method'
            : 'neko help : FileOpen() -> Properties';
        item.documentation = new vscode.MarkdownString(`\n[(Read Doc)](${uri})\n${doc.join('\n\n')}`, true);
        itemS.push(item);
    }

    return itemS;
})();

const ItemOfAhkFunc: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const itemS: vscode.CompletionItem[] = [];

    for (const v of readNlsJson('ObjFunc') as TFuncCompletion[]) {
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
        const item = new vscode.CompletionItem({
            label: keyRawName,
            description: 'fn := Func()',
        }, kind);
        item.detail = `neko help : Func() ${st}`;

        if (isMethod) {
            item.insertText = new vscode.SnippetString(keyRawName.replace('()', '($0)'));
        }

        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown(`(Func) ${st}`)
            .appendMarkdown(`\n[(Read Doc)](${uri})\n`)
            .appendMarkdown(doc.join('\n\n'))
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'));

        md.supportHtml = true;
        item.documentation = md;
        itemS.push(item);
    }

    return itemS;
})();

const ItemOfAhkException: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const itemS: vscode.CompletionItem[] = [];
    for (const { insert, doc, uri } of readNlsJson('ObjException') as TBiObj[]) {
        const md = new vscode.MarkdownString('', true)
            .appendMarkdown(`[(Read Doc)](${uri})\n`)
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

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: insert,
            description: 'catch err',
        }, vscode.CompletionItemKind.Property);
        item.detail = 'neko help: error -> Exception()';
        item.documentation = md;
        itemS.push(item);
    }

    return itemS;
})();

const ItemOfAhkInputHook: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const itemS: vscode.CompletionItem[] = [];
    for (
        const {
            doc,
            exp,
            insert,
            keyRawName,
            uri,
        } of readNlsJson('ObjInputHook') as TObjInputHook[]
    ) {
        const isMethod: boolean = insert.includes('(');

        const item = new vscode.CompletionItem(
            {
                label: keyRawName,
                description: 'InputHook()',
            },
            isMethod
                ? vscode.CompletionItemKind.Method
                : vscode.CompletionItemKind.Property,
        );
        item.detail = isMethod
            ? 'neko help : InputHook() Methods'
            : 'neko help : InputHook() Property';
        item.insertText = new vscode.SnippetString(insert);
        const md = new vscode.MarkdownString('', true)
            .appendMarkdown(`[(Read Doc)](${uri})\n`)
            .appendMarkdown(doc.join('\n\n'))
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'));
        md.supportHtml = true;

        item.documentation = md;

        itemS.push(item);
    }
    return itemS;
})();

export type TAhkBaseObj = {
    ahkArray: boolean,
    ahkFileOpen: boolean,
    ahkFuncObject: boolean,
    ahkBase: boolean,
    ahkCatch: boolean, // https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception
    ahkInputHook: boolean,
};

export function ahkBaseWrap(Obj: TAhkBaseObj): vscode.CompletionItem[] {
    const itemS: vscode.CompletionItem[] = [];
    // if (Obj.ahkArray) itemS.push(...ItemOfAhkArray);
    if (Obj.ahkFileOpen) itemS.push(...ItemOfAhkFile);
    if (Obj.ahkFuncObject) itemS.push(...ItemOfAhkFunc);
    if (Obj.ahkBase) itemS.push(...ItemOfAhkObj);
    if (Obj.ahkCatch) itemS.push(...ItemOfAhkException);
    if (Obj.ahkInputHook) itemS.push(...ItemOfAhkInputHook);
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
    if (!Obj.ahkArray && (strPart.startsWith('[') || (/^(?:Array|StrSplit)\(/iu).test(strPart))) {
        Obj.ahkArray = true;
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
