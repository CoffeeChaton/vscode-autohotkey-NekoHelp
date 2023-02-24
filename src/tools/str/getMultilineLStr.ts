import type { TMultilineFlag } from '../../globalEnum';

/**
 * %
 *
 * if PercentFlag (%-flag) true
 * -> look % like str...
 */
function getMultilineLStrStyle1(
    { textRaw, CFlag, PercentFlag }: { textRaw: string, CFlag: boolean, PercentFlag: boolean },
): string {
    /**
     * flag of '%'
     */
    let satePercent = false;

    /**
     * flag of "`"
     */
    let sateEscape = false;

    let lStr = '';

    const len = textRaw.length;
    for (let i = 0; i < len; i++) {
        const s = textRaw[i];

        if (sateEscape) {
            // i need to check/diag  `[,%`;nrbtvaf] ?
            lStr += '^';
            sateEscape = false;
            continue;
        }

        switch (s) {
            case '`':
                lStr += '^';
                sateEscape = true;
                break;

            case ' ':
            case '\t':
                lStr += s;
                break;

            case ';':
                if (CFlag) {
                    const sBefore = textRaw[i - 1] as string | undefined; //  V--- undefined is at Col `0`
                    if (sBefore === ' ' || sBefore === '\t' || sBefore === undefined) {
                        return lStr; // <----------------------------------------------------------------------------------
                    }
                }
                lStr += '^';
                break;

            case '%':
                /**
                 * %
                 *
                 * if PercentFlag (%-flag) true
                 * -> look % like str...
                 */
                if (PercentFlag) {
                    lStr += '^';
                    continue;
                }

                lStr += '%';
                satePercent = !satePercent;
                break;

            default:
                // %A_LineFile%
                //    ^ this  <---- += s
                lStr += satePercent
                    ? s
                    : '^';
                break;
        }
    }

    return lStr;
}

/**
 * just allow `EMultiline.mid`
 */
export function getMultilineLStrStyle2(
    { textRaw, CFlag }: { textRaw: string, CFlag: boolean },
): string {
    /**
     * flag of '"'
     */
    let sateStr = false;

    /**
     * flag of "`"
     */
    let sateEscape = false;

    let lStr = '';

    const len = textRaw.length;
    for (let i = 0; i < len; i++) {
        const s = textRaw[i];

        if (sateEscape) {
            // i need to check/diag  `[,%`;nrbtvaf] ?
            lStr += '^';
            sateEscape = false;
            continue;
        }

        switch (s) {
            case '`':
                lStr += '^';
                sateEscape = true;
                break;

            case ' ':
            case '\t':
                lStr += s;
                break;

            case ';':
                if (CFlag) {
                    const sBefore = textRaw[i - 1] as string | undefined; //  V--- undefined is at Col `0`
                    if (sBefore === ' ' || sBefore === '\t' || sBefore === undefined) {
                        return lStr; // <---------------------------------------------------------------------------------------------
                    }
                }
                lStr += '^';
                break;

            case '"':
                lStr += '"';
                sateStr = !sateStr;
                // TODO support like " obj["some key"]" style
                //                   ^----------------^
                break;

            default:
                //        "A_LineFile"
                //           ^ this    += s
                lStr += sateStr
                    ? s
                    : '^';
                break;
        }
    }

    return lStr;
}

/**
 * just allow `EMultiline.mid`
 */
export function getMultilineLStr(
    { multilineFlag, textRaw }: { multilineFlag: TMultilineFlag, textRaw: string },
): string {
    if (multilineFlag === null) {
        return '';
    }

    // TODO support some-flag
    // const config = {
    //     OK ';': multilineFlag.CommentFlag.length > 0,
    //     ?  '%': Percent ... i don't what is this
    //     ?  ',': comma  ... i don't what is this
    //     ?  '`': MultilineFlag.accent.length > 0,
    // } as const;

    const CFlag: boolean = multilineFlag.CommentFlag.length > 0;
    return multilineFlag.isExpress
        ? getMultilineLStrStyle2({ textRaw, CFlag })
        : getMultilineLStrStyle1({ textRaw, CFlag, PercentFlag: multilineFlag.PercentFlag.length > 0 });
}
