import * as vscode from 'vscode';
import { EDiagCode } from '../../../diag';
import { CDiagBase } from './CDiagBase';

export function diagEMultilineMidStyle1(line: number, lStr: string): [] | [CDiagBase] {
    // code125 = 125, // `%` miss to closed
    // code126 = 126,; // `%` variable name contains an illegal character

    /**
     * flag of '%'
     */
    let satePercent = false;
    const len = lStr.length;

    for (let i = 0; i < len; i++) {
        const s = lStr[i];

        if (s === '%') {
            satePercent = !satePercent;
            continue;
        }

        // %A_LineFile%
        //    ^ this  <---- true
        if (satePercent && (/^\W$/u).test(s)) {
            const l1 = lStr.lastIndexOf('%', i);
            const l2 = l1 > -1
                ? l1
                : i;
            return [
                new CDiagBase({
                    value: EDiagCode.code126,
                    range: new vscode.Range(line, l2, line, i + 1),
                    severity: vscode.DiagnosticSeverity.Error,
                    tags: [],
                }),
            ];
        }
    }

    return satePercent
        ? [
            new CDiagBase({
                value: EDiagCode.code125,
                range: new vscode.Range(line, lStr.lastIndexOf('%'), line, len),
                severity: vscode.DiagnosticSeverity.Error,
                tags: [],
            }),
        ]
        : [];
}

export function diagEMultilineMidStyle2(line: number, lStr: string): [] | [CDiagBase] {
    // code124 = 124, // `"` is not closed

    /**
     * flag of '"'
     */
    let sateStr = false;
    const len = lStr.length;

    for (let i = 0; i < len; i++) {
        const s = lStr[i];
        if (s === '^' || s === ' ' || s === '\t') {
            continue;
        }

        if (s === '"') {
            sateStr = !sateStr;

            if (sateStr) {
                // " A_LineFile "
                // ^--space after first `"` to open the var.
                const sNext = lStr[i + 1] as string | undefined;
                if (sNext !== undefined && sNext !== ' ') {
                    return [
                        new CDiagBase({
                            value: EDiagCode.code127,
                            range: new vscode.Range(line, i, line, i + 1),
                            severity: vscode.DiagnosticSeverity.Error,
                            tags: [],
                        }),
                    ];
                }
            } else {
                // " A_LineFile "
                //              ^--space before second `"` to closed the var
                const sBefore = lStr[i - 1] as string | undefined;
                if (sBefore !== undefined && sBefore !== ' ') {
                    return [
                        new CDiagBase({
                            value: EDiagCode.code127,
                            range: new vscode.Range(line, i - 1, line, i),
                            severity: vscode.DiagnosticSeverity.Error,
                            tags: [],
                        }),
                    ];
                }
            }
        }
    }

    return sateStr
        ? [
            new CDiagBase({
                value: EDiagCode.code124,
                range: new vscode.Range(line, lStr.lastIndexOf('"'), line, len),
                severity: vscode.DiagnosticSeverity.Error,
                tags: [],
            }),
        ]
        : [];
}
