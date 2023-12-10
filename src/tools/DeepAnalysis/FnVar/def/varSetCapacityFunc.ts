/* eslint-disable max-depth */
/* eslint-disable sonarjs/no-collapsible-if */
/* eslint-disable max-lines-per-function */
import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import type { TAhkTokenLine, TLineFnCall, TTokenStream } from '../../../../globalEnum';
import { fnRefLStr } from '../../../../provider/Def/fnRefLStr';
import { ToUpCase } from '../../../str/ToUpCase';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';

// NumGet(OutputVar [, Offset := 0, Type := "UPtr"])
// VarSetCapacity(OutputVar)
// TV_GetText(OutputVar, ItemID)
// LV_GetText(OutputVar, RowNumber [, ColumnNumber])

type TSearchData = {
    iStart: number,
    _AhkTokenLine: TAhkTokenLine,
    brackets1: number,
    brackets2: number,
    brackets3: number,
    comma: number,
};

type TArr = {
    StrPart: string,
    ln: number,
    col: number,
    by: 0 | 1 | 2, // just of debug in this .ts .file
    lineComment: string,
    comma: number,
};

function fnSetVar_recursion(
    {
        iStart,
        _AhkTokenLine,
        brackets1: _brackets1,
        brackets2: _brackets2,
        brackets3: _brackets3,
        comma: _comma,
    }: TSearchData,
    AhkTokenList: TTokenStream,
    arr: TArr[],
): void {
    let StrPart = '';

    let brackets1 = _brackets1;
    let brackets2 = _brackets2;
    let brackets3 = _brackets3;
    let comma = _comma;
    const { lStr, line, lineComment } = _AhkTokenLine;
    const max = lStr.length;
    for (let i = iStart; i < max; i++) {
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
            brackets1++;
        } else if (s === ')') {
            if (brackets1 === 0) {
                arr.push({
                    StrPart,
                    ln: line,
                    col: i - StrPart.length,
                    by: 0,
                    lineComment,
                    comma,
                });
                brackets1--;
                StrPart = '';
                continue;
            }
            brackets1--;
        } else if (s === ',') {
            if (brackets1 === 0) {
                //
                arr.push({
                    StrPart,
                    ln: line,
                    col: i - StrPart.length,
                    by: 1,
                    lineComment,
                    comma,
                });
                comma++;
                StrPart = '';
            }
            continue;
        }
        StrPart += s;
    }

    /**
     * after this line
     */
    if (brackets1 === 0) {
        arr.push({
            StrPart,
            ln: line,
            col: max - StrPart.length,
            by: 2,
            lineComment,
            comma,
        });
        StrPart = '';

        // find next line
        const nextLine: TAhkTokenLine | undefined = AhkTokenList.find(
            (v: TAhkTokenLine): boolean => v.line === (line + 1) && v.cll === 1,
        );
        if (nextLine !== undefined) {
            fnSetVar_recursion(
                {
                    iStart: 0,
                    _AhkTokenLine: nextLine,
                    brackets1,
                    brackets2,
                    brackets3,
                    comma,
                },
                AhkTokenList,
                arr,
            );
        }
    }
}

export function varSetCapacityFunc(need: TGetFnDefNeed): void {
    const leftFn: readonly TLineFnCall[] = fnRefLStr(need.AhkTokenLine);
    if (leftFn.length === 0) return;

    for (const fnRefData of leftFn) {
        const { upName, col } = fnRefData;
        const arr: TArr[] = [];
        const {
            AhkTokenLine,
            AhkTokenList,
            fnMode,
            GValMap,
            paramMap,
            valMap,
        } = need;

        fnSetVar_recursion(
            {
                iStart: col + upName.length + 1,
                _AhkTokenLine: AhkTokenLine,
                brackets1: 0,
                brackets2: 0,
                brackets3: 0,
                comma: 0,
            },
            AhkTokenList,
            arr,
        );

        if ((/^VarSetCapacity|NumGet|[TL]V_GetText$/iu).test(upName)) {
            const firstArg: TArr[] = arr.filter((v) => v.comma === 0 && v.StrPart.trim() !== '');
            // console.log('🚀 ~ arr:', arr);
            // console.log('🚀 ~ firstArg:', firstArg);

            if (firstArg.length === 1) {
                const {
                    StrPart: StrPart0,
                    col: _col,
                    ln,
                    lineComment,
                } = firstArg[0];

                const RawName: string = StrPart0
                    .replace(/^[ \t]*&[ \t]*/u, '')
                    .trim();
                if ((/^[#$@\w\u{A1}-\u{FFFF}]+$/u).test(RawName)) {
                    const UpName: string = ToUpCase(RawName);
                    if (paramMap.has(UpName) || GValMap.has(UpName)) continue;
                    const character: number = _col + StrPart0.indexOf(RawName);
                    const value: TValMetaIn = getValMeta({
                        line: ln,
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
}
