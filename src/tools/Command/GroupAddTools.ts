/* eslint-disable no-magic-numbers */
import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

function getGroupAddData_core(lStr: string, col: number, findLabelData: boolean): TScanData | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*GroupAdd\b\s*(?:,\s*)?/iu, 'GroupAdd,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    const find = findLabelData
        ? 4
        : 1;
    const ax: TScanData | undefined = arr.at(find);
    if (ax === undefined) return null;

    // GroupAdd, GroupName [, WinTitle, WinText, Label, ExcludeTitle, ExcludeText]
    // a0          a1        a2         a3        a4

    const { RawNameNew, lPos } = ax;

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
export function getGroupAddData(AhkTokenLine: TAhkTokenLine, findLabelData: boolean): TScanData | null {
    const {
        fistWordUp,
        fistWordUpCol,
        lStr,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    if (fistWordUp === 'GROUPADD') return getGroupAddData_core(lStr, fistWordUpCol, findLabelData);
    if (SecondWordUp === 'GROUPADD') return getGroupAddData_core(lStr, SecondWordUpCol, findLabelData);

    return null;
}
