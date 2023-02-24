/* eslint-disable max-lines-per-function */
/* eslint-disable max-depth */

import { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { CAhkInclude } from '../../../AhkSymbol/CAhkInclude';
import {
    CAhkComment,
    CAhkDirectives,
    CAhkHotKeys,
    CAhkHotString,
    CAhkLabel,
} from '../../../AhkSymbol/CAhkLine';
import type { TTopSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { DeepReadonly } from '../../../globalEnum';

const lineIsIFRegexps: DeepReadonly<RegExp[]> = [
    /^if(?:MsgBox)?\b/iu,
    /^else\b/iu,
    // /^loop\b/iu,
    // /^for\b/iu,
    // /^while\b/iu,
    /^if(?:not)?exist\b/iu,
    /^ifWin(?:not)?(?:active|exist)\b/iu,
    /^if(?:not)?inString\b/iu,
    // /^try\b/iu,
    // /^catch\b/iu,
    // /^switch\b/iu,
];

function LineIsIFCase(lStr: string): boolean {
    const lStrTrimFix: string = lStr.trim().replace(/^\}\s*/u, '');
    return lineIsIFRegexps.some((reg: Readonly<RegExp>): boolean => reg.test(lStrTrimFix));
}

export function getMatrixTopLabe(AhkFileData: TAhkFileData, useTopLabelIndent: boolean): readonly (0 | 1)[] {
    const { AST, DocStrMap } = AhkFileData;

    const list: (0 | 1)[] = [...DocStrMap].map((): 0 => 0);
    if (!useTopLabelIndent) return list;

    const topSymbolList: ReadonlyMap<number, TTopSymbol> = new Map(
        AST.map((TopSymbol: TTopSymbol): [number, TTopSymbol] => [TopSymbol.range.start.line, TopSymbol]),
    );

    const DocStrMapLen: number = DocStrMap.length;
    for (const TopSymbol of AST) {
        // + Label:
        // + ::HotString::
        // + ~F12::
        if (
            !(TopSymbol instanceof CAhkLabel
                || TopSymbol instanceof CAhkHotKeys
                || TopSymbol instanceof CAhkHotString)
        ) {
            continue;
        }

        if (TopSymbol.AfterString.length > 0) {
            continue;
        }
        // TopSymbol: CAhkHotKeys | CAhkHotString | CAhkLabel

        const start: number = TopSymbol.selectionRange.start.line;

        let isSolve = false;
        for (let line = start + 1; line < DocStrMapLen; line++) {
            const lnDef: TTopSymbol | undefined = topSymbolList.get(line);
            if (lnDef !== undefined) {
                // allow #directives && ;; comments
                if (
                    lnDef instanceof CAhkInclude
                    || lnDef instanceof CAhkDirectives
                    || lnDef instanceof CAhkComment
                ) {
                    list[line] = 1;
                    continue;
                }

                /**
                 * Function Hotkeys indentation
                 * https://www.autohotkey.com/docs/v1/Hotkeys.htm#Function
                 * ~F10:
                 * ::el,,::
                 * ::el2,,::
                 * ;There must only be whitespace, comments or directives between the hotkey/hotstring labels or label and the function.
                 *    def_fn(){
                 *
                 *   }
                 */
                if (lnDef instanceof CAhkFunc) {
                    const ed = lnDef.range.end.line;
                    for (let lineFn = lnDef.range.start.line; lineFn <= ed; lineFn++) {
                        list[lineFn] = 1;
                    }
                    isSolve = true;
                    break;
                }

                if (
                    lnDef instanceof CAhkLabel
                    || lnDef instanceof CAhkHotString
                    || lnDef instanceof CAhkHotKeys
                ) {
                    isSolve = true;
                    break;
                }
                break; // if (TopSymbol instanceof CAhkLabel || TopSymbol instanceof CAhkHotString) break;
            }
            const { lStr } = DocStrMap[line];
            if (lStr.length > 0 && lStr.trim().length > 0) {
                break; // not only whitespace, comments
            }
        }
        if (isSolve) {
            continue;
        }

        /**
         * ~F12::
         *     { ;<-----------user use '{' to manage manually
         *     }
         * Returns
         */
        if (DocStrMap[start + 1].lStr.trimStart().startsWith('{')) {
            continue;
        }
        // -------------------
        // ~F12
        //     deep++
        // return
        for (let line = start + 1; line < DocStrMapLen; line++) {
            list[line] = 1;
            /**
             * Do not indent, even if it is through
             */

            const lnDef: TTopSymbol | undefined = topSymbolList.get(line);
            if (
                lnDef instanceof CAhkLabel
                || lnDef instanceof CAhkHotString
                || lnDef instanceof CAhkHotKeys
            ) {
                list[line] = 0;
                if (lnDef instanceof CAhkHotKeys && lnDef.AfterString.trim().length > 0) {
                    break;
                }
            }

            const { fistWordUp } = DocStrMap[line];
            if (
                ['RETURN', 'EXIT', 'EXITAPP', 'RELOAD'].includes(fistWordUp)
                && !LineIsIFCase(DocStrMap.at(line - 1)?.lStr ?? '') // check line-1 //FIXME: use foc?
            ) {
                list[line] = 0;
                break;
            }
        }
    }

    return list;
}

// i don't like ahk-plus try to fmt label in func...
//
// fn(arr){
//     For _Key, Value in arr {
//         if (Value == "EX"){
//             Goto, loopExit1
//         }
//         ; do something
//     }
//
//     loopExit1:
//     ; do something but i don't want indentation
// }
//
// but i need to indentation of top label: now.
