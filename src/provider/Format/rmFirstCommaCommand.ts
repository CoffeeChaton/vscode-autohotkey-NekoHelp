import { ErmFirstCommaCommand } from '../../configUI.data';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import { EMultiline } from '../../globalEnum';

export function rmFirstCommaCommand(
    {
        col,
        removeFirstCommaCommand,
        AhkTokenLine,
        DocStrMap,
    }: {
        col: number,
        removeFirstCommaCommand: ErmFirstCommaCommand,
        AhkTokenLine: TAhkTokenLine,
        DocStrMap: TTokenStream,
    },
): string {
    //
    const { textRaw, lStr } = AhkTokenLine;

    if (removeFirstCommaCommand === ErmFirstCommaCommand.notFmt) {
        return textRaw.trim();
    }

    if (
        col === lStr.trimEnd().length
        || col === lStr.trimEnd().length + 1
    ) return textRaw.trim();

    if (removeFirstCommaCommand === ErmFirstCommaCommand.to1) {
        return (/^[ \t]*,/u).test(lStr.slice(col))
            ? textRaw.slice(0, col).trim() + textRaw.slice(col)
                .replace(/^[ \t]*,[ \t]*/u, ', ')
                .trimEnd()
            : textRaw.slice(0, col).trim() + textRaw.slice(col)
                .replace(/^[ \t]*/u, ', ')
                .trimEnd();
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (removeFirstCommaCommand === ErmFirstCommaCommand.to2) {
        const strF: string = textRaw.slice(col).trim();
        if (!strF.startsWith(',')) {
            const space = ' ';
            return textRaw.slice(0, col).trim() + space + strF;
        }

        /**
         * ```ahk
         * MsgBox, ; <--- if miss , It will becomes non-working!
         *    ( LTrim
         *      str--str--str
         *    )
         * ```
         */
        let nextLineIsMultiline = false;
        const { line } = AhkTokenLine;

        for (let i = line + 1; i < DocStrMap.length; i++) {
            const nextLineToken: TAhkTokenLine = DocStrMap[i];
            if (nextLineToken.cll === 0) {
                break;
            }
            if (nextLineToken.multiline === EMultiline.start) {
                nextLineIsMultiline = true;
                break;
            }
        }
        if (nextLineIsMultiline) {
            return textRaw.trim();
        }

        const strF2: string = strF.replace(/,[ \t]*/u, '');
        if (strF2.startsWith(',')) {
            // miss first param
            return textRaw.trim();
        }

        if (
            ['=', ':=', '+=', '-=', '*=', '/=', '//=', '.=', '|=', '&=', '^=', '>>=', '<<=', '>>>=']
                .some((v: string): boolean => strF2.startsWith(v))
        ) {
            return textRaw.trim();
        }

        // avoid 1. space-param
        // avoid 2. MsgBox :=
        // avoid 2. MsgBox =
        // avoid 3. MsgBox, //next line is (LTrim

        return textRaw.slice(0, col).trim() + strF.replace(/^,[ \t]*/u, ' ').trimEnd();
    }

    return textRaw.trim();
}
