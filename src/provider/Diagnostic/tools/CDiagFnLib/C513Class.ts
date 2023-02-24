import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../../AhkSymbol/CAhkFunc';
import type { CAhkLabel } from '../../../../AhkSymbol/CAhkLine';
import { EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../CDiagFn';

export class C513Class extends CDiagFn {
    public constructor(v: CAhkLabel, ahkFn: CAhkFunc) {
        super({
            value: EDiagCodeDA.code513,
            range: v.selectionRange,
            severity: vscode.DiagnosticSeverity.Information,
            tags: [],
            message: `label "${v.name}" is the same func-name "${ahkFn.name}()"`,
        });
    }
}
