import * as vscode from 'vscode';
import type { EDiagCode } from '../../../diag';
import { Diags } from '../../../diag';
import { EDiagBase } from '../../../Enum/EDiagBase';

type TDiagBaseParam = {
    value: EDiagCode,
    range: vscode.Range,
    severity: vscode.DiagnosticSeverity,
    tags: vscode.DiagnosticTag[],
};

export class CDiagBase extends vscode.Diagnostic {
    public override readonly source: EDiagBase.source = EDiagBase.source;
    public override code: {
        value: EDiagCode,
        target: vscode.Uri,
    };

    public constructor({
        value,
        range,
        severity,
        tags,
    }: TDiagBaseParam) {
        const message: string = Diags[value].msg;

        super(range, message, severity);
        const target: vscode.Uri = vscode.Uri.parse(Diags[value].path);
        this.code = { value, target };
        this.tags = tags;
    }
}
