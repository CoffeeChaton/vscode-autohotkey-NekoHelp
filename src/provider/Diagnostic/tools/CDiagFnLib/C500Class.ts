import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../CDiagFn';

export class C500Class extends CDiagFn {
    //
    declare public readonly value: EDiagCodeDA.code500;

    public constructor(defRangeList: readonly vscode.Range[]) {
        super({
            value: EDiagCodeDA.code500,
            range: defRangeList[0],
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Unnecessary],
            message: DiagsDA[EDiagCodeDA.code500].msg,
        });
    }
}
