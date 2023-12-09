/* eslint-disable sonarjs/no-collapsible-if */
/* eslint-disable max-lines-per-function */
import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import type { TLineFnCall } from '../../../../globalEnum';
import { fnRefLStr } from '../../../../provider/Def/fnRefLStr';
import { ToUpCase } from '../../../str/ToUpCase';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';

// NumGet(OutputVar [, Offset := 0, Type := "UPtr"])
// VarSetCapacity(OutputVar)
// TV_GetText(OutputVar, ItemID)
// LV_GetText(OutputVar, RowNumber [, ColumnNumber])

export function varSetCapacityFunc({
    lStr,
    valMap,
    line,
    paramMap,
    GValMap,
    lineComment,
    fnMode,
    AhkTokenLine,
}: TGetFnDefNeed): void {
    const { lineFnCallRaw } = AhkTokenLine;
    if (lineFnCallRaw.length === 0) return;

    const leftFn: readonly TLineFnCall[] = fnRefLStr(AhkTokenLine);

    for (const fnRefData of leftFn) {
        const { upName, col } = fnRefData;
        if (!(/^VarSetCapacity|NumGet|[TL]V_GetText$/iu).test(upName)) continue;

        // const comma = 0;
        let brackets = 0;
        let brackets2 = 0;
        let brackets3 = 0;

        const max = lStr.length;

        let StrPart = '';
        type TArr = {
            StrPart: string,
            j: number,
            by: 0 | 1 | 2,
        };
        const arr: TArr[] = [];
        for (let i = col + upName.length + 1; i < max; i++) {
            const s: string = lStr[i];
            switch (s) {
                case '[':
                    brackets2++;
                    break;
                case ']':
                    brackets2--;
                    break;

                case '{':
                    brackets3++;
                    break;
                case '}':
                    brackets3--;
                    break;
                default:
                    break;
            }

            if (brackets2 > 0 || brackets3 > 0) continue;

            // eslint-disable-next-line unicorn/prefer-switch
            if (s === '(') {
                brackets++;
            } else if (s === ')') {
                if (brackets === 0) {
                    arr.push({
                        StrPart,
                        j: i - StrPart.length,
                        by: 0,
                    });
                    StrPart = '';
                    break;
                }
                brackets--;
            } else if (s === ',') {
                if (brackets === 0) {
                    //
                    arr.push({
                        StrPart,
                        j: i - StrPart.length,
                        by: 1,
                    });
                    StrPart = '';
                    // TODO get arg2 arg3 \
                    // comma++;
                    // break;
                }
                continue;
            }
            StrPart += s;
        }

        // eslint-disable-next-line sonarjs/no-collapsible-if
        if (brackets !== 0) {
            // TODO
            //  to next line
            // eslint-disable-next-line unicorn/no-lonely-if
            if (StrPart !== '') { // next line
                arr.push({
                    StrPart,
                    j: max - StrPart.length,
                    by: 2,
                });
                StrPart = '';
            }
        }
        const firstArg = arr.at(0);
        if (firstArg !== undefined) {
            const { StrPart: StrPart0, j } = firstArg;
            const RawName: string = StrPart0
                .replace(/^[ \t]*&[ \t]*/u, '')
                .trim();
            if ((/^[#$@\w\u{A1}-\u{FFFF}]+$/u).test(RawName)) {
                const UpName: string = ToUpCase(RawName);
                if (paramMap.has(UpName) || GValMap.has(UpName)) continue;

                const character: number = j + StrPart0.indexOf(RawName);

                const value: TValMetaIn = getValMeta({
                    line,
                    character,
                    RawName,
                    valMap,
                    lineComment,
                    fnMode,
                    Associated: null,
                });
                valMap.set(ToUpCase(RawName), value);
            }
        }
    }
}
