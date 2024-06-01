/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-param-reassign */
import * as vscode from 'vscode';
import { ObjBase } from './ObjBase.data';
import { ObjException } from './ObjException.data';
import { ObjFile } from './ObjFile.data';
import { ObjFunc } from './ObjFunc.data';

const ItemOfAhkObj: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const itemS: vscode.CompletionItem[] = [];
    for (const { insert, doc } of ObjBase) {
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
        item.documentation = new vscode.MarkdownString(doc.join('\n\n'), true);
        itemS.push(item);
    }
    return itemS;
})();

const ItemOfAhkFile: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    // File := FileOpen()
    const itemS: vscode.CompletionItem[] = [];

    for (const { insert, keyRawName, doc } of ObjFile) {
        // TODO    if (keyRawName.startsWith('Read') || keyRawName.startsWith('Write')) continue;

        const isMethod: boolean = keyRawName.includes('(');
        const kind = isMethod
            ? vscode.CompletionItemKind.Method
            : vscode.CompletionItemKind.Property;

        const item = new vscode.CompletionItem({
            label: insert, // Left
            description: 'File := FileOpen()', // Right
        }, kind);
        item.detail = isMethod
            ? 'neko help : FileOpen() -> Method'
            : 'neko help : FileOpen() -> Properties';
        item.documentation = new vscode.MarkdownString(doc.join('\n\n'), true);
        itemS.push(item);
    }

    // for (
    //     const v of [
    //         'ReadUInt()',
    //         'ReadInt()',
    //         'ReadInt64()',
    //         'ReadShort()',
    //         'ReadUShort()',
    //         'ReadChar()',
    //         'ReadUChar()',
    //         'ReadDouble()',
    //         'ReadFloat()',
    //     ]
    // ) {

    const itemReadNumType = new vscode.CompletionItem({
        label: 'ReadNumType(Num)',
        description: 'File := FileOpen()',
    }, vscode.CompletionItemKind.Method);
    itemReadNumType.detail = 'neko help : FileOpen() -> ReadNumType';
    itemReadNumType.documentation = new vscode.MarkdownString(
        [
            'Reads a number from the file and advances the file pointer.',
            '```NumType``` is either UInt, Int, Int64, Short, UShort, Char, UChar, Double, or Float. These type names have the same meanings as with ```DllCall()```.',
            '*Returns* a number if successful, otherwise an empty string.',
            'If a Try statement is active and no bytes were read, an exception is thrown. However, no exception is thrown if at least one byte was read, even if the size of the given NumType is greater than the number of bytes read. Instead, the missing bytes are assumed to be zero.',
            'https://www.autohotkey.com/docs/v1/lib/File.htm#ReadNum',
        ].join('\n\n'),
        true,
    );
    itemReadNumType.insertText = new vscode.SnippetString(
        // eslint-disable-next-line no-template-curly-in-string
        'Read${1|UInt,Int,Int64,Short,UShort,Char,UChar,Double,Float|}($0)',
    );

    itemS.push(itemReadNumType);
    //

    // for (
    //     const v of [
    //         'WriteUInt(Num)',
    //         'WriteInt(Num)',
    //         'WriteInt64(Num)',
    //         'WriteShort(Num)',
    //         'WriteUShort(Num)',
    //         'WriteChar(Num)',
    //         'WriteUChar(Num)',
    //         'WriteDouble(Num)',
    //         'WriteFloat(Num)',
    //     ]
    // ) {}

    const itemWriteNumType = new vscode.CompletionItem({
        label: 'WriteNumType(Num)',
        description: 'File := FileOpen()',
    }, vscode.CompletionItemKind.Method);
    itemWriteNumType.detail = 'neko help : FileOpen() -> WriteNumType';
    itemWriteNumType.documentation = new vscode.MarkdownString(
        [
            'Writes a number to the file and advances the file pointer.',
            '```Num```:A number to write.',
            '```NumType``` is either UInt, Int, Int64, Short, UShort, Char, UChar, Double, or Float. These type names have the same meanings as with ```DllCall()```.',
            '*Returns* the number of bytes that were written. For instance, WriteUInt returns 4 if successful.',
            'https://www.autohotkey.com/docs/v1/lib/File.htm#WriteNum',
        ].join('\n\n'),
        true,
    );

    itemWriteNumType.insertText = new vscode.SnippetString(
        // eslint-disable-next-line no-template-curly-in-string
        'Write${1|UInt,Int,Int64,Short,UShort,Char,UChar,Double,Float|}($0)',
    );

    itemS.push(itemWriteNumType);
    return itemS;
})();

const ItemOfAhkFunc: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const itemS: vscode.CompletionItem[] = [];

    for (const v of ObjFunc) {
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
            .appendMarkdown(doc.join('\n\n'))
            .appendMarkdown('\n')
            .appendMarkdown(`[(Read Doc)](${uri})`)
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
    for (const { insert, doc, uri } of ObjException) {
        const md = new vscode.MarkdownString(doc.join('\n\n'), true)
            .appendMarkdown(`\n[(read doc)](${uri})`)
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
    // TODO ahkInputHook
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
