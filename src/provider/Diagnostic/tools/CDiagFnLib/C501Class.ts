import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../CDiagFn';

export class C501Class extends CDiagFn {
    //
    declare public readonly value: EDiagCodeDA.code501;

    public constructor(defRangeList: readonly vscode.Range[]) {
        super({
            value: EDiagCodeDA.code501,
            range: defRangeList[0],
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Unnecessary],
            message: DiagsDA[EDiagCodeDA.code501].msg,
        });
    }
}
