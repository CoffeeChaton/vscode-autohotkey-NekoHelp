/* eslint-disable no-magic-numbers */
import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

function getMenuFuncData(lStr: string, col: number): TScanData | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*Menu\b\s*,?\s*/iu, 'Menu,')
        .padStart(lStr.length, ' ');
    // Menu, MenuName, Add , MenuItemName,               LabelOrSubmenu, Options
    // Menu, Tray,     Add, This menu item is a submenu, :MySubmenu

    const arr: TScanData[] = spiltCommandAll(strF);
    const a2: TScanData | undefined = arr.at(2);

    if (a2 === undefined) return null;

    if ((/^add$/iu).test(a2.RawNameNew)) {
        // Menu, MenuName, Add , MenuItemName, LabelOrSubmenu, Options
        //                ^^^^                 ^^^^^^^^^^^^^^
        // a0    a1        a2       a3         a4              a5
        const a4: TScanData | undefined = arr.length === 4
            ? arr.at(3) // a3 -> If LabelOrSubmenu is omitted, MenuItemName will be used as both the label and the menu item's name.
            : arr.at(4); // a4
        if (a4 === undefined) return null;
        const { RawNameNew, lPos } = a4;

        if (!(/^\w+$/u).test(RawNameNew)) return null; // % FuncObj or %label%

        return {
            RawNameNew,
            lPos,
        };
    }

    // Menu, MenuName, Insert , MenuItemName, ItemToInsert, LabelOrSubmenu, Options
    //                                                      ^^^^^^^^^^^^^^
    //                 a3                      a5           a6
    if ((/^Insert$/iu).test(a2.RawNameNew)) {
        const a5: TScanData | undefined = arr.at(5);
        if (a5 === undefined) return null;
        const { RawNameNew, lPos } = a5;

        if (!(/^\w+$/u).test(RawNameNew)) return null; // % FuncObj or %label%

        return {
            RawNameNew,
            lPos,
        };
    }
    return null;
}

/**
 * ```ahk
 * Menu, MenuName,     Add, MenuItemName                , LabelOrSubmenu
 * Menu, OpenWithMenu, Add, &Choose external application, browseExternalApp
 * ;------------------------------------------------------^^^^^^^^^^^^^^is label/func name
 * ```
 * <https://www.autohotkey.com/docs/v1/misc/Labels.htm#Functions>
 * <https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/17>
 */
export function getMenuFunc(AhkTokenLine: TAhkTokenLine): TScanData | null {
    const { fistWordUp } = AhkTokenLine;
    if (fistWordUp === 'MENU') {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return getMenuFuncData(lStr, fistWordUpCol);
    }

    if (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT' || fistWordUp === 'TRY') {
        const { SecondWordUp, SecondWordUpCol, lStr } = AhkTokenLine;
        return SecondWordUp === 'MENU'
            ? getMenuFuncData(lStr, SecondWordUpCol)
            : null;
    }

    return null;
}
