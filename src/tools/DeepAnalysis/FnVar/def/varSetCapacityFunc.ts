/* eslint-disable max-depth */
/* eslint-disable sonarjs/no-collapsible-if */
/* eslint-disable max-lines-per-function */
import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import type { TAhkTokenLine, TLineFnCall, TTokenStream } from '../../../../globalEnum';
import { fnRefLStr } from '../../../../provider/Def/fnRefLStr';
import { C507_varName_like_number } from '../../../../provider/Diagnostic/DA/CDiagFnLib/C507_varName_like_number';
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

function SetVar_by_NumGet(
    arr: TArr[],
    need: TGetFnDefNeed,
): void {
    const {
        fnMode,
        GValMap,
        paramMap,
        valMap,
    } = need;
    const firstArg: TArr[] = arr.filter((v) => v.comma === 0 && v.StrPart.trim() !== '');
    if (firstArg.length !== 1) return;
    const {
        StrPart,
        col: _col,
        ln,
        lineComment,
    } = firstArg[0];

    const RawName: string = StrPart
        .replace(/^[ \t]*&[ \t]*/u, '')
        .trim();
    if ((/^[#$@\w\u{A1}-\u{FFFF}]+$/u).test(RawName)) {
        const UpName: string = ToUpCase(RawName);
        if (paramMap.has(UpName) || GValMap.has(UpName)) return;
        const character: number = _col + StrPart.indexOf(RawName);
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

function SetVar_by_DllCall(
    arr: TArr[],
    need: TGetFnDefNeed,
): void {
    const {
        fnMode,
        GValMap,
        paramMap,
        valMap,
    } = need;
    // E := DllCall(&_ImageSearch, "int*", x, "int*", y, Ptr, hScan, Ptr, nScan, "int", nWidth, "int", nHeight
    // , "int", hStride, "int", nStride, "int", sx1, "int", sy1, "int", sx2, "int", sy2, "int", Variation
    //         , "int", sd, "cdecl int")

    // DllCall("GdiPlus\GdipDrawCurve2", "UPtr", pGraphics, "UPtr", pPen, "UPtr", &PointsF, "UInt", iCount, "float", Tension)
    // DllCall("DllFile\Function"      , Type1,  Arg1,       Type2, Arg2, "Cdecl ReturnType")
    //                0                   1        2          3      4    5
    //                0                    1       2     ---> 2%2 = 0
    //                                     3       4     ----> 4%2 = 0
    //                                     5        6
    //                             7 ==ReturnType   (not 8)
    // not need first
    // not need end

    // not need 0
    /**
     * just need iArg
     *
     * ```ahk
     *  DllCall("DllFile\Function"      , Type1
     *                                  , Arg1   ; -----> OK
     *                                  , Type2
     *                                  , Arg2        ; not good ..... but i need some time to get it
     *                                      + 5       ; not good because this
     *                                  , Type3
     *                                  , Arg3 ; -----> OK
     *         , "ReturnType" )                   ; not need
     *
     * ```
     */
    const DllCallArr: TArr[] = [];

    for (let i = 1; i < arr.length; i += 1) {
        const iArg: TArr = arr[i]; // not need it
        // const NextIsReturnType: TArr | undefined = arr.at(i + 1);
        // if (NextIsReturnType === undefined) break; // iType is "ReturnType"

        const {
            StrPart,
            ln,
            col: _col,
            lineComment,
            comma,
        } = iArg;
        if (comma % 2 !== 0) continue;
        // note!
        // at DllCall(), arg cant be any number , but it while set it be a var-name
        const RawName: string = StrPart
            .replace(/^[ \t]*&[ \t]*/u, '')
            .trim();
        if ((/^[#$@\w\u{A1}-\u{FFFF}]+$/u).test(RawName) && !C507_varName_like_number(RawName)) {
            const UpName: string = ToUpCase(RawName);
            if (paramMap.has(UpName) || GValMap.has(UpName)) continue;
            const character: number = _col + StrPart.indexOf(RawName);
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
            DllCallArr.push(iArg);
        }
    }
}

function SetVar_by_RegExMatch(
    arr: TArr[],
    need: TGetFnDefNeed,
): void {
    // https://www.autohotkey.com/docs/v1/lib/RegExMatch.htm
    // RegExMatch(Haystack, NeedleRegEx , OutputVar, StartingPos)
    // RegExMatch(Options, pattern_opts "W([\-\d\.]+)(p*)", PWidth)

    const {
        fnMode,
        GValMap,
        paramMap,
        valMap,
    } = need;
    const firstArg: TArr[] = arr.filter((v) => v.comma === 2 && v.StrPart.trim() !== '');
    if (firstArg.length !== 1) return;
    const {
        StrPart,
        col: _col,
        ln,
        lineComment,
    } = firstArg[0];

    const RawName: string = StrPart
        .trim();
    if ((/^[#$@\w\u{A1}-\u{FFFF}]+$/u).test(RawName)) {
        const UpName: string = ToUpCase(RawName);
        if (paramMap.has(UpName) || GValMap.has(UpName)) return;
        const character: number = _col + StrPart.indexOf(RawName);
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

export function varSetCapacityFunc(need: TGetFnDefNeed): void {
    const leftFn: readonly TLineFnCall[] = fnRefLStr(need.AhkTokenLine);
    if (leftFn.length === 0) return;

    for (const fnRefData of leftFn) {
        const { upName, col } = fnRefData;
        const arr: TArr[] = [];
        const {
            AhkTokenLine,
            AhkTokenList,
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
            SetVar_by_NumGet(arr, need);
        } else if (upName === 'DllCall'.toUpperCase()) {
            SetVar_by_DllCall(arr, need);
        } else if (upName === 'RegExMatch'.toUpperCase()) {
            SetVar_by_RegExMatch(arr, need);
        }
    }
}
