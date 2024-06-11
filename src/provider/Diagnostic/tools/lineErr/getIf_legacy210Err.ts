/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine, TTokenStream } from '../../../../globalEnum';
import { CMemo } from '../../../../tools/CMemo';
import { CDiagBase } from '../CDiagBase';

// -------------------------------------------------------------- OK
// if (...)
// if (x > 0) and (y > 0)
// if InStr(a, b)
// if !MyVar
// if not MyVar
// if a ; <- not more
// if true ; <- not more

// -------------------------------------------------------------- diag
// if a != b ; <------------ diag this...
// if (a != "b") ; is .EQ. this , thanks ...

function getIf_legacy210Err(AhkTokenLine: TAhkTokenLine): CDiagBase | null {
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
        || strF0.startsWith('!')
        || (/^not\s/iu).test(strF0)
        || (/^[#$@\w\u{A1}-\u{FFFF}]+\(/iu).test(strF0) // InStr( ...etc
    ) {
        return null;
    }

    const strF1: string = strF0
        .replace(/^[#$@\w\u{A1}-\u{FFFF}]+(?:\.[#$@\w\u{A1}-\u{FFFF}]+(?:\([^)]*\))?)?[ \t]*/iu, '');
    //                                                 ^ v1                        ^2

    if (
        strF1 === '' // if true
        || strF1 === '{' // if true {
        // -------------------------------------------------------------- diag with getIfInErr(), not here
        // if Var in MatchList
        // if Var not in MatchList
        // if Var contains MatchList
        // if Var not contains MatchList
        // if Var between LowerBound and UpperBound
        // if Var not between LowerBound and UpperBound
        // if Var is Type
        // if Var is not Type
        || (/^(?:not[ \t]+)?(?:in|contains|between)[ \t]/iu).test(strF1)
        || (/^is[ \t]/iu).test(strF1) // is
        || (/^(?:and|or)[ \t]/iu).test(strF1) //
        || strF1.startsWith('&&')
        || strF1.startsWith('||')
        /**
         * nodes := 0
         * path := {}
         * path.nodename := True
         * if nodes := path.nodename ; set val and nodes is True
         * {
         *     MsgBox, % "True"
         * } else {
         *     MsgBox, % "False"
         * }
         */
        || strF1.startsWith(':=')
        || (
            strF1.startsWith('[')
            && (/\]\s*$/u).test(strF1)
        )
    ) {
        return null;
    }

    const strF2: string = strF1
        .replace(/^(?:<=|>=|<>|==|[><=]|!=|!==|[~:+\-*/.|&^]=\/\/=|>>=|<<=|>>>=)[ \t]*/u, '')
        .trimStart();

    const lPos: number = lStr.indexOf(strF2);
    if (lPos === -1) return null;

    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, lPos),
        new vscode.Position(line, lStr.trimEnd().length),
    );

    return new CDiagBase({
        value: EDiagCode.code210,
        range,
        severity: vscode.DiagnosticSeverity.Error,
        tags: [],
    });
}

export const memoIf_legacyErrCode210 = new CMemo(
    (DocStrMap: TTokenStream): readonly (CDiagBase | null)[] => {
        const need: (CDiagBase | null)[] = [];

        for (const AhkTokenLine of DocStrMap) {
            need.push(getIf_legacy210Err(AhkTokenLine));
        }

        return need;
    },
);
