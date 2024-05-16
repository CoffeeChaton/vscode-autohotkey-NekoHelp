import type { TAhkTokenLine } from '../../../globalEnum';
import type { TFocExParser } from '../../../tools/Built-in/3_foc/focEx.tools';
import { getFocExIfData } from '../../../tools/Built-in/3_foc/focEx.tools';

export function lineReplaceCheckIfIn(AhkTokenLine: TAhkTokenLine): TFocExParser | null {
    const {
        fistWordUp,
        fistWordUpCol,
        lStr,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    if (fistWordUp === '') return null;

    if (fistWordUp === 'IF') return getFocExIfData(lStr, fistWordUpCol);
    if (SecondWordUp === 'IF') return getFocExIfData(lStr, SecondWordUpCol);

    return null;
}
