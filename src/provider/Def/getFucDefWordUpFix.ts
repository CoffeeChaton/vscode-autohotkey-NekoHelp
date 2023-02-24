import type { TAhkTokenLine } from '../../globalEnum';
import { getGuiFunc } from '../../tools/Command/GuiTools';
import { fnRefTextRawReg } from './getFnRef';

export function getFucDefWordUpFix(AhkTokenLine: TAhkTokenLine, wordUp: string, character: number): string {
    /**
     * fix gui GLabel = =||
     */
    if ((/^g/iu).test(wordUp)) {
        for (const { RawNameNew, lPos } of getGuiFunc(AhkTokenLine, 0) ?? []) {
            if (`G${RawNameNew.toUpperCase()}` === wordUp && (character >= lPos || character <= lPos + wordUp.length)) {
                return RawNameNew.toUpperCase();
            }
        }
    }

    /**
     * fix gui GLabel = =||
     */
    if ((/^v/iu).test(wordUp)) {
        for (const { RawNameNew, lPos } of getGuiFunc(AhkTokenLine, 1) ?? []) {
            if (`V${RawNameNew.toUpperCase()}` === wordUp && (character >= lPos || character <= lPos + wordUp.length)) {
                return RawNameNew.toUpperCase();
            }
        }
    }

    if ((/^hwnd/iu).test(wordUp)) {
        for (const { RawNameNew, lPos } of getGuiFunc(AhkTokenLine, 1) ?? []) {
            if (
                `HWND${RawNameNew.toUpperCase()}` === wordUp && (character >= lPos || character <= lPos + wordUp.length)
            ) {
                return RawNameNew.toUpperCase();
            }
        }
    }

    /**
     * (?CFuncName)
     */
    if ((/^c/iu).test(wordUp)) {
        for (const { upName, col } of fnRefTextRawReg(AhkTokenLine)) {
            if (`C${upName}` === wordUp && (character >= col || character <= col + wordUp.length)) {
                return upName;
            }
        }
    }
    return wordUp;
}
