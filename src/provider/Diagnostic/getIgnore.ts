import { EDiagBase } from '../../Enum/EDiagBase';

type TGetIgnoreParam = {
    textTrimStart: string,
    line: number,
    ignoreLine: number,
    ignoreLineP: number,
};

type TIgnoreOut = {
    ignoreLine: number,
    ignoreLineP: number,
};

export function getIgnore({
    textTrimStart,
    line,
    ignoreLine,
    ignoreLineP,
}: TGetIgnoreParam): TIgnoreOut {
    // ;@ahk-neko-ignore  30 line.
    // ;@ahk-neko-ignore-fn  30 line.
    // ";@ahk-neko-ignore 3".length is 19

    // eslint-disable-next-line no-magic-numbers
    if (textTrimStart.length < 19 || !textTrimStart.startsWith(EDiagBase.ignore)) {
        return {
            ignoreLine,
            ignoreLineP,
        };
    }

    const ignoreMatch: RegExpMatchArray | null = textTrimStart.match(/^;@ahk-neko-ignore(-fn)?\s+(\d+)\s/iu);
    if (ignoreMatch === null) {
        return {
            ignoreLine,
            ignoreLineP,
        };
    }

    const isFn = ignoreMatch[1] === '-fn';
    const numberOfIgnore = Number(ignoreMatch[2]);
    const result = Number.isNaN(numberOfIgnore)
        ? 0 // <-- if numberOfIgnore is NaN, return 0.
        : numberOfIgnore + line;

    return isFn
        ? {
            ignoreLine,
            ignoreLineP: result,
        }
        : {
            ignoreLine: result,
            ignoreLineP,
        };
}
