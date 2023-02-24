export function getFistWordCore(lStrTrimFix: string): string {
    const ma1: string | undefined = lStrTrimFix.match(/^(default)\s*:/iu)?.[1];
    if (ma1 !== undefined) return ma1;

    /**
     * } else$
     */
    const ma2: string | undefined = lStrTrimFix.match(/^(\w+)$/u)?.[1];
    if (ma2 !== undefined) return ma2;

    return lStrTrimFix.match(/^(\w+)[\s,]+(?![:+\-*/~.|&^]=)/u)?.[1]
        ?? '';
}

function getFistWord(lStrTrim: string): string {
    // OK    const isOK: boolean = (/^\w*$/u).test(subStr)
    //           || (/^case\s[^:]+:/iu).test(subStr)
    //           || (/^default\s*:/iu).test(subStr)
    // OK        || (/::\s*\w*$/iu).test(subStr) // allow hotstring or hotkey
    // OK        || (/^[{}]\s*/iu).test(subStr);

    if ((/^[{}]/u).test(lStrTrim)) {
        /**
         * } else$
         */
        const lStrTrimFix: string = lStrTrim.replace(/^[{} \t]*/u, '');
        return getFistWordCore(lStrTrimFix);
    }

    // not need to fix
    return getFistWordCore(lStrTrim);
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

    const fistWordUpCol = fistWord === ''
        ? -1
        : lStr.indexOf(fistWord);

    return {
        fistWordUpCol,
        fistWordUp: fistWord.toUpperCase(),
    };
}
