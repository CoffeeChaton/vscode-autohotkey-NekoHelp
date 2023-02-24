import type { TBrackets } from '../../tools/Bracket';
import { calcBracket } from '../../tools/Bracket';
import { spiltCommandAll } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

export type TVarData = {
    rawName: string,
    ch: number,
};

function isLookLikeVar(rawName: string): boolean {
    return !(
        !(/^\w+$/u).test(rawName)
        || (/^_+$/u).test(rawName) // str
        || (/^\d+$/u).test(rawName) // just number
        || (/^0X[\dA-F]+$/iu).test(rawName) // NumHexConst = 0 x [0-9a-fA-F]+
    );
}

type TVarDataResult = {
    varDataList: TVarData[],
    Brackets: TBrackets,
};

/**
 * ```ahk
 * static li := {btn: {oc:1, ari:2, ync:3, yn:4, rc:5, ctc:6}, ico: {"x":16, "?":32, "!":48, "i":64}},b9,c5
 *
 * li,b9,c5 is variable
 * ```
 */
export function varMixedAnnouncement(strF: string, BracketsRaw: TBrackets): TVarDataResult {
    const varDataList: TVarData[] = [];

    let Brackets: TBrackets = [...BracketsRaw];
    for (const { RawNameNew, lPos } of spiltCommandAll(strF)) {
        Brackets = calcBracket(RawNameNew, Brackets);

        if (RawNameNew.includes(':=')) {
            for (const ma of RawNameNew.matchAll(/(?<![.`%])\b(\w+)\s*:=/giu)) {
                const rawName: string = ma[1].trim();
                if (isLookLikeVar(rawName)) {
                    varDataList.push({
                        rawName,
                        ch: lPos + RawNameNew.indexOf(rawName, ma.index),
                    });
                }
            }
        } else if (Brackets[0] === 0 && Brackets[1] === 0 && Brackets[2] === 0) {
            const rawName: string = RawNameNew.trim();
            if (isLookLikeVar(rawName)) {
                varDataList.push({
                    rawName,
                    ch: lPos + RawNameNew.indexOf(rawName),
                });
            }
        }
    }

    return {
        varDataList,
        Brackets,
    };
}
