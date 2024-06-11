/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine, TTokenStream } from '../../../../globalEnum';
import { CMemo } from '../../../../tools/CMemo';
import { CDiagBase } from '../CDiagBase';

// -------------------------------------------------------------- only allow it
// if (...)
// if (x > 0) and (y > 0)
// --------------------------------------------------------------

function getIf_style_209(AhkTokenLine: TAhkTokenLine): CDiagBase | null {
    const {
        lStr,
        line,
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    // eslint-disable-next-line no-nested-ternary
    const WordUpCol: number = fistWordUp === 'IF'
        ? fistWordUpCol
        : (SecondWordUp === 'IF'
            ? SecondWordUpCol
            : -1);
    if (WordUpCol === -1) return null;

    const strF0: string = lStr
        .slice(WordUpCol)
        .replace(/^\s*IF\b\s*(?:,\s*)?/iu, '')
        .trimStart();

    if (
        strF0.startsWith('(')
        || strF0.startsWith('!(')
    ) {
        return null;
    }

    const strF1: string = strF0.replace(/^[#$@\w\u{A1}-\u{FFFF}]+[ \t]*/iu, '');
    if (
        (/^(?:not[ \t]+)?(?:in|contains|between)[ \t]/iu).test(strF1)
        || (/^is[ \t]/iu).test(strF1) // is
        || (/^(?:and|or)[ \t]/iu).test(strF1) //
    ) {
        return null;
    }

    const lPos: number = lStr.indexOf(strF0);
    if (lPos === -1) return null;

    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, lPos),
        new vscode.Position(line, lStr.trimEnd().length),
    );

    return new CDiagBase({
        value: EDiagCode.code209,
        range,
        severity: vscode.DiagnosticSeverity.Information,
        tags: [],
    });
}

export const memoIf_style = new CMemo(
    (DocStrMap: TTokenStream): readonly CDiagBase[] => {
        const need: CDiagBase[] = [];

        for (const AhkTokenLine of DocStrMap) {
            if (!AhkTokenLine.displayErr) continue;
            const diag209: CDiagBase | null = getIf_style_209(AhkTokenLine);
            if (diag209 !== null) {
                need.push(diag209);
            }
        }

        return need;
    },
);
