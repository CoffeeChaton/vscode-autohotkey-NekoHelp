import * as vscode from 'vscode';
import type { CAhkFunc, TValMetaOut } from '../../../../AhkSymbol/CAhkFunc';
import { EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../../tools/CDiagFn';

export class C512Class extends CDiagFn {
    public constructor(v: TValMetaOut, ahkFn: CAhkFunc) {
        super({
            value: EDiagCodeDA.code512,
            range: v.defRangeList[0].range,
            severity: vscode.DiagnosticSeverity.Information,
            tags: [],
            message: `global-val "${v.keyRawName}" is the same func-name "${ahkFn.name}()"`,
        });
    }
}
