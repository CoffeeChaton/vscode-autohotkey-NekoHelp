/* eslint-disable max-classes-per-file */
import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../globalEnum';
import type { CAhkInclude } from './CAhkInclude';

export type TBaseLineParam = {
    name: string,
    range: vscode.Range,
    selectionRange: vscode.Range,
    uri: vscode.Uri,
    AhkTokenLine: TAhkTokenLine,
};

export class CAhkDirectives extends vscode.DocumentSymbol {
    // #Directives
    // exp #AllowSameLineComments
    // https://www.autohotkey.com/docs/v1/lib/_AllowSameLineComments.htm
    public readonly uri: vscode.Uri;
    /**
     * hashtag is without # && toUpperCase()
     * exp : #noEnv -> NOENV
     */
    public readonly hashtag: string; //

    declare public readonly kind: vscode.SymbolKind.Event;
    declare public readonly detail: '#Directives';
    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
    ) {
        const { start } = selectionRange;
        const selectionRangeFix = new vscode.Range(
            start,
            new vscode.Position(start.line, start.character + name.length),
        );
        super(name, '#Directives', vscode.SymbolKind.Event, range, selectionRangeFix);
        this.uri = uri;
        this.hashtag = name.replace('#', '').toUpperCase();
    }
}

/**
 * @example ~F10::
 */
export class CAhkHotKeys extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/v1/misc/Labels.htm
    public readonly uri: vscode.Uri;
    public readonly AfterString: string;

    declare public readonly kind: vscode.SymbolKind.Event;
    declare public readonly detail: 'HotKeys';
    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
        AfterString: string,
    ) {
        super(name, 'HotKeys', vscode.SymbolKind.Event, range, selectionRange);
        this.uri = uri;
        this.AfterString = AfterString;
    }
}

/**
 * @example ::ts,:: typescript
 */
export class CAhkHotString extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;
    public readonly AfterString: string;

    declare public readonly kind: vscode.SymbolKind.Event;
    declare public readonly detail: 'HotString';
    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
        AfterString: string,
    ) {
        super(name, 'HotString', vscode.SymbolKind.Event, range, selectionRange);
        this.uri = uri;
        this.AfterString = AfterString;
    }
}

/**
 * AHK_L will auto diag of Duplicate label.
 *
 * auto diag1
 * ```c++
 *     return ScriptError(_T("Duplicate label."), aLabelName);
 * ```
 * auto diag2
 * ```c++
 *     LineError(_T("A Goto/Gosub must not jump into a block that doesn't enclose it."));
 * ```
 */
export class CAhkLabel extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/v1/misc/Labels.htm
    // Label names must be unique throughout the whole script.
    public readonly uri: vscode.Uri;
    public readonly AfterString: '';
    /**
     * label: -> LABEL
     */
    public readonly upName: string;
    public readonly md: vscode.MarkdownString;

    declare public readonly kind: vscode.SymbolKind.Namespace;
    declare public readonly detail: 'label';
    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
        md: vscode.MarkdownString,
    ) {
        super(name, 'label', vscode.SymbolKind.Namespace, range, selectionRange);
        this.uri = uri;
        this.upName = name.slice(0, -1).toUpperCase();
        this.AfterString = '';
        this.md = md;
    }
}

export class CAhkComment extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Package;
    declare public readonly detail: '';
    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
    ) {
        super(name, '', vscode.SymbolKind.Package, range, selectionRange);
        this.uri = uri;
    }
}

export type TLineClass =
    | CAhkComment
    | CAhkDirectives
    | CAhkInclude
    | CAhkLabel;
