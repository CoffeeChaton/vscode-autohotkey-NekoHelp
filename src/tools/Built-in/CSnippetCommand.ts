import * as vscode from 'vscode';
import type { TCommandElement } from './Command.data';
import type { TOtherKeyword1 } from './otherKeyword1.data';

export class CSnippetCommand extends vscode.CompletionItem {
    public readonly upName: string;
    public readonly recommended: boolean;
    public constructor(v: TCommandElement | TOtherKeyword1, md: vscode.MarkdownString) {
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
        this.insertText = new vscode.SnippetString(body);
        this.detail = 'Command of AHK (neko-help)';
        this.documentation = md;
        this.upName = upName;
        this.recommended = recommended;
    }
}
