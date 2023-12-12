/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */
import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import { C507_varName_like_number } from '../../../../provider/Diagnostic/DA/CDiagFnLib/C507_varName_like_number';
import { ToUpCase } from '../../../str/ToUpCase';
import type { TGetFnDefNeed } from '../TFnVarDef';
import type { TArgs, TFnRefEx } from './getFileFnUsing';

import { getValMeta } from './getValMeta';

function SetVar_by_NumGet(
    args: readonly TArgs[],
    need: TGetFnDefNeed,
): void {
    const {
        fnMode,
        GValMap,
        paramMap,
        valMap,
    } = need;
    const firstArg: TArgs[] = args.filter((v) => v.comma === 0);
    if (firstArg.length !== 1) return;
    const {
        StrPart,
        col: _col,
        ln,
        lineComment,
    } = firstArg[0];

    const RawName: string = StrPart
        .replace(/^[ \t]*&[ \t]*/u, '')
        .replace(/[ \t]*$/u, '');
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
    args: readonly TArgs[],
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
    const set = new Set<number>();
    const commaMap = new Map<number, TArgs>();

    /**
     * start with 1, not need first
     */
    for (let i = 1; i < args.length; i += 1) {
        const iArg: TArgs = args[i];
        const {
            col: _col,
            comma,
        } = iArg;
        if (comma % 2 !== 0) continue;

        if (set.has(comma)) {
            commaMap.delete(comma);
        } else {
            commaMap.set(comma, iArg);
            set.add(comma);
        }
    }

    for (const iArg of commaMap.values()) {
        const {
            StrPart,
            ln,
            col: _col,
            lineComment,
        } = iArg;
        // note!
        // at DllCall(), arg cant be any number , but it while set it be a var-name
        const RawName: string = StrPart.trim();
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
        }
    }
}

function SetVar_by_Base(
    args: readonly TArgs[],
    need: TGetFnDefNeed,
    /**
     * ```ahk
     * RegExMatch() is 2
     * RegExReplace() is 3
     * ```
     */
    comma: number,
): void {
    const {
        fnMode,
        GValMap,
        paramMap,
        valMap,
    } = need;
    const selectArg: TArgs[] = args.filter((v) => v.comma === comma);
    if (selectArg.length !== 1) return;
    const {
        StrPart,
        col: _col,
        ln,
        lineComment,
    } = selectArg[0];

    const RawName: string = StrPart.trim();

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

// ['LV_GetText', 'OutputVar', 0],
// ['RegExMatch', 'OutputVar', 2],
// ['RegExReplace', 'OutputVarCount', 3],
// ['StrReplace', 'OutputVarCount', 3],
// ['TV_GetText', 'OutputVar', 0],
const varSetCapacityFuncArr: readonly [string, number][] = [
    ['LV_GetText'.toUpperCase(), 0],
    // RegExMatch(Haystack, NeedleRegEx , OutputVar, StartingPos)
    //              0          1            2
    ['RegExMatch'.toUpperCase(), 2],

    // RegExReplace(Haystack, NeedleRegEx , Replacement, OutputVarCount, Limit, StartingPos)
    //                 0           1              2       3
    ['RegExReplace'.toUpperCase(), 3],

    // StrReplace(Haystack, Needle , ReplaceText, OutputVarCount, Limit)
    //            0           1          2           3
    ['StrReplace'.toUpperCase(), 3],

    ['TV_GetText'.toUpperCase(), 0],
];

export function varSetCapacityFunc(need: TGetFnDefNeed, selectLine: TFnRefEx): void {
    for (const { fnUpName, args } of selectLine.refList) {
        const paramPos = varSetCapacityFuncArr.find((v) => v[0] === fnUpName);

        if (paramPos !== undefined) {
            SetVar_by_Base(args, need, paramPos[1]);
        } else if (fnUpName === 'DllCall'.toUpperCase()) {
            SetVar_by_DllCall(args, need);
        } else if (
            fnUpName === 'VarSetCapacity'.toUpperCase()
            || fnUpName === 'NumGet'.toUpperCase()
        ) {
            SetVar_by_NumGet(args, need);
        }

        // TODO https://www.autohotkey.com/docs/v1/lib/RegExReplace.htm
    }
}
