/* eslint-disable max-lines-per-function */
import type { TAhkTokenLine, TLineFnCall, TTokenStream } from '../../../../globalEnum';
import { fnRefLStr } from '../../../../provider/Def/fnRefLStr';
import { CMemo } from '../../../CMemo';

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

export type TArgs = {
    StrPart: string,
    ln: number,
    col: number,
    by: 0 | 1 | 2, // just of debug in this .ts .file
    lineComment: string,
    comma: number,
};

export type TFnRefSplit = {
    fnUpName: string,
    args: readonly TArgs[],
};

export type TFnRefEx = {
    line: number,
    refList: readonly TFnRefSplit[],
};

function getFnArgs_recursion(
    {
        iStart,
        _AhkTokenLine,
        brackets1: _brackets1,
        brackets2: _brackets2,
        brackets3: _brackets3,
        comma: _comma,
    }: TSearchData,
    DocStrMap: TTokenStream,
    Args: TArgs[],
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

        if (brackets2 > 0 || brackets3 > 0) {
            StrPart += s;
            continue;
        }

        // eslint-disable-next-line unicorn/prefer-switch
        if (s === '(') {
            brackets1++;
        } else if (s === ')') {
            if (brackets1 === 0) {
                if (!(/^[ \t]*$/u).test(StrPart)) {
                    Args.push({
                        by: 0,
                        col: i - StrPart.length,
                        comma,
                        lineComment,
                        ln: line,
                        StrPart,
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
                    Args.push({
                        by: 1,
                        col: i - StrPart.length,
                        comma,
                        lineComment,
                        ln: line,
                        StrPart,
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
            Args.push({
                by: 2,
                col: max - StrPart.length,
                comma,
                lineComment,
                ln: line,
                StrPart,
            });
        }
        StrPart = '';

        // find next line
        const nextLine: TAhkTokenLine | undefined = DocStrMap.find(
            (v: TAhkTokenLine): boolean => v.line === (line + 1) && v.cll === 1,
        );
        if (nextLine !== undefined) {
            getFnArgs_recursion(
                {
                    iStart: 0,
                    _AhkTokenLine: nextLine,
                    brackets1,
                    brackets2,
                    brackets3,
                    comma,
                },
                DocStrMap,
                Args,
            );
        }
    }
}

const memoGetFileFnUsing = new CMemo<TTokenStream, readonly TFnRefEx[]>(
    (DocStrMap: TTokenStream): readonly TFnRefEx[] => {
        const fileAllFnRefData: TFnRefEx[] = [];
        for (const AhkTokenLine of DocStrMap) {
            const { line } = AhkTokenLine;
            const leftFn: readonly TLineFnCall[] = fnRefLStr(AhkTokenLine);
            if (leftFn.length === 0) {
                fileAllFnRefData.push({
                    line,
                    refList: [],
                });
                continue;
            }

            const refList: TFnRefSplit[] = [];
            for (const fnRefData of leftFn) {
                const { upName: fnUpName, col } = fnRefData;
                const args: TArgs[] = [];

                getFnArgs_recursion(
                    {
                        iStart: col + fnUpName.length + 1,
                        _AhkTokenLine: AhkTokenLine,
                        brackets1: 0,
                        brackets2: 0,
                        brackets3: 0,
                        comma: 0,
                    },
                    DocStrMap,
                    args,
                );
                refList.push({
                    fnUpName,
                    args,
                });
            }

            fileAllFnRefData.push(
                {
                    line,
                    refList,
                },
            );
        }

        return fileAllFnRefData;
    },
);

export function getFileFnUsing(DocStrMap: TTokenStream): readonly TFnRefEx[] {
    return memoGetFileFnUsing.up(DocStrMap);
}
