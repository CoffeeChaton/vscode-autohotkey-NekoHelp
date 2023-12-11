/* eslint-disable max-lines-per-function */
import type { TAhkTokenLine, TLineFnCall, TTokenStream } from '../../../../globalEnum';
import { fnRefLStr } from '../../../../provider/Def/fnRefLStr';
import { CMemo } from '../../../CMemo';
import type { TGetFnDefNeed } from '../TFnVarDef';

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

export type TArr = {
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
                if (!(/^[ \t]*$/u).test(StrPart)) {
                    arr.push({
                        StrPart,
                        ln: line,
                        col: i - StrPart.length,
                        by: 0,
                        lineComment,
                        comma,
                    });
                }
                brackets1--;
                StrPart = '';
                continue;
            }
            brackets1--;
        } else if (s === ',') {
            if (brackets1 === 0) {
                if (!(/^[ \t]*$/u).test(StrPart)) {
                    arr.push({
                        StrPart,
                        ln: line,
                        col: i - StrPart.length,
                        by: 1,
                        lineComment,
                        comma,
                    });
                }
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
        if (!(/^[ \t]*$/u).test(StrPart)) {
            arr.push({
                StrPart,
                ln: line,
                col: max - StrPart.length,
                by: 2,
                lineComment,
                comma,
            });
        }
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

const memoFnSetVar = new CMemo<TGetFnDefNeed, ReadonlyMap<string, TArr[]>>(
    (need: TGetFnDefNeed): ReadonlyMap<string, TArr[]> => {
        const leftFn: readonly TLineFnCall[] = fnRefLStr(need.AhkTokenLine);
        if (leftFn.length === 0) return new Map();

        const {
            AhkTokenLine,
            AhkTokenList,
        } = need;

        const map = new Map<string, TArr[]>();
        for (const fnRefData of leftFn) {
            const { upName, col } = fnRefData;
            const arr: TArr[] = [];

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
            map.set(upName, arr);
        }

        return map;
    },
);

export function fnSetVar(need: TGetFnDefNeed): ReadonlyMap<string, TArr[]> {
    return memoFnSetVar.up(need);
}
