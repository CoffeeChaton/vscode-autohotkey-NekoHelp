import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../CDiagFn';

type TC506Param = {
    range: vscode.Range,
    keyUpName: string,
};

// if ((/^0b[0-1]+$/ui).test(str)) {
//     // base 2
//     // 0b11101: Binary
//     // this.number = Number.parseInt(str, 2);
// }
// if ((/^0o[0-7]+$/ui).test(str)) {
//     // base 8
//     // 0o35: Octal, denoted by an o
//     // this.number = Number.parseInt(str, 8);
// }

export class C506Class extends CDiagFn {
    public readonly keyUpName: string;

    //
    public constructor(c506Param: TC506Param) {
        const { range, keyUpName } = c506Param;

        super({
            value: EDiagCodeDA.code506,
            range,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [],
            message: DiagsDA[EDiagCodeDA.code506].msg,
        });

        this.keyUpName = keyUpName;
    }
}
