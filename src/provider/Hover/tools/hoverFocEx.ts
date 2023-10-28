import type * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { focExMapOut } from '../../../tools/Built-in/3_foc/focEx.tools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

type TFocExParser = {
    FocUpName: 'IF' | 'LOOP',

    /**
     * `IN` of `ifIn`
     */
    exUpName: string,
    /**
     * pos of `in`
     */
    lPos: number,
};

function hoverFocExLoop(lStr: string, wordUpCol: number): TFocExParser | null {
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

    return {
        FocUpName: 'LOOP',
        exUpName: RawNameNew.trim().toUpperCase(),
        lPos,
    };
}

function hoverFocExIf(lStr: string, wordUpCol: number): TFocExParser | null {
    const strF: string = lStr
        .slice(wordUpCol)
        .replace(/^\s*IF\b\s*,?\s*/iu, 'IF,')
        .padStart(lStr.length, ' ');

    const ma: RegExpMatchArray | null = strF.match(/(?<=[ \t])(between|contains|in|is)(?=[ \t])/iu);
    if (ma === null) return null;

    const name: string = ma[1];
    const lPos: number = ma.index ?? strF.indexOf(name);

    return {
        FocUpName: 'IF',
        exUpName: name.trim().toUpperCase(),
        lPos,
    };
}

function FocEx2Md(focExParser: TFocExParser | null, character: number): vscode.MarkdownString | null {
    if (focExParser === null) return null;

    const { lPos, exUpName, FocUpName } = focExParser;
    if (character >= lPos && character <= lPos + exUpName.length) {
        const md: vscode.MarkdownString | undefined = focExMapOut.get(`${FocUpName}${exUpName}`);
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
        return FocEx2Md(hoverFocExLoop(lStr, fistWordUpCol), character);
    }
    if (fistWordUp === 'IF') {
        return FocEx2Md(hoverFocExIf(lStr, fistWordUpCol), character);
    }

    return null;
}
