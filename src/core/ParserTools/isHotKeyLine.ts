/* eslint-disable regexp/no-unused-capturing-group */
/* eslint-disable unicorn/no-unsafe-regex */
/* eslint-disable regexp/no-obscure-range */
/* eslint-disable regexp/no-dupe-disjunctions */

// /^([#!^+&<>*~$]+|(?:<\^>!))?([!-/]|[:-@]|[\[-`]|[\{-~]|[a-zA-Z0-9]+)([ \t]&[ \t]([!-/]|[:-@]|[\[-`]|[\{-~]|[a-zA-Z0-9]+))?([ \t]+(?i:UP))?(?=::)/ui
// /^([#!^+&<>*~$]+|(?:<\^>!))?([!-/]|[:-@]|[\[-`]|[\{-~]|[a-zA-Z0-9]+)([ \t]&[ \t]([!-/]|[:-@]|[\[-`]|[\{-~]|[a-zA-Z0-9]+))?([ \t]+UP)?(?=::)/ui

export function isHotKeyLine(textRawTrim: string): boolean {
    return (/^([#!^+&<>*~$]+|<\^>!)?([!-/:-@[-`{-~]|[a-z\d]+)([ \t]&[ \t]([!-/:-@[-`{-~]|[a-z\d]+))?([ \t]+UP)?(?=::)/iu)
        .test(
            textRawTrim,
        );
}
