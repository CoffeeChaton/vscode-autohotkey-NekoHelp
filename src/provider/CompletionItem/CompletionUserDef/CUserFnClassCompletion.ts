import * as vscode from 'vscode';

export class CUserFnClassCompletion extends vscode.CompletionItem {
    //
    public readonly isSatisfyOpt2: boolean;

    declare public readonly label: vscode.CompletionItemLabel;
    declare public readonly kind: vscode.CompletionItemKind.Class | vscode.CompletionItemKind.Function;

    public constructor(
        label: vscode.CompletionItemLabel,
        isSatisfyOpt2: boolean,
        kind: vscode.CompletionItemKind.Class | vscode.CompletionItemKind.Function,
    ) {
        super(label);
        this.isSatisfyOpt2 = isSatisfyOpt2;
        this.kind = kind;
        this.detail = 'neko help';
    }
}
