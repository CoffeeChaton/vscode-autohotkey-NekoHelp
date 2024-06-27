/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4] }] */

import type { TScanData } from '../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

type TTPatternMatchFn = (lStr: string, fistWordUpCol: number) => string;

export type TPatternMatch = {
    name: string,
    fn: TTPatternMatchFn,
};

/**
 * <https://www.autohotkey.com/docs/v1/lib/IfInString.htm#Remarks>
 *
 * Another command can appear on the same line as this one. In other words, both of these are equivalent:
 *
 * However, items other than named commands are not supported on the same line. For example:
 *
 * ```ahk
 * IfInString, MyVar, abc, GoSub, Process1
 * ;                       ^^^^^
 *
 * IfInString, MyVar, abc, found := true  ; Invalid.
 * ;                       ^^^^^^^^^^^^^ fake
 * ```
 */
export function getIfCmdSecUp(name: string, ax: number): TTPatternMatchFn {
    return (lStr: string, fistWordUpCol: number): string => {
        const strF: string = lStr.slice(fistWordUpCol + name.length)
            .replace(/^\s*,/u, '')
            .trimStart();

        // first opt comma
        const arr: TScanData[] = spiltCommandAll(strF);
        // IfInString, MyVar, abc, GoSub, Process1
        // ^    a0     a1     a2     a3
        const aa: TScanData | undefined = arr.at(ax);

        if (aa === undefined) return '';
        return strF.slice(aa.lPos);
    };
}

/**
 * https://www.autohotkey.com/docs/v1/Language.htm#if-statement
 * https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/22
 */
export const getSecondUpIfEx: readonly TPatternMatch[] = [
    {
        name: 'IFMSGBOX',
        fn: getIfCmdSecUp('IfMsgBox', 1),
    },
    {
        name: 'IFEQUAL',
        fn: getIfCmdSecUp('IfEqual', 2),
    },
    {
        name: 'IFNOTEQUAL',
        fn: getIfCmdSecUp('IfNotEqual', 2),
    },
    {
        name: 'IFLESS',
        fn: getIfCmdSecUp('IfLess', 2),
    },
    {
        name: 'IFLESSOREQUAL',
        fn: getIfCmdSecUp('IfLessOrEqual', 2),
    },
    {
        name: 'IFGREATER',
        fn: getIfCmdSecUp('IfGreater', 2),
    },
    {
        name: 'IFGREATEROREQUAL',
        fn: getIfCmdSecUp('IfGreaterOrEqual', 2),
    },
    {
        name: 'IFINSTRING',
        fn: getIfCmdSecUp('IfInString', 2),
    },
    {
        name: 'IFNOTINSTRING',
        fn: getIfCmdSecUp('IfNotInString', 2),
    },
    {
        name: 'IFEXIST',
        fn: getIfCmdSecUp('IfExist', 1),
    },
    {
        name: 'IFNOTEXIST',
        fn: getIfCmdSecUp('IfNotExist', 1),
    },
    {
        name: 'IFWINACTIVE',
        fn: getIfCmdSecUp('IfWinActive', 4),
    },
    {
        name: 'IFWINNOTACTIVE',
        fn: getIfCmdSecUp('IfWinNotActive', 4),
    },
    {
        name: 'IFWINEXIST',
        fn: getIfCmdSecUp('IfWinExist', 4),
    },
    {
        name: 'IFWINNOTEXIST',
        fn: getIfCmdSecUp('IfWinNotExist', 4),
    },
];
