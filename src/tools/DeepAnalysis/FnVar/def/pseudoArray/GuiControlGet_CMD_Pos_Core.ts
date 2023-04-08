/* eslint-disable @typescript-eslint/naming-convention */
import type { TAssociated } from '../../../../../AhkSymbol/CAhkFunc';
import { EPseudoArray } from '../../../../../AhkSymbol/CAhkFunc';
import type { TScanData } from '../spiltCommandAll';
import { spiltCommandAll } from '../spiltCommandAll';

export function GuiControlGet_CMD_Pos_Core(
    lStr: string,
    line: number,
    col: number,
): TAssociated | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^[ \t]*GuiControlGet\b[ \t]*,?[ \t]*/iu, 'GuiControlGet,')
        .padStart(lStr.length, ' ');
    // GuiControlGet  OutputVar, Pos
    // a0             a1       a2
    const arr: TScanData[] = spiltCommandAll(strF);

    const a2: TScanData | undefined = arr.at(2);
    if (a2 === undefined) {
        return null;
    }

    if (a2.RawNameNew.toUpperCase() !== 'Pos'.toUpperCase()) {
        return null;
    }

    const { RawNameNew, lPos } = arr[1];

    // last[0 of 0]:
    // lastH[3 of 3]: number
    // lastW[3 of 3]: number
    // lastX[2 of 3]: number
    // lastY[1 of 3]: number
    return {
        faRawName: RawNameNew,
        chList: [
            {
                chName: `${RawNameNew}X`,
                by: EPseudoArray.byGuiControlGet_Cmd_PosX,
            },
            {
                chName: `${RawNameNew}Y`,
                by: EPseudoArray.byGuiControlGet_Cmd_PosY,
            },
            {
                chName: `${RawNameNew}H`,
                by: EPseudoArray.byGuiControlGet_Cmd_PosH,
            },
            {
                chName: `${RawNameNew}W`,
                by: EPseudoArray.byGuiControlGet_Cmd_PosW,
            },
        ],
        line,
        col: lPos,
        by: EPseudoArray.byGuiControlGet_Cmd_Pos,
    };
}
