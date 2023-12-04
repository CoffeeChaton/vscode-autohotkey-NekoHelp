import * as vscode from 'vscode';
import type { TVarData } from '../../../../AhkSymbol/CAhkFunc';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../../tools/CDiagFn';

export class C504Class extends CDiagFn {
    //
    declare public readonly value: EDiagCodeDA.code504;

    public constructor(defRangeList: readonly TVarData[]) {
        super({
            value: EDiagCodeDA.code504,
            range: defRangeList[0].range,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [],
            message: DiagsDA[EDiagCodeDA.code504].msg,
        });
    }
}
