/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4] }] */

export const FocSetOneLine: ReadonlySet<string> = new Set([
    'Break',
    'Continue',
    'Critical',
    'Exit',
    'ExitApp',
    'GoSub',
    'Goto',
    'Pause',
    'Reload',
    'Return',
    'Throw',
    'Until',
].map((s) => s.toUpperCase()));

export const FocSetSwitchCase: ReadonlySet<string> = new Set([
    'Switch',
    'Case',
    'Default',
].map((s) => s.toUpperCase()));

/**
 * <https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/22>
 * The One True Brace (OTB) style may not be used with legacy If statements.
 * It can only be used with If (expression).
 */
export const FocIfExMap: ReadonlyMap<string, number> = new Map(([
    ['IfMsgBox', 1],
    ['IfEqual', 2],
    ['IfNotEqual', 2],
    ['IfLess', 2],
    ['IfLessOrEqual', 2],
    ['IfGreater', 2],
    ['IfGreaterOrEqual', 2],
    ['IfInString', 2],
    ['IfNotInString', 2],
    ['IfExist', 1], // never OTB
    ['IfNotExist', 4], // never OTB
    ['IfWinActive', 4], // never OTB
    ['IfWinExist', 4], // never OTB
    ['IfWinNotActive', 4], // never OTB
    ['IfWinNotExist', 4], // never OTB
] as [string, number][]).map(([a, b]: [string, number]): [string, number] => [a.toUpperCase(), b]));

export const FocTrySet: ReadonlySet<string> = new Set([
    'Try',
    'Catch',
    'Finally',
].map((s) => s.toUpperCase()));

export const FocOtherSet: ReadonlySet<string> = new Set([
    'else',
    'for',
    'if',
    'loop',
    'while',
].map((s) => s.toUpperCase()));
