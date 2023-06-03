import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { ControlGetMDMap } from '../../../tools/Built-in/7_sub_command/ControlGet/ControlGet.tools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

const unknownControlGetSubCmdMd: vscode.MarkdownString = new vscode.MarkdownString(
    'Unknown ControlGet [Sub-commands](https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#SubCommands)',
    true,
);

function hoverControlGetParamCore(lStr: string, col: number, character: number): vscode.MarkdownString | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*ControlGet\b\s*,?\s*/iu, 'ControlGet,')
        .padStart(lStr.length, ' ')
        .replace(/\[.*/u, '');
    //  .padEnd(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // ControlGet, OutputVar, SubCommand
    // a0           a1,           a2

    const a2: TScanData | undefined = arr.at(2);
    if (a2 === undefined) return null;
    const { lPos, RawNameNew } = a2;

    if (character >= lPos && character <= lPos + RawNameNew.length) {
        const md: vscode.MarkdownString | undefined = ControlGetMDMap.get(RawNameNew.trim().toUpperCase());
        if (md !== undefined) return md;

        return unknownControlGetSubCmdMd;
    }

    return null;
}

export function hoverControlGetParam(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const { character } = position;
    const { fistWordUp } = AhkTokenLine;
    const keyword: string = 'ControlGet'.toUpperCase();
    if (fistWordUp === keyword) {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return hoverControlGetParamCore(lStr, fistWordUpCol, character);
    }

    const { SecondWordUp } = AhkTokenLine;
    if (SecondWordUp === keyword) {
        const { SecondWordUpCol, lStr } = AhkTokenLine;
        return hoverControlGetParamCore(lStr, SecondWordUpCol, character);
    }

    return null;
}
