import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

function checkBGRCore(
    lStr: string,
    wordUpCol: number,
    WordUp: string,
    ax: number,
): boolean {
    const strF: string = lStr
        .slice(wordUpCol + WordUp.length)
        .replace(/^\s*,?\s*/u, `${WordUp},`)
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);

    const aLast: TScanData | undefined = arr.at(ax);
    if (aLast === undefined || arr.length === 2) return true;
    //
    const { RawNameNew } = aLast;

    return !((/\bRGB\b/iu).test(RawNameNew));
}

export function checkBGR(AhkTokenLine: TAhkTokenLine): boolean {
    const {
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
        lStr,
    } = AhkTokenLine;
    const PixelGetColor = 'PixelGetColor'.toUpperCase();
    // PixelGetColor, OutputVar, X, Y , Mode
    //  a0               a1      a2  a3  a4
    if (fistWordUp === '') return false;
    if (fistWordUp === PixelGetColor) return checkBGRCore(lStr, fistWordUpCol, PixelGetColor, 4);
    if (SecondWordUp === PixelGetColor) return checkBGRCore(lStr, SecondWordUpCol, PixelGetColor, 4);

    const PixelSearch = 'PixelSearch'.toUpperCase();
    // PixelSearch, OutputVarX, OutputVarY, X1, Y1, X2, Y2, ColorID , Variation, Mode
    //  0            1            2          3    4 5     6  7         8            a9
    const a9 = 9;
    if (fistWordUp === PixelSearch) return checkBGRCore(lStr, fistWordUpCol, PixelGetColor, a9);
    if (SecondWordUp === PixelSearch) return checkBGRCore(lStr, SecondWordUpCol, PixelGetColor, a9);
    return false;
}
