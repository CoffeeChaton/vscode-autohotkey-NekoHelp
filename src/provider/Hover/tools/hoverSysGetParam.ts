import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { SysGetMDMap } from '../../../tools/Built-in/7_sub_command/SysGet/SysGet.tools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

const unknownSysGetSubCmdMd: vscode.MarkdownString = new vscode.MarkdownString(
    'Unknown SysGet [Sub-commands](https://www.autohotkey.com/docs/v1/lib/SysGet.htm#SubCommands)',
    true,
);

function hoverSysGetParamCore(lStr: string, col: number, character: number): vscode.MarkdownString | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*SysGet\b\s*,?\s*/iu, 'SysGet,')
        .padStart(lStr.length, ' ')
        .replace(/\[.*/u, '');
    //  .padEnd(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // SysGet, OutputVar, SubCommand , Value
    // a0           a1         a2

    const a2: TScanData | undefined = arr.at(2);
    if (a2 === undefined) return null;
    const { lPos, RawNameNew } = a2;

    if (character >= lPos && character <= lPos + RawNameNew.length) {
        const md: vscode.MarkdownString | undefined = SysGetMDMap.get(RawNameNew.trim().toUpperCase());
        if (md !== undefined) return md;

        if ((/^\d+$/u).test(RawNameNew.trim())) {
            const mdOpt: vscode.MarkdownString | undefined = SysGetMDMap.get('(Numeric)'.toUpperCase());
            if (mdOpt !== undefined) return mdOpt;
        }

        return unknownSysGetSubCmdMd;
    }

    return null;
}

export function hoverSysGetParam(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const { character } = position;
    const { fistWordUp } = AhkTokenLine;
    const keyword: string = 'SysGet'.toUpperCase();
    if (fistWordUp === keyword) {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return hoverSysGetParamCore(lStr, fistWordUpCol, character);
    }

    const { SecondWordUp } = AhkTokenLine;
    if (SecondWordUp === keyword) {
        const { SecondWordUpCol, lStr } = AhkTokenLine;
        return hoverSysGetParamCore(lStr, SecondWordUpCol, character);
    }

    return null;
}
