import { log } from '../provider/vscWindows/log';
import { getFistWordCore } from './getFistWordUpData';

type TSecondUpData = {
    SecondWordUp: string,
    SecondWordUpCol: number,
};

type TPatternMatch = {
    name: string,
    fn: (lStr: string, fistWordUpCol: number) => string,
};

const patternMatch = [
    {
        name: 'CASE',
        fn: (lStr: string): string => lStr.slice(lStr.indexOf(':') + 1).trim(),
    },
    {
        name: 'DEFAULT',
        fn: (lStr: string): string => lStr.slice(lStr.indexOf(':') + 1).trim(),
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
            .replace(/\s*,/u, '')
            .trim(),
    },
] as const satisfies readonly TPatternMatch[];

/**
 * ```js
 *     if (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT' || fistWordUp === 'TRY')
 * ```
 */
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
