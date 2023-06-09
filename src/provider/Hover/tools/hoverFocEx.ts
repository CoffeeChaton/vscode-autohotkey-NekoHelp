import type * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { focExMapOut } from '../../../tools/Built-in/3_foc/focEx.tools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

/**
 * ```ahk
 *  Loop, Files
 *  Loop, Parse
 *  Loop, Read
 *  Loop, Reg
 *  ```
 */
function hoverFocExLoop(lStr: string, wordUpCol: number, character: number): vscode.MarkdownString | null {
    const strF: string = lStr
        .slice(wordUpCol)
        .replace(/^\s*Loop\b\s*,?\s*/iu, 'Loop,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);

    // Loop, Files
    //  a0   a1
    const a1: TScanData | undefined = arr.at(1);
    if (a1 === undefined) return null;
    const { lPos, RawNameNew } = a1;

    if (character >= lPos && character <= lPos + RawNameNew.length) {
        const md: vscode.MarkdownString | undefined = focExMapOut.get(`LOOP${RawNameNew.trim().toUpperCase()}`);
        if (md !== undefined) return md;
    }

    return null;
}

/**
 * ```ahk
 *  if between
 *  if contains
 *  if in
 *  if is
 *  ```
 */
function hoverFocExIF(lStr: string, wordUpCol: number, character: number): vscode.MarkdownString | null {
    const strF: string = lStr
        .slice(wordUpCol)
        .replace(/^\s*IF\b\s*,?\s*/iu, 'IF,')
        .padStart(lStr.length, ' ');

    const ma: RegExpMatchArray | null = strF.match(/(?<=[ \t])(between|contains|in|is)(?=[ \t])/iu);
    if (ma === null) return null;

    const name: string = ma[1];
    const col: number = ma.index ?? strF.indexOf(name);

    if (character >= col && character <= col + name.length) {
        const md: vscode.MarkdownString | undefined = focExMapOut.get(`IF${name.trim().toUpperCase()}`);
        if (md !== undefined) return md;
    }

    return null;
}

/**
 * ```ahk
 *  if between
 *  if contains
 *  if in
 *  if is
 *  ;--
 *  Loop, Files
 *  Loop, Parse
 *  Loop, Read
 *  Loop, Reg
 *  ```
 */
export function hoverFocEx(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const { character } = position;
    const { fistWordUp, fistWordUpCol, lStr } = AhkTokenLine;
    if (character <= fistWordUp.length + fistWordUpCol) return null;

    if (fistWordUp === 'LOOP') {
        return hoverFocExLoop(lStr, fistWordUpCol, character);
    }
    if (fistWordUp === 'IF') {
        return hoverFocExIF(lStr, fistWordUpCol, character);
    }

    return null;
}
