import { FindExprDelim } from '../../../zFromCpp/FindExprDelim';

export type TScanData = {
    readonly RawNameNew: string,
    readonly lPos: number,
};

/**
 * @param strF ahk is allow first arg don't need "," , so please fix lStr -> strF
 */
export function spiltCommandAll(strF: string): TScanData[] {
    const lStrLen: number = strF.length;

    const AllCut: TScanData[] = [];
    let make = -1;

    do {
        const oldMake: number = make + 1;
        make = FindExprDelim(strF, ',', make + 1);
        const partStr: string = strF.slice(oldMake, make);
        const RawNameNew: string = partStr.trim();

        AllCut.push({
            RawNameNew,
            lPos: oldMake + partStr.indexOf(RawNameNew),
        });
    } while (make !== lStrLen);

    return AllCut;
}
