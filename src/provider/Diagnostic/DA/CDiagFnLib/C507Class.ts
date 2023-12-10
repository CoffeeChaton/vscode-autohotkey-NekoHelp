import * as vscode from 'vscode';
import type { TParamMapOut, TValMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../../tools/CDiagFn';
import { C507_varName_like_number } from './C507_varName_like_number';

export class C507Class extends CDiagFn {
    //
    declare public readonly value: EDiagCodeDA.code507;

    public constructor(range: vscode.Range) {
        super({
            value: EDiagCodeDA.code507,
            range,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
            message: DiagsDA[EDiagCodeDA.code507].msg,
        });
    }
}

export function C507SetVarErr0xNumber(
    paramOrValMap: TParamMapOut | TValMapOut,
    code507List: C507Class[],
    displayErrList: readonly boolean[],
): void {
    for (const [keyUpName, v] of paramOrValMap) {
        if (C507_varName_like_number(keyUpName)) {
            const { defRangeList, refRangeList } = v;
            for (const { range } of [...defRangeList, ...refRangeList]) {
                if (displayErrList[range.start.line]) {
                    code507List.push(new C507Class(range));
                }
            }
        }
    }
}
