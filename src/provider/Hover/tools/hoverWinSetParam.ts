import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { WinSet_MDMap } from '../../../tools/Built-in/7_sub_command/WinSet/WinSet.tools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

const unknownWinSetSubCmdMd: vscode.MarkdownString = new vscode.MarkdownString(
    'Unknown WinSet [Sub-commands](https://www.autohotkey.com/docs/v1/lib/WinSet.htm#SubCommands)',
    true,
);

function hoverWinSetParamCore(lStr: string, col: number, character: number): vscode.MarkdownString | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*WinSet\b\s*,?\s*/iu, 'WinSet,')
        .padStart(lStr.length, ' ')
        .replace(/\[.*/u, '');
    //  .padEnd(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // WinSet, SubCommand
    // a0           a1

    const a1: TScanData | undefined = arr.at(1);
    if (a1 === undefined) return null;
    const { lPos, RawNameNew } = a1;

    if (character >= lPos && character <= lPos + RawNameNew.length) {
        const md: vscode.MarkdownString | undefined = WinSet_MDMap.get(RawNameNew.trim().toUpperCase());
        if (md !== undefined) return md;

        return unknownWinSetSubCmdMd;
    }

    return null;
}

export function hoverWinSetParam(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const { character } = position;
    const { fistWordUp } = AhkTokenLine;
    const keyword: string = 'WinSet'.toUpperCase();
    if (fistWordUp === keyword) {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return hoverWinSetParamCore(lStr, fistWordUpCol, character);
    }

    const { SecondWordUp } = AhkTokenLine;
    if (SecondWordUp === keyword) {
        const { SecondWordUpCol, lStr } = AhkTokenLine;
        return hoverWinSetParamCore(lStr, SecondWordUpCol, character);
    }

    return null;
}
