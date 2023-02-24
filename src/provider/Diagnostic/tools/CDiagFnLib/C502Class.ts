import * as vscode from 'vscode';
import { EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../CDiagFn';

export const enum EPrefixC502 {
    var = 'var',
    param = 'param',
}

type TC502Data = Readonly<{
    defRange: vscode.Range,
    defStr: string,
    prefix: EPrefixC502,
    refRange: vscode.Range,
    refStr: string,
}>;

export class C502Class extends CDiagFn {
    public readonly c502Data: TC502Data;

    //
    public constructor(c502Data: TC502Data) {
        const {
            defRange,
            defStr,
            prefix,
            refRange,
            refStr,
        } = c502Data;

        const defPos = defRange.start;
        const defPosStr = `[${defPos.line + 1}, ${defPos.character + 1}]`;
        // var "A" is the same variable as "a" defined earlier (at [165, 20])
        /**
         * WARN !!!!
         * Keep this format string!!!
         * // var "A" is the same variable as "a" defined earlier (at [165, 20])
         * // param "dDC" is the some variable as "ddc" defined earlier (at [221, 8])
         * Keep this format string!!!
         * WARN !!!!
         */
        const message = `${prefix} "${refStr}" is the some variable as "${defStr}" defined earlier (at ${defPosStr})`;

        super({
            value: EDiagCodeDA.code502,
            range: refRange,
            severity: vscode.DiagnosticSeverity.Information,
            tags: [],
            message, // setDiagCaseMsg(keyRawName, defPos, C502, prefix),
        });

        this.c502Data = c502Data;
    }
}
