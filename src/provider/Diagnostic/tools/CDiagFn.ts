import * as vscode from 'vscode';
import type { EDiagCodeDA } from '../../../diag';
import { DiagsDA } from '../../../diag';
import { EDiagBase } from '../../../Enum/EDiagBase';

type TCDiagFnParam = {
    value: EDiagCodeDA,
    range: vscode.Range,
    severity: vscode.DiagnosticSeverity,
    tags: vscode.DiagnosticTag[],
    message: string,
};

export class CDiagFn extends vscode.Diagnostic {
    public override readonly source: EDiagBase.sourceDA = EDiagBase.sourceDA;
    public override code: {
        value: EDiagCodeDA,
        target: vscode.Uri,
    };

    public constructor({
        value,
        range,
        severity,
        tags,
        message,
    }: TCDiagFnParam) {
        super(range, message, severity);

        const target: vscode.Uri = vscode.Uri.parse(DiagsDA[value].path);
        this.code = { value, target };
        this.tags = tags;
    }
}
