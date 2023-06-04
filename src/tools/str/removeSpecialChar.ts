export const replacerSpace = (match: string): string => ' '.repeat(match.length);

export const fnReplacerStr = (match: string): string => '^'.repeat(match.length);

/**
 * [textFix , '; comment text']
 */
export function getLStr(textRaw: string): string {
    if (textRaw.length === 0) return ''; // let 524 -> 493ms
    if (textRaw.startsWith(';')) return '';
    if ((/^\s*;/u).test(textRaw)) return '';

    // https://www.autohotkey.com/docs/v1/misc/EscapeChar.htm
    return textRaw.replaceAll(/`[,%`;nrbtvaf]/gu, '`^')
        .replace(/[ \t];.*/u, '')
        .replaceAll(/"[^"]*(?:"|$)/gu, fnReplacerStr);
}
