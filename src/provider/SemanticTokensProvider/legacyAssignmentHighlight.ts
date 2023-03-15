import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import type { TokenTypes, TSemanticTokensLeaf } from './tools';

function setHighlight(
    line: number,
    l: number,
    r: number,
    tokenType: typeof TokenTypes[number],
    Tokens: TSemanticTokensLeaf[],
): void {
    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, l),
        new vscode.Position(line, r),
    );

    Tokens.push({
        range,
        tokenType,
        tokenModifiers: [],
    });
}

export function legacyAssignmentHighlight(DocStrMap: TTokenStream): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];

    for (
        const {
            detail,
            lStr,
            line,
        } of DocStrMap
    ) {
        if (!detail.includes(EDetail.inSkipSign2)) continue;

        const len = lStr.length;
        for (let i = 0; i < len; i++) {
            const s = lStr[i];
            if (s !== ' ' && s === '^') {
                setHighlight(line, i, i + 1, 'string', Tokens);
            }
        }
    }

    return Tokens;
}
