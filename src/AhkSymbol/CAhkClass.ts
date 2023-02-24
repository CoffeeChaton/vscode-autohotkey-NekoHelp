/* eslint-disable max-classes-per-file */
import * as vscode from 'vscode';
import type { CAhkFunc } from './CAhkFunc';

type TCAhkClassInstanceVarParam = {
    name: string,
    range: vscode.Range,
    selectionRange: vscode.Range,
    uri: vscode.Uri,
    detail: 'Instance Var' | 'static ClassVar',
    isStatic: boolean,
};

export class CAhkClassInstanceVar extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/v1/Objects.htm#Custom_Classes_var
    public readonly uri: vscode.Uri;
    public readonly isStatic: boolean;
    declare public readonly kind: vscode.SymbolKind.Variable;
    declare public readonly detail: 'Instance Var' | 'static ClassVar';
    declare public readonly children: [];

    public constructor(
        {
            range,
            selectionRange,
            uri,
            detail,
            name,
            isStatic,
        }: TCAhkClassInstanceVarParam,
    ) {
        super(name, detail, vscode.SymbolKind.Variable, range, selectionRange);
        this.uri = uri;
        this.isStatic = isStatic;
    }
}

export class CAhkClassGetSet extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/v1/Objects.htm#Custom_Classes_property

    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Property;
    declare public readonly detail: 'Property';
    declare public readonly children: [];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: {
            name: string,
            range: vscode.Range,
            selectionRange: vscode.Range,
            uri: vscode.Uri,
        },
    ) {
        super(name, 'Property', vscode.SymbolKind.Property, range, selectionRange);
        this.uri = uri;
    }
}

export type TClassChildren = CAhkClass | CAhkClassGetSet | CAhkClassInstanceVar | CAhkFunc;

// AhkSymbol instanceof CAhkClass
export class CAhkClass extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/v1/Objects.htm#Custom_Classes
    // https://www.autohotkey.com/docs/v1/Objects.htm#Custom_NewDelete

    public readonly Base: string;
    public readonly insertText: string;
    public readonly uri: vscode.Uri;
    public readonly upName: string;
    declare public readonly kind: vscode.SymbolKind.Class;
    declare public readonly children: TClassChildren[];
    declare public readonly detail: '';

    public constructor(
        {
            //  md: vscode.MarkdownString
            name,
            range,
            selectionRange,
            insertText,
            uri,
            ch,
            Base,
        }: {
            name: string,
            range: vscode.Range,
            selectionRange: vscode.Range,
            insertText: string,
            uri: vscode.Uri,
            ch: TClassChildren[],
            Base: string,
        },
    ) {
        super(name, '', vscode.SymbolKind.Class, range, selectionRange);
        this.insertText = insertText;
        this.upName = name.toUpperCase();
        this.uri = uri;
        this.children = ch;
        this.Base = Base;
    }

    // m1 := new GMem(0, 20) ; OK!
    // m2 := {base: GMem}.__New(0, 30) ; no support

    // class GMem
    // {
    //     __New(aFlags, aSize)
    //     {
    //         this.ptr := DllCall("GlobalAlloc", "UInt", aFlags, "Ptr", aSize, "Ptr")
    //         if !this.ptr
    //             return ""
    //         MsgBox % "New GMem of " aSize " bytes at address " this.ptr "."
    //         return this  ; This line can be omitted when using the 'new' operator.
    //     }

    //     __Delete()
    //     {
    //         MsgBox % "Delete GMem at address " this.ptr "."
    //         DllCall("GlobalFree", "Ptr", this.ptr)
    //     }
    // }

    // ...Method syntax:

    // class ClassName {
    //     __Get([Key, Key2, ...])
    //     __Set([Key, Key2, ...], Value)
    //     __Call(Name [, Params...])
    // }
}
