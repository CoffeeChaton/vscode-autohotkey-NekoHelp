import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../../tools/CDiagFn';

export class C507Class extends CDiagFn {
    //
    declare public readonly value: EDiagCodeDA.code507;

    public constructor(defRangeList: readonly vscode.Range[]) {
        super({
            value: EDiagCodeDA.code507,
            range: defRangeList[0],
            severity: vscode.DiagnosticSeverity.Error,
            tags: [],
            message: DiagsDA[EDiagCodeDA.code507].msg,
        });
    }
}
