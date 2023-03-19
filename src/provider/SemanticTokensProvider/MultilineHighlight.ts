import * as vscode from 'vscode';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import { EMultiline } from '../../globalEnum';
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

function fixAccentFlag(AhkTokenLine: TAhkTokenLine, Tokens: TSemanticTokensLeaf[]): null {
    const {
        multilineFlag,
        lStr,
        textRaw,
        line,
    } = AhkTokenLine;
    if (multilineFlag === null) return null;
    const { accentFlag } = multilineFlag;

    if (accentFlag.length === 1) {
        const len: number = lStr.length;
        for (let i = 0; i < len; i++) {
            const s: string = textRaw[i];
            if (s === '`') {
                setHighlight(line, i, i + 1, 'string', Tokens);
                if (i + 1 < len) {
                    setHighlight(line, i + 1, i + 2, 'string', Tokens);
                }
            }
        }
    }

    return null;
}

export function MultilineHighlight(DocStrMap: TTokenStream): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];

    for (const AhkTokenLine of DocStrMap) {
        const {
            multiline,
            lStr,
            textRaw,
            line,
        } = AhkTokenLine;
        if (multiline !== EMultiline.mid) continue;

        const { length } = textRaw;
        if (length > lStr.length) {
            for (let i = lStr.length; i < length; i++) {
                setHighlight(line, i, i + 1, 'comment', Tokens);
            }
            // setHighlight(line, lStr.length, textRaw.length, 'comment', Tokens);
        }

        const len = lStr.length;
        for (let i = 0; i < len; i++) {
            const s = lStr[i];
            if (s !== ' ' && s !== '^') {
                setHighlight(line, i, i + 1, 'keyword', Tokens);
            }
        }

        fixAccentFlag(AhkTokenLine, Tokens);
    }

    return Tokens;
}

// ^\s*\(

// https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section
