export function getCaseName(textRaw: string, lStr: string): string | null {
    const caseS = lStr.search(/\bcase[\s,]/iu);
    if (caseS === -1) return null;

    const caseE = lStr.indexOf(':');
    if (caseE === -1) return null;

    // eslint-disable-next-line no-magic-numbers
    return `Case ${textRaw.slice(caseS + 4, caseE).trim()}:`;
}

export function getSwitchName(textRaw: string): string {
    return textRaw.replace(/^[ \t}]*switch\b\s*/iu, '')
        .replace(/\{\s*$/u, '')
        .trim(); // ahk allow switchName === ''
}
