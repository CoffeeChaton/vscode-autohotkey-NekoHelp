import * as vscode from 'vscode';
import type { C502Class } from '../../Diagnostic/tools/CDiagFnLib/C502Class';

// replace ref like Def
function getCA0(uri: vscode.Uri, defStr: string, refRange: vscode.Range): vscode.CodeAction {
    const title0 = `replace this as "${defStr}"`;
    const CA0 = new vscode.CodeAction(title0);
    CA0.kind = vscode.CodeActionKind.QuickFix;
    CA0.edit = new vscode.WorkspaceEdit();
    CA0.edit.replace(uri, refRange, defStr);

    return CA0;
}

// replace def like Ref
function getCA1(uri: vscode.Uri, refStr: string, defRange: vscode.Range): vscode.CodeAction {
    const title1 = `replace def as "${refStr}"`;
    const CA1 = new vscode.CodeAction(title1);
    CA1.kind = vscode.CodeActionKind.QuickFix;
    CA1.edit = new vscode.WorkspaceEdit();
    CA1.edit.replace(uri, defRange, refStr);

    return CA1;
}

export function c502c503CodeAction(uri: vscode.Uri, diag: C502Class): vscode.CodeAction[] {
    const {
        defStr,
        defRange,
        refStr,
        refRange,
    } = diag.c502Data;

    return [
        getCA0(uri, defStr, refRange),
        getCA1(uri, refStr, defRange),
    ];
}
