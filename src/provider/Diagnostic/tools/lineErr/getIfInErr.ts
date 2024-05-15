import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine } from '../../../../globalEnum';
import type { TFocExParser } from '../../../../tools/Built-in/3_foc/focEx.tools';
import { getFocExIfData } from '../../../../tools/Built-in/3_foc/focEx.tools';
import { CDiagBase } from '../CDiagBase';

type TErr = {
    ID:
        | 'IN'
        | 'CONTAINS'
        | 'BETWEEN'
        | 'IS',
    code:
        | EDiagCode.code202
        | EDiagCode.code203
        | EDiagCode.code204,
};

const IfInErrList: readonly TErr[] = [
    {
        // if Var in MatchList
        // if Var not in MatchList
        ID: 'IN',
        code: EDiagCode.code202,
    },
    {
        // if Var contains MatchList
        // if Var not contains MatchList
        ID: 'CONTAINS',
        code: EDiagCode.code202,
    },
    {
        // if Var between LowerBound and UpperBound
        // if Var not between LowerBound and UpperBound
        ID: 'BETWEEN',
        code: EDiagCode.code203,
    },
    {
        // if Var is Type
        // if Var is not Type
        ID: 'IS',
        code: EDiagCode.code204,
    },
];

export function getIfInErr(AhkTokenLine: TAhkTokenLine, WordUpCol: number): CDiagBase | null {
    const {
        lStr,
        line,
    } = AhkTokenLine;
    const focExParser: TFocExParser | null = getFocExIfData(lStr, WordUpCol);
    if (focExParser === null) return null;

    const { exUpName, lPos, strF } = focExParser;
    for (const { ID, code } of IfInErrList) {
        if (ID === exUpName) {
            // check left
            // debris on the leftHasDebris
            const checkLeft: boolean = strF
                .slice(0, lPos)
                // eslint-disable-next-line regexp/no-unused-capturing-group
                .replace(/^\s*IF,\s*([#$@\w\u{A1}-\u{FFFF}]+)\s*/iu, '')
                .replace(/^not\s*/iu, '')
                === ''; //
            const RightStr: string = ID === 'BETWEEN'
                ? strF.slice(lPos + ID.length).replace(/\s+And\s+/iu, '')
                : strF.slice(lPos + ID.length);
            const checkR1: boolean = RightStr.includes('='); // a = b or a==b
            const checkR2: boolean = (/\s+(?:and|or|new)\s+/iu).test(RightStr);
            const checkR3: boolean = RightStr.includes('||') || RightStr.includes('&&');

            if (checkLeft && !checkR1 && !checkR2 && !checkR3) {
                // not mixed with expression
                return null;
            }

            const range: vscode.Range = new vscode.Range(
                new vscode.Position(line, lPos),
                new vscode.Position(line, lPos + exUpName.length),
            );
            return new CDiagBase({
                value: code,
                range,
                severity: vscode.DiagnosticSeverity.Error,
                tags: [],
            });
        }
    }

    return null;
}
//
