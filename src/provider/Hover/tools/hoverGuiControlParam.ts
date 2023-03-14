import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { GuiControlMDMap } from '../../../tools/Built-in/GuiControl/GuiControl.tools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

const GuiControlNameMd: vscode.MarkdownString = new vscode.MarkdownString(
    'hover at name or number or HWND [(Remarks)](https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Remarks)',
    true,
)
    .appendCodeblock('GuiControl, MyGui:Show, MyButton', 'ahk')
    .appendCodeblock('GuiControl, MyGui:, MyListBox, Item1|Item2', 'ahk');

const unknownGuiControlSubCmdMd: vscode.MarkdownString = new vscode.MarkdownString(
    'Unknown GuiControl [Sub-commands](https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#SubCommands)',
    true,
);

function hoverGuiControlParamCore(lStr: string, col: number, character: number): vscode.MarkdownString | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*GuiControl\b\s*,?\s*/iu, 'GuiControl,')
        .padStart(lStr.length, ' ')
        .replace(/\[.*/u, '');
    //  .padEnd(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // GuiControl , MyGui:Show , MyButton
    // a0           a1           a2

    const atA1: TScanData | undefined = arr.at(1);
    if (atA1 === undefined) return null;
    const { lPos, RawNameNew } = atA1;

    /**
     * Gui, New
     * Gui, GuiName:New
     */
    if (character >= lPos && character <= lPos + RawNameNew.length) {
        const nameCol: number = RawNameNew.indexOf(':');
        if (nameCol > -1 && character >= lPos && character <= lPos + nameCol) {
            return GuiControlNameMd;
        }

        const word: string = nameCol > -1
            ? RawNameNew.slice(nameCol).replace(':', '')
            : RawNameNew;
        const md: vscode.MarkdownString | undefined = GuiControlMDMap.get(word.trim().toUpperCase());
        if (md !== undefined) return md;

        if (RawNameNew.includes('+') || RawNameNew.includes('-')) {
            const mdOpt: vscode.MarkdownString | undefined = GuiControlMDMap.get('(options)'.toUpperCase());
            if (mdOpt !== undefined) return mdOpt;
        }

        // meaningless
        // if (RawNameNew === '') {
        //     const mdOpt: vscode.MarkdownString | undefined = GuiControlMDMap.get('(Blank)'.toUpperCase());
        //     if (mdOpt !== undefined) return mdOpt;
        // }

        return unknownGuiControlSubCmdMd;
    }

    return null;
}

export function hoverGuiControlParam(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const { character } = position;
    const { fistWordUp } = AhkTokenLine;
    const keyword: string = 'GuiControl'.toUpperCase();
    if (fistWordUp === keyword) {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return hoverGuiControlParamCore(lStr, fistWordUpCol, character);
    }

    const { SecondWordUp } = AhkTokenLine;
    if (SecondWordUp === keyword) {
        const { SecondWordUpCol, lStr } = AhkTokenLine;
        return hoverGuiControlParamCore(lStr, SecondWordUpCol, character);
    }

    return null;
}
