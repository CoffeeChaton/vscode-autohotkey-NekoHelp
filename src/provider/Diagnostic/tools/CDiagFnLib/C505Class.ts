import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../CDiagFn';

export class C505Class extends CDiagFn {
    //
    declare public readonly value: EDiagCodeDA.code505;

    public constructor(parsedErrRange: vscode.Range) {
        super({
            value: EDiagCodeDA.code505,
            range: parsedErrRange,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [],
            message: DiagsDA[EDiagCodeDA.code505].msg,
        });
    }
}
