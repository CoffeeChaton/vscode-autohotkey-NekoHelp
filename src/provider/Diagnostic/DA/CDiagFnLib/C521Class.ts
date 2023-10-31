import * as vscode from 'vscode';
import { EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../../tools/CDiagFn';

export class C521Class extends CDiagFn {
    public constructor(range: vscode.Range, isFuncName: boolean) {
        super({
            value: EDiagCodeDA.code521,
            range,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
            message: isFuncName
                ? 'avoid function-name use confusing names'
                : 'avoid var-name use confusing names',
        });
    }
}
