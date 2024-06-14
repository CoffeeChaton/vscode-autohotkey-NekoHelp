import * as vscode from 'vscode';

export class CVbaCompletionItem extends vscode.CompletionItem {
    declare public readonly detail: 'by-neko-help (VBA-ex)';

    declare public readonly label: vscode.CompletionItemLabel;

    declare public readonly description: 'VBA';

    declare public readonly kind: vscode.CompletionItemKind;

    declare public readonly documentation: vscode.MarkdownString;

    public constructor(
        label: string,
        kind: vscode.CompletionItemKind,
        md: vscode.MarkdownString,
    ) {
        super({ label, description: 'VBA' }, kind);
        // this.label = label;
        // this.description = 'VBA';

        this.kind = kind;
        this.documentation = md;
        this.detail = 'by-neko-help (VBA-ex)';
    }
}
