/* eslint-disable @typescript-eslint/naming-convention */
import type { TAssociated } from '../../../../../AhkSymbol/CAhkFunc';
import { EPseudoArray } from '../../../../../AhkSymbol/CAhkFunc';
import type { TScanData } from '../spiltCommandAll';
import { spiltCommandAll } from '../spiltCommandAll';

export function WinGet_CMD_List(
    lStr: string,
    line: number,
    col: number,
): TAssociated | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^[ \t]*WinGet\b[ \t]*,?[ \t]*/iu, 'WinGet,')
        .padStart(lStr.length, ' ');
    // WinGet  OutputVar, List
    // a0        a1       a2
    const arr: TScanData[] = spiltCommandAll(strF);

    const a2: TScanData | undefined = arr.at(2);
    if (a2 === undefined) {
        return null;
    }

    if (a2.RawNameNew.toUpperCase() !== 'List'.toUpperCase()) {
        return null;
    }

    const { RawNameNew, lPos } = arr[1];

    // OutputVar
    // OutputVar1
    // OutputVar2
    // OutputVar3
    // Infinitely filled masquerade array...I don't know what to do with it =_= thanks you ahk

    return {
        faRawName: RawNameNew,
        chList: [
            {
                chName: `${RawNameNew}1`,
                by: EPseudoArray.byWinGet_CMD_list1,
            },
        ],
        line,
        col: lPos,
        by: EPseudoArray.byWinGet_CMD_list,
    };
}
