/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }] */
import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

function getMenuFuncData(lStr: string, col: number, flag: 0 | 1): readonly TScanData[] | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*GUI\b\s*,?\s*/iu, 'GUI,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // Gui, New , Options, Title
    // a0   a1    a2
    if (arr.length < 3) return null;

    const a1: TScanData = arr[1];
    // src/tools/Built-in/Gui/gui.data.ts
    // allow like
    // Gui, GuiName: add
    //      ^^^^^^^ has GuiName
    //              ^has \s
    if ((/\badd\b/iu).test(a1.RawNameNew)) {
        // a0    a1   a2    a3
        // Gui, Add, Text, cBlue gLaunchGoogle, Click here to launch Google.
        //                 ^^^^^^^^^^^^^^^^^^^
        //                       ^^^^^^^^^^^^^
        const a3: TScanData | undefined = arr.at(3);
        if (a3 === undefined) return null;
        const { RawNameNew, lPos } = a3;

        const lStrFix: string = lStr.slice(lPos, lPos + RawNameNew.length);

        const list: TScanData[] = [];
        const reg: RegExp = flag === 0
            ? /\bg(\w+)/giu
            : /\b(?:v|hwnd)(\w+)/giu; // Gui, Add, ListView, hwndHMainLV01

        for (const ma of lStrFix.matchAll(reg)) {
            const { index } = ma;
            if (index === undefined) continue;
            const fnName: string = ma[1].trim();

            const offset: 1 | 4 = (/^hwnd/iu).test(ma[0])
                ? 4 // "hwnd".length
                : 1;
            list.push({
                RawNameNew: fnName,
                lPos: index + lPos + offset, // +1 is gFuncName/vVarName lPos is replace padStart
            });
        }
        return list;
    }

    return null;
}

/**
 * ```ahk
 * Gui, Add, Text, cBlue gLaunchGoogle, Click here to launch Google.
 * ;                      ^^^^^^^^^^^^
 * Gui, Add, Custom, ClassSysIPAddress32 r1 w150 hwndhIPControl gIPControlEvent
 * ;                                                             ^^^^^^^^^^^^^^
 * ;
 * ```
 * gLaunchGoogle <https://www.autohotkey.com/docs/v1/lib/GuiControls.htm#Text>
 * gIPControlEvent <https://www.autohotkey.com/docs/v1/lib/GuiControls.htm#Custom>
 *
 * G: GoSub (g-label). <https://www.autohotkey.com/docs/v1/lib/Gui.htm#Events>
 * <https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/17>
 *
 * V: Variable. Associates a variable with a control. <https://www.autohotkey.com/docs/v1/lib/Gui.htm#Events>
 *
 * ```ahk
 * GUI, Add, Button, x+1 hp w25 gStartPickingColor vPickuFillBehindColor +hwndhTemp, P
 * ;                             ^ g-func https://www.autohotkey.com/docs/v1/lib/GuiControls.htm#Text
 * ;                                                 ^ v-var https://www.autohotkey.com/docs/v1/lib/Gui.htm#Events
 * ;                                                                           ^ hwnd-var Hwnd OutputVar [v1.1.04+] https://www.autohotkey.com/docs/v1/lib/Gui.htm#Options
 * ```
 */
export function getGuiFunc(AhkTokenLine: TAhkTokenLine, flag: 0 | 1): readonly TScanData[] | null {
    const { fistWordUp } = AhkTokenLine;
    if (fistWordUp === 'GUI') {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return getMenuFuncData(lStr, fistWordUpCol, flag);
    }

    if (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT' || fistWordUp === 'TRY') {
        const { SecondWordUp, SecondWordUpCol, lStr } = AhkTokenLine;
        return SecondWordUp === 'GUI'
            ? getMenuFuncData(lStr, SecondWordUpCol, flag)
            : null;
    }

    return null;
}
