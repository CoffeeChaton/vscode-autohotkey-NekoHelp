import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { MenuMDMap } from '../../../tools/Built-in/7_sub_command/Menu/Menu.tools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

const MenuNameMd: vscode.MarkdownString = new vscode.MarkdownString(
    'hover at [MenuItemName](https://www.autohotkey.com/docs/v1/lib/Menu.htm#MenuItemName)',
    true,
);

const MenuTrayMd: vscode.MarkdownString = new vscode.MarkdownString(
    'hover at [Tray](https://www.autohotkey.com/docs/v1/Program.htm#tray-icon)',
    true,
);

const unknownMenuSubCmdMd: vscode.MarkdownString = new vscode.MarkdownString(
    'Unknown Menu [Sub-commands](https://www.autohotkey.com/docs/v1/lib/Menu.htm#SubCommands)',
    true,
);

function hoverMenuParamCore(lStr: string, col: number, character: number): vscode.MarkdownString | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*Menu\b\s*,?\s*/iu, 'Menu,')
        .padStart(lStr.length, ' ')
        .replace(/\[.*/u, '');
    //  .padEnd(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // Menu, MenuName, SubCommand , Value1, Value2, Value3, Value4
    // a0    a1        a2
    //                 ^^^

    const at1: TScanData | undefined = arr.at(1);
    if (at1 === undefined) return null;

    if (character >= at1.lPos && character <= at1.lPos + at1.RawNameNew.length) {
        return at1.RawNameNew.toUpperCase() === 'TRAY'
            ? MenuTrayMd
            : MenuNameMd;
    }

    const at2: TScanData | undefined = arr.at(2);
    if (at2 === undefined) return null;
    const { lPos, RawNameNew } = at2;

    if (character >= lPos && character <= lPos + RawNameNew.length) {
        return MenuMDMap.get(RawNameNew.trim().toUpperCase()) ?? unknownMenuSubCmdMd;
    }

    return null;
}

export function hoverMenuParam(AhkTokenLine: TAhkTokenLine, position: vscode.Position): vscode.MarkdownString | null {
    const { character } = position;
    const { fistWordUp } = AhkTokenLine;
    if (fistWordUp === 'MENU') {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return hoverMenuParamCore(lStr, fistWordUpCol, character);
    }

    const { SecondWordUp } = AhkTokenLine;
    if (SecondWordUp === 'MENU') {
        const { SecondWordUpCol, lStr } = AhkTokenLine;
        return hoverMenuParamCore(lStr, SecondWordUpCol, character);
    }

    return null;
}
