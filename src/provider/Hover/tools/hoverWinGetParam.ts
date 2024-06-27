import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { WinGet_MDMap } from '../../../tools/Built-in/7_sub_command/WinGet/WinGet.tools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

const unknownWinGetSubCmdMd: vscode.MarkdownString = new vscode.MarkdownString(
    'Unknown WinGet [Sub-commands](https://www.autohotkey.com/docs/v1/lib/WinGet.htm#SubCommands)',
    true,
);

function hoverWinGetParamCore(lStr: string, col: number, character: number): vscode.MarkdownString | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*WinGet\b\s*,?\s*/iu, 'WinGet,')
        .padStart(lStr.length, ' ')
        .replace(/\[.*/u, '');
    //  .padEnd(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // WinGet, OutputVar, SubCommand , Value
    // a0           a1         a2

    const a2: TScanData | undefined = arr.at(2);
    if (a2 === undefined) return null;
    const { lPos, RawNameNew } = a2;

    if (character >= lPos && character <= lPos + RawNameNew.length) {
        const md: vscode.MarkdownString | undefined = WinGet_MDMap.get(RawNameNew.trim().toUpperCase());
        if (md !== undefined) return md;

        return unknownWinGetSubCmdMd;
    }

    return null;
}

export function hoverWinGetParam(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const { character } = position;
    const { fistWordUp } = AhkTokenLine;
    const keyword: string = 'WinGet'.toUpperCase();
    if (fistWordUp === keyword) {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return hoverWinGetParamCore(lStr, fistWordUpCol, character);
    }

    const { SecondWordUp } = AhkTokenLine;
    if (SecondWordUp === keyword) {
        const { SecondWordUpCol, lStr } = AhkTokenLine;
        return hoverWinGetParamCore(lStr, SecondWordUpCol, character);
    }

    return null;
}
