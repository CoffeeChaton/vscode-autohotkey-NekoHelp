import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../../AhkSymbol/CAhkFunc';
import { EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../../tools/CDiagFn';

export class C514Class extends CDiagFn {
    public constructor(range: vscode.Range, ahkFn: CAhkFunc, PrefixName: string) {
        super({
            value: EDiagCodeDA.code514,
            range,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
            message: `func "${ahkFn.name}()" and \`ComObjConnect(...,"${PrefixName}")\` should be in the same file.`,
        });
    }
}
