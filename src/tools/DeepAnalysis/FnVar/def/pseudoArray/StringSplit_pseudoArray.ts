/* eslint-disable @typescript-eslint/naming-convention */
import type { TAssociated } from '../../../../../AhkSymbol/CAhkFunc';
import { EPseudoArray } from '../../../../../AhkSymbol/CAhkFunc';
import type { TScanData } from '../spiltCommandAll';
import { spiltCommandAll } from '../spiltCommandAll';

export function StringSplit_pseudoArray(
    lStr: string,
    line: number,
    col: number,
): TAssociated | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^[ \t]*StringSplit\b[ \t]*,?[ \t]*/iu, 'StringSplit,')
        .padStart(lStr.length, ' ');
    // WinGet  OutputVar
    // a0        a1
    const arr: TScanData[] = spiltCommandAll(strF);

    const a1: TScanData | undefined = arr.at(1);
    if (a1 === undefined) {
        return null;
    }

    const { RawNameNew, lPos } = a1;

    // Colors := "red,green,blue"
    // StringSplit, ColorArray, Colors, `,

    // ListVars
    // ; ColorArray0[1 of 3]: 3
    // ; ColorArray1[3 of 3]: red
    // ; ColorArray2[5 of 7]: green
    // ; ColorArray3[4 of 7]: blue

    // ; Colors[14 of 63]: red, green, blue

    return {
        faRawName: RawNameNew,
        chList: [
            {
                chName: `${RawNameNew}0`,
                by: EPseudoArray.byStringSplit0,
            },
            {
                chName: `${RawNameNew}1`,
                by: EPseudoArray.byStringSplit1,
            },
        ],
        line,
        col: lPos,
        by: EPseudoArray.byStringSplit0,
    };
}
