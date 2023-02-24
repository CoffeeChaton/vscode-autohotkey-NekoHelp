/* eslint-disable max-classes-per-file */
import * as vscode from 'vscode';
import type { TLineClass } from './CAhkLine';

// switch
export class CAhkSwitch extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Enum;
    declare public readonly detail: 'Switch';
    declare public readonly children: (CAhkCase | CAhkDefault)[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
            ch,
        }: {
            name: string,
            range: vscode.Range,
            selectionRange: vscode.Range,
            uri: vscode.Uri,
            ch: (CAhkCase | CAhkDefault)[],
        },
    ) {
        super(name, 'Switch', vscode.SymbolKind.Enum, range, selectionRange);
        this.uri = uri;
        this.children = ch;
    }
}

export class CAhkCase extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.EnumMember;
    declare public readonly detail: 'Case';
    declare public readonly children: (CAhkSwitch | TLineClass)[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
            ch,
        }: {
            name: string,
            range: vscode.Range,
            selectionRange: vscode.Range,
            uri: vscode.Uri,
            ch: (CAhkSwitch | TLineClass)[],
        },
    ) {
        super(name, 'Case', vscode.SymbolKind.EnumMember, range, selectionRange);
        this.uri = uri;
        this.children = ch;
    }
}

export class CAhkDefault extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.EnumMember;
    declare public readonly detail: 'Default';
    declare public readonly children: (CAhkSwitch | TLineClass)[];

    public constructor(
        {
            range,
            selectionRange,
            uri,
            ch,
        }: {
            range: vscode.Range,
            selectionRange: vscode.Range,
            uri: vscode.Uri,
            ch: (CAhkSwitch | TLineClass)[],
        },
    ) {
        super('Default :', 'Default', vscode.SymbolKind.EnumMember, range, selectionRange);
        this.uri = uri;
        this.children = ch;
    }
}
