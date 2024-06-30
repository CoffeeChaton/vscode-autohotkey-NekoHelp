import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

function getSortFuncData(lStr: string, col: number): TScanData | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*Sort\b\s*,?\s*/iu, 'Sort,')
        .padStart(lStr.length, ' ');
    // Sort, VarName , Options
    // a0     a1       a2

    const arr: TScanData[] = spiltCommandAll(strF);
    const a2: TScanData | undefined = arr.at(2);
    if (a2 === undefined) return null;

    const { RawNameNew, lPos } = a2;

    const ma: RegExpMatchArray | null = RawNameNew.match(/\bf[ \t]+([#$@\w\u{A1}-\u{FFFF}]+)\b/iu);
    if (ma === null) return null;

    const ln: number | undefined = ma.index;
    if (ln === undefined) return null;

    const fnName: string = ma[1];
    return {
        RawNameNew: fnName,
        lPos: lPos + ln + ma[0].indexOf(fnName),
    };
}

/**
 * Sort F-flag <https://www.autohotkey.com/docs/v1/lib/Sort.htm#Options>
 * ```ahk
 * Sort, MyVar, F IntegerSort D
 * ;            --^^^^^^^^^^^ is func
 * ```
 */
export function getSortFunc(AhkTokenLine: TAhkTokenLine): TScanData | null {
    const {
        fistWordUp,
        fistWordUpCol,
        lStr,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    if (fistWordUp === 'SORT') return getSortFuncData(lStr, fistWordUpCol);
    if (SecondWordUp === 'SORT') return getSortFuncData(lStr, SecondWordUpCol);

    return null;
}
