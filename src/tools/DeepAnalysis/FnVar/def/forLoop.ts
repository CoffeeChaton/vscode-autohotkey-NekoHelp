/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4,10] }] */
import * as vscode from 'vscode';
import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { wrapFnValDef } from './wrapFnValDef';

function wrap(arg: TGetFnDefNeed, character: number, RawName: string): void {
    const {
        line,
        valMap,
        paramMap,
        GValMap,
        lineComment,
        fnMode,
    } = arg;

    const UpName: string = RawName.toUpperCase();
    if (paramMap.has(UpName) || GValMap.has(UpName)) return;

    const defRange: vscode.Range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + RawName.length),
    );

    const value: TValMetaIn = wrapFnValDef({
        RawNameNew: RawName,
        valMap,
        defRange,
        lineComment,
        fnMode,
    });
    valMap.set(UpName, value);
}

// \s*for\b\s+[\w,\s]*\bin
// For var1,var2 in Range
export function forLoop(arg: TGetFnDefNeed, keyWord: string, col: number): void {
    if (keyWord !== 'FOR') return;
    const {
        lStrTrimLen,
        lStr,
    } = arg;
    if (lStrTrimLen < 10) return; // "for a in b" ----> len 10

    const col2: number = lStr.search(/[ \t]in[ \t]/iu); // (?:\s)in
    if (col2 === -1 || col >= col2) return;

    const replaceFor: number = col + 4; // 'for '.len = 4

    const strPart: string = lStr.slice(replaceFor, col2 + 1); // .padStart(lStr.length, ' ');

    const keyMatch: RegExpMatchArray | null = strPart.match(/\s*(\w+)[,\s]/iu);
    if (keyMatch === null) return;

    const keyPos: number = replaceFor + keyMatch[0].lastIndexOf(keyMatch[1]);
    wrap(arg, keyPos, keyMatch[1]);

    const col3: number = strPart.indexOf(',');
    if (col3 === -1) return;
    // has value

    const replaceComma: number = col3 + 1;
    const valMatch: RegExpMatchArray | null = strPart.slice(replaceComma).match(/\s*(\w+)\b/iu);
    if (valMatch === null) return;

    const valuePos: number = replaceFor + replaceComma + valMatch[0].lastIndexOf(valMatch[1]);
    wrap(arg, valuePos, valMatch[1]);
}
