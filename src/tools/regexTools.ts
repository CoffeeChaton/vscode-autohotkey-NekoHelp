/* eslint-disable security/detect-non-literal-regexp */
export function ahkValDefRegex(valName: string): RegExp {
    return new RegExp(`(?<![.])\\b${valName}\\b[ \\t]*:=`, 'iu');
}
