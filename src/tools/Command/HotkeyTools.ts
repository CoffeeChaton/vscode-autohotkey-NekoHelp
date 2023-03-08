import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

function getHotkeyData(lStr: string, col: number): TScanData | null {
    // OK Hotkey, KeyName , Label, Options
    //                        ^
    // NG Hotkey, IfWinActive/Exist , WinTitle, WinText
    // NG Hotkey, If , Expression
    // NG Hotkey, If, % FunctionObject
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*Hotkey\b\s*,?\s*/iu, 'Hotkey,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // eslint-disable-next-line no-magic-numbers
    if (arr.length < 3) return null;

    const [_a1, a2, a3] = arr;
    if ((/^if/iu).test(a2.RawNameNew)) return null;

    const { RawNameNew, lPos } = a3;

    if (!(/^\w+$/u).test(RawNameNew)) return null; // % FuncObj or %label%

    return {
        RawNameNew,
        lPos,
    };
}

export function getHotkeyWrap(AhkTokenLine: TAhkTokenLine): TScanData | null {
    const {
        fistWordUp,
        fistWordUpCol,
        lStr,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    if (fistWordUp === 'HOTKEY') return getHotkeyData(lStr, fistWordUpCol);
    if (SecondWordUp === 'HOTKEY') return getHotkeyData(lStr, SecondWordUpCol);

    return null;
}
