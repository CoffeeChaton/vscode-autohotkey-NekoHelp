/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4,9] }] */
import type { TGetFnDefNeed } from '../TFnVarDef';
import { wrap } from './forLoop';
import type { TScanData } from './spiltCommandAll';
import { spiltCommandAll } from './spiltCommandAll';

/**
 * <https://www.autohotkey.com/docs/v1/lib/Gui.htm#GuiHwndOutputVar>
 */
export function GuiAddHwndVal(arg: TGetFnDefNeed, keyWord: string, WordUpCol: number): void {
    if (keyWord !== 'GUI') return;
    const {
        lStrTrimLen,
        lStr,
    } = arg;
    if (lStrTrimLen < 9) return; // "Gui +HwndV" ----> len 9

    const strF: string = lStr
        .slice(WordUpCol)
        .replace(/^\s*Gui\b\s*,?\s*/iu, 'Gui,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // Gui, +Option -Option +Hwnd
    // a0    a1

    const a1: TScanData | undefined = arr.at(1);
    if (a1 === undefined) return;

    const { lPos, RawNameNew } = a1;

    for (const ma of RawNameNew.matchAll(/\+Hwnd([#$@\w\u{A1}-\u{FFFF}]+)/giu)) {
        wrap(arg, ma.index + lPos + '+Hwnd'.length, ma[1]);
    }
}
