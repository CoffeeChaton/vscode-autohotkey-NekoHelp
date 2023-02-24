import * as vscode from 'vscode';
import type { CAhkFunc, TParamMetaOut, TValMetaOut } from '../../../../AhkSymbol/CAhkFunc';
import { EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../CDiagFn';

export class C511Class extends CDiagFn {
    public constructor(v: TParamMetaOut | TValMetaOut, ahkFn: CAhkFunc) {
        super({
            value: EDiagCodeDA.code511,
            range: v.defRangeList[0],
            severity: vscode.DiagnosticSeverity.Information,
            tags: [],
            message: `var/param "${v.keyRawName}" is the same func-name "${ahkFn.name}()"`,
        });
    }
}
