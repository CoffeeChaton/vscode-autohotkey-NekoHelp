import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
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

export function MultilineHighlight(DocStrMap: TTokenStream): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];

    for (
        const {
            multiline,
            lStr,
            textRaw,
            line,
        } of DocStrMap
    ) {
        if (multiline !== EMultiline.mid) continue;

        if (textRaw.length > lStr.length) {
            setHighlight(line, lStr.length, textRaw.length, 'comment', Tokens);
        }

        const len = lStr.length;
        for (let i = 0; i < len; i++) {
            const s = lStr[i];
            if (s !== ' ' && s !== '^') {
                setHighlight(line, i, i + 1, 'keyword', Tokens);
            }
        }
        // for (const ma of lStr.matchAll(/(\S+)/ug)) {
        //     const rawName: string = ma[1].trim();
        //     if ((/^_+$/u).test(rawName)) continue;

        //     const ch: number | undefined = ma.index;
        //     if (ch === undefined) continue;

        //     if ((/^\w+\(/u).test(rawName)) {
        //         setHighlight(line, ch, ch + rawName.indexOf('('), 'function', Tokens);
        //     } else if ((/^\d+$/u).test(rawName) || (/^\d?\.\d+$/u).test(rawName)) {
        //         setHighlight(line, ch, ch + rawName.length, 'number', Tokens);
        //     } else if ((/^\w+$/u).test(rawName)) {
        //         setHighlight(line, ch, ch + rawName.length, 'variable', Tokens);
        //     } else {
        //         setHighlight(line, ch, ch + rawName.length, 'keyword', Tokens);
        //     }
        // }
    }

    return Tokens;
}

// ^\s*\(

// https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section
