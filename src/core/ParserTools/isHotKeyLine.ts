/* eslint-disable sonarjs/prefer-single-boolean-return */
/* eslint-disable unicorn/no-unsafe-regex */
/* eslint-disable regexp/no-obscure-range */
/* eslint-disable regexp/no-dupe-disjunctions */

import { keyListUpSet } from '../../tools/Built-in/100_other/Keys_and_other/keyList.data';

// /^([#!^+&<>*~$]+|(?:<\^[<>]!))?([!-/]|[:-@]|[\[-`]|[\{-~]|[a-zA-Z0-9]+)([ \t]&[ \t]([!-/]|[:-@]|[\[-`]|[\{-~]|[a-zA-Z0-9]+))?([ \t]+(?i:UP))?(?=::)/ui

function checkHotKeyMa2(ma2: string): boolean {
    if ((/^[a-z\d]$/iu).test(ma2)) {
        return true;
    }

    if ((/^[!-/]|[:-@[-`]|[\\{-~]$/u).test(ma2)) {
        return true;
    }

    if (keyListUpSet.has(ma2.toUpperCase())) {
        return true;
    }

    if ((/^(?:1[0-6]|[1-9])joy/iu).test(ma2) && keyListUpSet.has(ma2.replace(/^(?:1[0-6]|[1-9])/u, '').toUpperCase())) {
        return true;
    }

    //
    if ((/^(?:vk[a-f\d]{1,2}(?:sc[a-f\d]+)?|sc[a-f\d]+)$/iu).test(ma2)) {
        return true;
    }

    return false;
}

// TODO
// type TParserHotKeyLineResult = {
//     errAt2: string,
//     errAt4: string,
// };

export function isHotKeyLine(textRawTrim: string): boolean {
    const ma: RegExpMatchArray | null = textRawTrim.trim().match(
        /^([#!^+&<>*~$]+|<\^[<>]!)?([!-/:-@[-`{-~]|[a-z\d]+)([ \t]&[ \t]([!-/:-@[-`{-~]|[a-z\d]+))?([ \t]+UP)?(?=::)/iu,
        //         ^ ma1                    ^ ma2                    ^ ma3       ^ ma4                      ^ ma5
    );

    if (ma === null) return false;

    const ma2: string = ma[2];
    if (!checkHotKeyMa2(ma2)) {
        return false;
    }

    // eslint-disable-next-line no-magic-numbers
    const ma4: string | undefined = ma.at(4);
    if (ma4 !== undefined && !checkHotKeyMa2(ma4)) {
        return false;
    }

    return true;
}
