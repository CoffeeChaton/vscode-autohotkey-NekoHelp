/* eslint-disable no-magic-numbers */
import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

function getMenuFuncData(lStr: string, col: number): TScanData | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*GroupAdd\b\s*(?:,\s*)?/iu, 'GroupAdd,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    const a4: TScanData | undefined = arr.at(4);
    if (a4 === undefined) return null;

    // GroupAdd, GroupName [, WinTitle, WinText, Label, ExcludeTitle, ExcludeText]
    // a0          a1        a2         a3        a4

    const { RawNameNew, lPos } = a4;

    if (RawNameNew.includes('%')) return null;

    return {
        RawNameNew,
        lPos,
    };
}

/**
 * ```ahk
 * GroupAdd, GroupName , WinTitle, WinText, Label, ExcludeTitle, ExcludeText
 * ;                                        ^^^^^
 * ```
 */
export function getGroupAddFunc(AhkTokenLine: TAhkTokenLine): TScanData | null {
    const {
        fistWordUp,
        fistWordUpCol,
        lStr,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    if (fistWordUp === 'GROUPADD') return getMenuFuncData(lStr, fistWordUpCol);
    if (SecondWordUp === 'GROUPADD') return getMenuFuncData(lStr, SecondWordUpCol);

    return null;
}
