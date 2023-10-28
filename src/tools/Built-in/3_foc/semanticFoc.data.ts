/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4] }] */

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
    ['IfExist', 1],
    ['IfNotExist', 4],
    ['IfWinActive', 4],
    ['IfWinExist', 4],
    ['IfWinNotActive', 4],
    ['IfWinNotExist', 4],
] as [string, number][]).map(([a, b]: [string, number]): [string, number] => [a.toUpperCase(), b]));

export const FocTrySet: ReadonlySet<string> = new Set([
    'Try',
    'Catch',
    'Finally',
].map((s) => s.toUpperCase()));

export const FocOtherSet: ReadonlySet<string> = new Set([
    'ELSE',
    'FOR',
    'IF',
    'LOOP',
    'WHILE',
].map((s) => s.toUpperCase()));

/*

if ()
if old

IfBetween
IfContains
IfIn
IfIs

Loop, %i%
LoopFiles
LoopParse
LoopRead
LoopReg

*/
