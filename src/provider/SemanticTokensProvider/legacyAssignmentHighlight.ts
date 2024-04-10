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
            textRaw,
        } of DocStrMap
    ) {
        if (!detail.includes(EDetail.inSkipSign2)) continue;

        if (
            (/^[ \t]*[#$@\w\u{A1}-\u{FFFF}]+[ \t]*=(?!=)/u).test(textRaw) // \w+
            || (/^[ \t]*[#$@\w\u{A1}-\u{FFFF}]+%[#$@\w\u{A1}-\u{FFFF}]+%[ \t]*=(?!=)/u).test(textRaw) // Arr_%i%
            || (/^[ \t]*%[#$@\w\u{A1}-\u{FFFF}]+%[#$@\w\u{A1}-\u{FFFF}]+[ \t]*=(?!=)/u).test(textRaw) // %I%_Arr
            || (/^[ \t]*%[#$@\w\u{A1}-\u{FFFF}]+%[#$@\w\u{A1}-\u{FFFF}]+%[#$@\w\u{A1}-\u{FFFF}]+%[ \t]*=(?!=)/u).test(
                textRaw, // %I%_Arr_%j%
            )
        ) {
            continue; // Simple case, taken over by syntax-highlight
        }
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
