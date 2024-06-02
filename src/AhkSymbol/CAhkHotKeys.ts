import * as vscode from 'vscode';
import { $t } from '../i18n';
import type { TBaseLineParam } from './CAhkLine';

type THotKeyData = {
    /**
     * and `unknown option`
     */
    md: vscode.MarkdownString,
    range: vscode.Range,
};

const HotkeysMD: vscode.MarkdownString = new vscode.MarkdownString($t('AhkHotKeys.hover.md'));

/**
 * @example ~F10::
 */
export class CAhkHotKeys extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/v1/misc/Labels.htm
    public readonly uri: vscode.Uri;

    public readonly AfterString: string;

    declare public readonly kind: vscode.SymbolKind.Event;

    declare public readonly detail: 'HotKeys' | 'Remap';

    declare public readonly children: never[];

    public readonly mdMeta: THotKeyData;

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
        AfterString: string,
        isRemap: boolean,
    ) {
        const detail: 'HotKeys' | 'Remap' = isRemap
            ? 'Remap'
            : 'HotKeys';
        super(name, detail, vscode.SymbolKind.Event, range, selectionRange);
        this.uri = uri;
        this.AfterString = AfterString;
        this.detail = detail;

        const { line, character } = selectionRange.start;
        this.mdMeta = {
            md: HotkeysMD,
            range: new vscode.Range(
                new vscode.Position(line, character),
                new vscode.Position(line, character + name.length - 2),
            ),
        };
    }
}

//
