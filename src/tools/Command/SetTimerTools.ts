import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

function getSetTimerData(lStr: string, col: number): TScanData | null {
    // SetTimer , Label_or_fnName, PeriodOnOffDelete, Priority
    // SetTimer , , PeriodOnOffDelete, Priority

    const strF: string = lStr
        .slice(col)
        .replace(/^\s*SetTimer\b\s*,?\s*/iu, 'SetTimer,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    if (arr.length < 2) return null;

    const [_a1, a2] = arr;

    const { RawNameNew, lPos } = a2;

    // eslint-disable-next-line security/detect-unsafe-regex
    if (!(/^[#$@\w\u{A1}-\u{FFFF}]+$/u).test(RawNameNew)) return null; // % FuncObj or %label%

    return {
        RawNameNew,
        lPos,
    };
}

export function getSetTimerWrap(AhkTokenLine: TAhkTokenLine): TScanData | null {
    const {
        fistWordUp,
        fistWordUpCol,
        lStr,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    if (fistWordUp === 'SETTIMER') return getSetTimerData(lStr, fistWordUpCol);
    if (SecondWordUp === 'SETTIMER') return getSetTimerData(lStr, SecondWordUpCol);

    return null;
}
