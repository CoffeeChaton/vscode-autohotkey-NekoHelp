export const replacerSpace = (match: string): string => ' '.repeat(match.length);

export const fnReplacerStr = (match: string): string => '_'.repeat(match.length);

/**
 * [textFix , '; comment text']
 */
export function getLStr(textRaw: string): string {
    if (textRaw.length === 0) return ''; // let 524 -> 493ms
    if (textRaw.startsWith(';')) return '';
    if ((/^\s*;/u).test(textRaw)) return '';

    // https://www.autohotkey.com/docs/v1/misc/EscapeChar.htm
    const textFix = textRaw.replaceAll(/`[,%`;nrbtvaf]/gu, '__').replaceAll(/"[^"]*"/gu, fnReplacerStr);
    const i = textFix.search(/[ \t];/u);

    switch (i) {
        case -1:
            return textFix;
        case 0:
            return '';
        default:
            return textFix.slice(0, i);
    }
}
