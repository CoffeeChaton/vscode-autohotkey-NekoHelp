import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { ControlMDMap } from '../../../tools/Built-in/7_sub_command/Control/Control.tools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

const unknownControlSubCmdMd: vscode.MarkdownString = new vscode.MarkdownString(
    'Unknown Control [Sub-commands](https://www.autohotkey.com/docs/v1/lib/Control.htm#SubCommands)',
    true,
);

function hoverControlParamCore(lStr: string, col: number, character: number): vscode.MarkdownString | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*Control\b\s*,?\s*/iu, 'Control,')
        .padStart(lStr.length, ' ')
        .replace(/\[.*/u, '');
    //  .padEnd(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // Control, SubCommand
    // a0           a1

    const a1: TScanData | undefined = arr.at(1);
    if (a1 === undefined) return null;
    const { lPos, RawNameNew } = a1;

    if (character >= lPos && character <= lPos + RawNameNew.length) {
        const md: vscode.MarkdownString | undefined = ControlMDMap.get(RawNameNew.trim().toUpperCase());
        if (md !== undefined) return md;

        return unknownControlSubCmdMd;
    }

    return null;
}

export function hoverControlParam(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const { character } = position;
    const { fistWordUp } = AhkTokenLine;
    const keyword: string = 'Control'.toUpperCase();
    if (fistWordUp === keyword) {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return hoverControlParamCore(lStr, fistWordUpCol, character);
    }

    const { SecondWordUp } = AhkTokenLine;
    if (SecondWordUp === keyword) {
        const { SecondWordUpCol, lStr } = AhkTokenLine;
        return hoverControlParamCore(lStr, SecondWordUpCol, character);
    }

    return null;
}
