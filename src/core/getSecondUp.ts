/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4] }] */

import { log } from '../provider/vscWindows/log';
import { getFistWordCore } from './getFistWordUpData';
import { getSecondUpIfEx, type TPatternMatch } from './getSecondUpIfEx';

type TSecondUpData = {
    SecondWordUp: string,
    SecondWordUpCol: number,
};

const patternMatch = [
    {
        name: 'CASE',
        fn: (lStr: string): string => lStr.slice(lStr.indexOf(':') + 1).trimStart(),
    },
    {
        name: 'DEFAULT',
        fn: (lStr: string): string => lStr.slice(lStr.indexOf(':') + 1).trimStart(),
    },
    {
        // // Try Hotkey, %Key1%, Copy
        name: 'TRY',

        // Key1 := "F11"
        // Try Hotkey, %Key1%, label1
        // ;     ^ this
        // Catch, e {
        //     MsgBox, % e.Message ;Target label does not exist.
        // }
        // ; loop, 1
        // ; { Try, Hotkey, %Key1%, label1
        // ;          ^ this
        // ;     Catch e {
        // ;         MsgBox, % "e is" e.Message
        // ;     }
        // ; }
        // dprint-ignore
        // eslint-disable-next-line no-magic-numbers
        fn: (lStr: string, fistWordUpCol: number): string => lStr.slice(fistWordUpCol + 3)
            .replace(/^\s*,/u, '')
            .replace(/^\s*\{/u, '')
            .trimStart(),
    },
    {
        name: 'ELSE',
        //   If False {
        //       MsgBox % "True"
        //   } Else MsgBox % "Else"
        //   ;     ^^^^^^^after Else Cmd
        //   If False {
        //       MsgBox % "True"
        //   } Else , MsgBox % "Else"
        //   ;      ^ ,

        //   If True { ;<------ check "Else"
        //       MsgBox % "True"
        //   } Else MsgBox % "Else"
        //   ;     ^

        //   If True { ;<------ check "Else"
        //       MsgBox % "True"
        //   } Else, MsgBox % "Else"
        //   ;     ^
        // dprint-ignore
        // eslint-disable-next-line no-magic-numbers
        fn: (lStr: string, fistWordUpCol: number): string => lStr.slice(fistWordUpCol + 4)
            .replace(/^\s*,/u, '')
            .replace(/^\s*\{/u, '')
            .trimStart(),
    },
    {
        // Try Throw, Exception("Message--152", "What", "Extra")
        // Catch e {
        //     MsgBox, % e.Message
        // } Finally Loop, 3 { ;<------- loop
        //     MsgBox, % A_Index
        // }
        name: 'FINALLY',
        // dprint-ignore
        fn: (lStr: string, fistWordUpCol: number): string => lStr.slice(fistWordUpCol + 'FINALLY'.length)
            .replace(/^\s*,/u, '')
            .replace(/^\s*\{/u, '')
            .trimStart(),
    },
    ...getSecondUpIfEx,
] as const satisfies readonly TPatternMatch[];

export function getSecondUp(lStr: string, fistWordUp: string, fistWordUpCol: number): TSecondUpData {
    const match: TPatternMatch | undefined = patternMatch.find((v: TPatternMatch): boolean => v.name === fistWordUp);
    if (match === undefined) return { SecondWordUpCol: -1, SecondWordUp: '' };

    const lStrFix: string = match.fn(lStr, fistWordUpCol);
    if (lStrFix === '') return { SecondWordUpCol: -1, SecondWordUp: '' };

    const SecondWord: string = lStrFix.match(/^(\w+)$/u)?.[1] ?? getFistWordCore(lStrFix);
    if (SecondWord === '') return { SecondWordUpCol: -1, SecondWordUp: '' };

    const col: number = lStrFix.padStart(lStr.length, ' ').indexOf(SecondWord);
    if (col === -1) {
        log.warn('"get SecondWordCol error"', lStr, SecondWord);
        return { SecondWordUpCol: -1, SecondWordUp: '' };
    }

    return {
        SecondWordUp: SecondWord.toUpperCase(),
        SecondWordUpCol: col,
    };
}
