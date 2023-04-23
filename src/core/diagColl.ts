import * as vscode from 'vscode';
import { CDiagBase } from '../provider/Diagnostic/tools/CDiagBase';
import { CDiagFn } from '../provider/Diagnostic/tools/CDiagFn';

export const diagColl: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('ahk-neko-help');

export function getWithOutNekoDiag(diagnostics: readonly vscode.Diagnostic[]): vscode.Diagnostic[] {
    const newDiagList: vscode.Diagnostic[] = [];
    for (const diag of diagnostics) {
        if (diag instanceof CDiagFn || diag instanceof CDiagBase) {
            continue;
        }
        newDiagList.push(diag);
    }

    return newDiagList;
}

export function rmFileDiag(uri: vscode.Uri): void {
    diagColl.set(uri, getWithOutNekoDiag(diagColl.get(uri) ?? []));
}

export function rmAllDiag(): void {
    for (const [uri, diagnostics] of diagColl) {
        diagColl.set(uri, getWithOutNekoDiag(diagnostics));
    }
}
