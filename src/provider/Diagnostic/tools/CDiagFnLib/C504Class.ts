import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../CDiagFn';

export class C504Class extends CDiagFn {
    //
    declare public readonly value: EDiagCodeDA.code504;

    public constructor(defRangeList: readonly vscode.Range[]) {
        super({
            value: EDiagCodeDA.code504,
            range: defRangeList[0],
            severity: vscode.DiagnosticSeverity.Error,
            tags: [],
            message: DiagsDA[EDiagCodeDA.code504].msg,
        });
    }
}
