/* eslint-disable @typescript-eslint/naming-convention */
import type { TAssociated } from '../../../../../AhkSymbol/CAhkFunc';
import { EPseudoArray } from '../../../../../AhkSymbol/CAhkFunc';
import type { TScanData } from '../spiltCommandAll';
import { spiltCommandAll } from '../spiltCommandAll';

export function SysGet_CMD(
    lStr: string,
    line: number,
    col: number,
): TAssociated | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^[ \t]*SysGet\b[ \t]*,?[ \t]*/iu, 'SysGet,')
        .padStart(lStr.length, ' ');
    // SysGet  OutputVar, Monitor or MonitorWorkArea
    // a0        a1       a2
    const arr: TScanData[] = spiltCommandAll(strF);

    const a2: TScanData | undefined = arr.at(2);
    if (a2 === undefined) {
        return null;
    }

    if (
        a2.RawNameNew.toUpperCase() !== 'Monitor'.toUpperCase()
        && a2.RawNameNew.toUpperCase() !== 'MonitorWorkArea'.toUpperCase()
    ) {
        return null;
    }

    const { RawNameNew, lPos } = arr[1];

    // OutputVar[0 of 0]:
    // OutputVarBottom[4 of 7]:
    // OutputVarLeft[1 of 3]:
    // OutputVarRight[4 of 7]:
    // OutputVarTop[1 of 3]:
    return {
        faRawName: RawNameNew,
        chList: [
            {
                chName: `${RawNameNew}Bottom`,
                by: EPseudoArray.bySysGet_CMD_Bottom,
            },
            {
                chName: `${RawNameNew}Left`,
                by: EPseudoArray.bySysGet_CMD_Left,
            },
            {
                chName: `${RawNameNew}Right`,
                by: EPseudoArray.bySysGet_CMD_Right,
            },
            {
                chName: `${RawNameNew}Top`,
                by: EPseudoArray.bySysGet_CMD_Top,
            },
        ],
        line,
        col: lPos,
        by: EPseudoArray.bySysGet_CMD,
    };
}
