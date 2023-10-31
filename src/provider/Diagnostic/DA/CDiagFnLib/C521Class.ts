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
                ? 'avoid function-name look like `Reserved words`'
                : 'avoid var-name look like `Reserved words`',
        });
    }
}
