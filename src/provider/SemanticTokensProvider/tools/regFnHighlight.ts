/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import { EFnRefBy, type TAhkTokenLine, type TLineFnCall } from '../../../globalEnum';
import { fnRefTextRawReg } from '../../Def/getFnRef';
import type { TSemanticTokensLeaf } from '../tools';

export function regFnHighlight(AhkTokenLine: TAhkTokenLine, Tokens: TSemanticTokensLeaf[]): 0 | 1 {
    // I need to check San = =||
    const DataList: readonly TLineFnCall[] = fnRefTextRawReg(AhkTokenLine);
    if (DataList.length === 0) return 0;

    const { line, textRaw } = AhkTokenLine;

    for (const Data of DataList) {
        const { upName, col, by } = Data;

        // by -> (?CCallout)
        // or -> (? CNumber)
        if (by === EFnRefBy.Reg1) {
            Tokens.push(
                {
                    range: new vscode.Range(
                        new vscode.Position(line, col - '(?C'.length), //
                        new vscode.Position(line, col),
                    ),
                    tokenType: 'keyword',
                    tokenModifiers: [],
                },
            );
        }

        // by (?C:Callout)
        if (by === EFnRefBy.Reg2) {
            Tokens.push(
                {
                    range: new vscode.Range(
                        new vscode.Position(line, col - '(?C'.length - 1), //
                        new vscode.Position(line, col - 1),
                    ),
                    tokenType: 'keyword',
                    tokenModifiers: [],
                },
                {
                    range: new vscode.Range(
                        new vscode.Position(line, col - 1), // ':'.length
                        new vscode.Position(line, col),
                    ),
                    tokenType: 'keyword',
                    tokenModifiers: [],
                },
            );
        }

        // by (?C:Function)
        if (by === EFnRefBy.Reg3) {
            const maCol: number = textRaw.slice(0, col).search(/\d+:$/u);
            Tokens.push(
                {
                    range: new vscode.Range(
                        new vscode.Position(line, maCol - '(?C'.length), //
                        new vscode.Position(line, maCol),
                    ),
                    tokenType: 'keyword',
                    tokenModifiers: [],
                },
                {
                    range: new vscode.Range(
                        new vscode.Position(line, maCol), // number
                        new vscode.Position(line, col - 1),
                    ),
                    tokenType: 'number',
                    tokenModifiers: [],
                },
                {
                    range: new vscode.Range(
                        new vscode.Position(line, col - 1), // ':'.length
                        new vscode.Position(line, col),
                    ),
                    tokenType: 'keyword',
                    tokenModifiers: [],
                },
            );
        }

        // normalize
        Tokens.push(
            {
                range: new vscode.Range(
                    new vscode.Position(line, col),
                    new vscode.Position(line, col + upName.length),
                ),
                tokenType: (/^\d+$/u).test(upName)
                    ? 'number'
                    : 'function',
                tokenModifiers: [],
            },
            {
                range: new vscode.Range(
                    new vscode.Position(line, col + upName.length),
                    new vscode.Position(line, col + upName.length + ')'.length),
                ),
                tokenType: 'keyword',
                tokenModifiers: [],
            },
        );
    }
    return 1;
}
