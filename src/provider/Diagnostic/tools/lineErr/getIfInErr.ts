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
            const strF2: string = strF
                .slice(0, lPos)
                .replace(/^\s*if,\s*\w+\s*/iu, '')
                .replace(/^not\s*/iu, '');
            if (strF2 === '') {
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
