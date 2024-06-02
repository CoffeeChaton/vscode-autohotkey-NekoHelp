/* eslint-disable max-lines-per-function */
import {
    EFnRefBy,
    type TAhkTokenLine,
    type TLineFnCall,
    type TTokenStream,
} from '../../../../globalEnum';
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

type TArgs = {
    StrPart: string,
    ln: number,
    col: number,
    by: 0 | 1 | 2, // just of debug in this .ts .file
    lineComment: string,
    comma: number,
};

type TCmdRefSplit = {
    CmdUpName: string,
    args: readonly TArgs[],
};

export type TCmdRefEx = readonly TCmdRefSplit[];

function getCmdArgs_recursion(
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

        const nextLine: TAhkTokenLine | undefined = DocStrMap.at(line + 1);
        if (nextLine !== undefined && nextLine.cll === 1) {
            getCmdArgs_recursion(
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

const memoGetFileCmdUsing = new CMemo<TTokenStream, readonly TCmdRefEx[]>(
    (DocStrMap: TTokenStream): readonly TCmdRefEx[] => {
        const fileAllCmdRefData: TCmdRefEx[] = [];
        for (const AhkTokenLine of DocStrMap) {
            if (AhkTokenLine.fistWordUp === '') {
                fileAllCmdRefData.push([]);
                continue;
            }

            const leftCmd: readonly TLineFnCall[] = AhkTokenLine.SecondWordUp === ''
                ? [
                    {
                        upName: AhkTokenLine.fistWordUp,
                        line: AhkTokenLine.line,
                        col: AhkTokenLine.fistWordUpCol,
                        by: EFnRefBy.justCall,
                    },
                ]
                : [
                    {
                        upName: AhkTokenLine.SecondWordUp,
                        line: AhkTokenLine.line,
                        col: AhkTokenLine.SecondWordUpCol,
                        by: EFnRefBy.justCall,
                    },
                ];

            const refList: TCmdRefSplit[] = [];
            for (const cmdRefData of leftCmd) {
                const { upName, col } = cmdRefData;
                const args: TArgs[] = [];

                getCmdArgs_recursion(
                    {
                        iStart: col + upName.length + 1,
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
                    CmdUpName: upName,
                    args,
                });
            }

            fileAllCmdRefData.push(refList);
        }

        return fileAllCmdRefData;
    },
);

export function getFileCmdUsing(DocStrMap: TTokenStream): readonly TCmdRefEx[] {
    return memoGetFileCmdUsing.up(DocStrMap);
}
