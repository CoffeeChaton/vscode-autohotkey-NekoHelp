export function getFistWordCore(lStrTrimFix: string): string {
    const str: string = lStrTrimFix.trimStart();
    const ma1: string | undefined = str.match(/^(default)[ \t]*:/iu)?.[1];
    if (ma1 !== undefined) return ma1;

    /**
     * } else$
     */
    const ma2: string | undefined = str.match(/^(\w+)[ \t]*$/u)?.[1];
    if (ma2 !== undefined) return ma2;

    const ma3: string | undefined = str.match(/^(\w+)[ \t]*,/u)?.[1];
    if (ma3 !== undefined) return ma3;

    const strF: string = lStrTrimFix.replace(/^\w+[ \t]*/u, '');
    if (
        ['=', ':=', '+=', '-=', '*=', '/=', '//=', '.=', '|=', '&=', '^=', '>>=', '<<=', '>>>=']
            .some((v: string): boolean => strF.startsWith(v))
    ) {
        // #Requires AutoHotkey v1.1.33+

        // MsgBox = 1
        // MsgBox := 1
        // MsgBox += 1
        // MsgBox -= 1
        // MsgBox *=1
        // MsgBox /=1
        // MsgBox //=1
        // MsgBox .= 1
        // MsgBox |=1
        // MsgBox &=1
        // MsgBox ^=1
        // MsgBox >>=1
        // MsgBox <<=1
        // MsgBox >>>=1

        return '';
    }

    return str.match(/^(\w+)[ \t]/u)?.[1]
        ?? '';
}

function getFistWord(lStrTrim: string): string {
    // OK    const isOK: boolean = (/^\w*$/u).test(subStr)
    //           || (/^case\s[^:]+:/iu).test(subStr)
    //           || (/^default\s*:/iu).test(subStr)
    // OK        || (/::\s*\w*$/iu).test(subStr) // allow hotstring or hotkey
    // OK        || (/^[{}]\s*/iu).test(subStr);

    return getFistWordCore(lStrTrim.replace(/^[{} \t]*/u, ''));
}

type TFistWordUpData = {
    fistWordUpCol: number,
    fistWordUp: string,
};

export function getFistWordUpData(
    { lStrTrim, lStr, cll }: { lStrTrim: string, lStr: string, cll: 0 | 1 },
): TFistWordUpData {
    if (cll === 1) {
        return {
            fistWordUpCol: -1,
            fistWordUp: '',
        };
    }

    const fistWord: string = lStrTrim.match(/^(\w+)$/u)?.[1]
        ?? getFistWord(lStrTrim);

    const fistWordUpCol: number = fistWord === ''
        ? -1
        : lStr.indexOf(fistWord);

    return {
        fistWordUpCol,
        fistWordUp: fistWord.toUpperCase(),
    };
}
