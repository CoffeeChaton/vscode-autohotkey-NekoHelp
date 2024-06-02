import * as vscode from 'vscode';

export class CAhkBiObjCompletionItem extends vscode.CompletionItem {
    declare public readonly description: string;

    declare public readonly detail: string;

    declare public readonly documentation: vscode.MarkdownString;

    declare public readonly insertText: vscode.SnippetString;

    declare public readonly kind: vscode.CompletionItemKind;

    declare public readonly label: string;

    // eslint-disable-next-line max-params
    public constructor(
        label: string,
        kind: vscode.CompletionItemKind,
        detail: string,
        description: string,
        md: vscode.MarkdownString,
        insertText: vscode.SnippetString,
    ) {
        super({ label, description }, kind);
        // this.label = label;
        // this.description = 'VBA';

        this.kind = kind;
        this.documentation = md;
        this.detail = detail;
        this.insertText = insertText;
    }
}
