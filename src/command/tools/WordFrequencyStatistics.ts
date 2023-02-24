/* eslint no-magic-numbers: ["error", { "ignore": [0,10,20] }] */

import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { log } from '../../provider/vscWindows/log';

function getWordFrequency(DEB: Map<string, number>): string[] {
    type TElement = {
        k: string,
        v: number,
    };

    let e5: TElement[] = [];
    const { size } = DEB;
    for (const [k, v] of DEB) {
        if (v > 10 || size < 20) {
            e5.push({ k, v });
        }
    }

    e5.sort((a: TElement, b: TElement): number => b.v - a.v);

    if (e5.length > 20) {
        e5 = e5.slice(0, 20);
    }

    return e5.map(({ k, v }: TElement): string => `${k}: ${v}`);
}

export function WordFrequencyStatistics(ahkFnList: CAhkFunc[], timeSpend: number): void {
    let paramMapSize = 0;
    let valMapSize = 0;
    let textMapSize = 0;
    let fnNumber = 0;
    let methodNumber = 0;
    const DEB = new Map<string, number>();
    for (const ed of ahkFnList) {
        paramMapSize += ed.paramMap.size;
        valMapSize += ed.valMap.size;
        textMapSize += ed.textMap.size;
        for (const [k, v] of ed.textMap) {
            const oldNum: number = DEB.get(k) ?? 0;
            DEB.set(k, oldNum + v.refRangeList.length);
        }
        if (ed.defStack.length === 0) {
            fnNumber++;
        } else {
            methodNumber++;
        }
    }

    log.info([
        'Command > "5 -> DeepAnalysis All File"',
        '---unknown Word frequency statistics---------------',
        ...getWordFrequency(DEB),
        '---other information-------------------------------',
        'Deep Analysis All Files',
        `Deep Analysis : ${ahkFnList.length} Symbol, function : ${fnNumber} , method: ${methodNumber}`,
        `paramMapSize is ${paramMapSize}`,
        `valMapSize is ${valMapSize}`,
        `textMapSize is ${textMapSize}`,
        `All Size is ${paramMapSize + valMapSize + textMapSize}`,
        `Done in ${timeSpend} ms`,
    ].join('\n'));

    log.show();
}

// PointsF: 35
// -> Gdip_all_2020_08_24
// -> ByRef
// -> ex: "   iCount := CreatePointsF(PointsF, Points)"
// -> ex: CreatePointsF(ByRef PointsF, inPoints)

// WIDTH: 30, HEIGHT: 29
// -> Gdip_all_2020_08_24
// -> ByRef
// -> Gdip_GetImageDimensions(pBitmap, Width, Height)
// -> ex: "Gdip_GetImageDimensions(pBitmap, Width, Height)"

// W: 24
// -> Gdip_all_2020_08_24
// -> ByRef
// -> exp : "Gdip_GetImageDimensions(pBitmap, W, H)"

// pPath: 24
// -> Gdip_all_2020_08_24
// -> line 1062 -> Gdip_DrawRoundedRectanglePath(pGraphics, pPen, X, Y, W, H, R) {
// -> line 1063      ; Create a GraphicsPath
// -> line 1064     DllCall("Gdiplus.dll\GdipCreatePath", "UInt", 0, "PtrP", pPath)

// UP: 23
// "    send, {LCtrl Up}"
