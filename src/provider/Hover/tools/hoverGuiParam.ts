import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { GuiMDMapOut } from '../../../tools/Built-in/Gui/gui.tools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

const GuiNameMd: vscode.MarkdownString = new vscode.MarkdownString(
    'hover at [GuiName](https://www.autohotkey.com/docs/v1/lib/Gui.htm#New)',
    true,
);

const unknownGuiSubCmdMd: vscode.MarkdownString = new vscode.MarkdownString(
    'Unknown Gui [Sub-commands](https://www.autohotkey.com/docs/v1/lib/Gui.htm#SubCommands)',
    true,
);

function hoverGuiParamCore(lStr: string, col: number, character: number): vscode.MarkdownString | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*GUI\b\s*,?\s*/iu, 'GUI,')
        .padStart(lStr.length, ' ')
        .replace(/\[.*/u, '');
    //  .padEnd(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // Gui, New , Options, Title
    // a0   a1    a2

    const atA1: TScanData | undefined = arr.at(1);
    if (atA1 === undefined) return null;
    const { lPos, RawNameNew } = atA1;
    /**
     * Gui, New
     * Gui, GuiName:New
     */
    if (character >= lPos && character <= lPos + RawNameNew.length) {
        const GuiNameCol: number = RawNameNew.indexOf(':');
        if (GuiNameCol > -1 && character >= lPos && character <= lPos + GuiNameCol) {
            return GuiNameMd; // any better doc?
        }

        const word: string = GuiNameCol > -1
            ? RawNameNew.slice(GuiNameCol).replace(':', '')
            : RawNameNew;
        const md: vscode.MarkdownString | undefined = GuiMDMapOut.get(word.trim().toUpperCase());
        if (md !== undefined) return md;
        if (RawNameNew.includes('+') || RawNameNew.includes('-')) {
            const mdOpt: vscode.MarkdownString | undefined = GuiMDMapOut.get('Options'.toUpperCase());
            if (mdOpt !== undefined) return mdOpt;
        }

        return unknownGuiSubCmdMd;
    }

    return null;
}

export function hoverGuiParam(AhkTokenLine: TAhkTokenLine, position: vscode.Position): vscode.MarkdownString | null {
    const { character } = position;
    const { fistWordUp } = AhkTokenLine;
    if (fistWordUp === 'GUI') {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return hoverGuiParamCore(lStr, fistWordUpCol, character);
    }

    const { SecondWordUp } = AhkTokenLine;
    if (SecondWordUp === 'GUI') {
        const { SecondWordUpCol, lStr } = AhkTokenLine;
        return hoverGuiParamCore(lStr, SecondWordUpCol, character);
    }

    return null;
}
