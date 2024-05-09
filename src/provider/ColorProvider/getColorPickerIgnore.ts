import type { TTokenStream } from '../../globalEnum';

function getColorPickerIgnore({
    textTrimStart,
    line,
    ignoreLine,
}: {
    textTrimStart: string,
    line: number,
    ignoreLine: number,
}): number {
    // ;@ahk-neko-color-picker-ignore 30 line

    // eslint-disable-next-line no-magic-numbers
    if (textTrimStart.length < 30 || !textTrimStart.startsWith(';@ahk-neko-color-picker-ignore')) {
        return ignoreLine;
    }

    const ignoreMatch: RegExpMatchArray | null = textTrimStart.match(/^;@ahk-neko-color-picker-ignore\s+(\d+)\s/iu);
    if (ignoreMatch === null) return ignoreLine;

    const numberOfIgnore = Number(ignoreMatch[1]);
    return Number.isNaN(numberOfIgnore)
        ? 0 // <-- if numberOfIgnore is NaN, return 0.
        : numberOfIgnore + line;
}

export function getColorPickerIgnoreList(DocStrMap: TTokenStream): readonly boolean[] {
    let ignoreLine = -1;
    const arr: boolean[] = [];
    for (const { textRaw, line } of DocStrMap) {
        const textTrimStart: string = textRaw.trimStart();
        ignoreLine = getColorPickerIgnore({ textTrimStart, line, ignoreLine });
        arr.push(ignoreLine >= line);
    }

    return arr;
}
