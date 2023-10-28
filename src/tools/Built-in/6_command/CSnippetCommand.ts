import * as vscode from 'vscode';
import type { TDeclarationData } from '../5_declaration/declaration.data';
import type { TCommandElement } from './Command.data';

export class CSnippetCommand extends vscode.CompletionItem {
    public readonly upName: string;

    public readonly recommended: boolean;

    public constructor(v: TCommandElement | TDeclarationData, md: vscode.MarkdownString) {
        const {
            keyRawName,
            body,
            recommended,
            upName,
        } = v;
        super({
            label: keyRawName,
            description: 'Command',
        }, vscode.CompletionItemKind.Keyword); // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        const body2: string = body.includes('[')
            ? body
                .replaceAll(/\s*,\s*\[/gu, '[')
                .replaceAll(/\[\s*,\s*/gu, '[')
                .replaceAll(/\s*\[\s*/gu, ',$0 ')
                .replaceAll(/\s*\]\s*/gu, '')
            : body;

        this.insertText = new vscode.SnippetString(body2);
        this.detail = 'Command of AHK (neko-help)';
        this.documentation = md;
        this.upName = upName;
        this.recommended = recommended;
    }
}
