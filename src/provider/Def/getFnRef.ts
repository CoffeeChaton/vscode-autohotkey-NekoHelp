/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,7,8,9,10,11,12,13,14,991] }] */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { CMemo } from '../../tools/CMemo';
import { getGuiFunc } from '../../tools/Command/GuiTools';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getMenuFunc } from '../../tools/Command/MenuTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import { getSortFunc } from '../../tools/Command/sotrTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import { findLabel } from '../../tools/labels';
import { ToUpCase } from '../../tools/str/ToUpCase';

export const enum EFnRefBy {
    /**
     * by funcName(
     */
    justCall = 1,

    /**
     * by "funcName"
     */
    wordWrap = 2,

    /**
     * Sort f-flag
     */
    SortFlag = 7,

    /**
     * by -> (?CCallout)\
     * or -> (?CNumber)\
     * <https://www.autohotkey.com/docs/v1/misc/RegExCallout.htm#callout-functions>
     */
    Reg1 = 8,

    /**
     * by (?C:Function)\
     * <https://www.autohotkey.com/board/topic/36196-regex-callouts/page-2>
     */
    Reg2 = 9,

    /**
     * by (?CNumber:Function)\
     * <https://www.autohotkey.com/docs/v1/misc/RegExCallout.htm#auto>
     */
    Reg3 = 10,

    //
    SetTimer = 11,
    Hotkey = 12,
    Menu = 13,
    Gui = 14,
    //

    ComObjConnect = 991,
    /**
     * Do not use compare
     * need ts5.0
     * https://github.com/microsoft/TypeScript/issues/52701
     */
    // eslint-disable-next-line @typescript-eslint/no-mixed-enums
    banCompare = 'Do not use compare',
}
export function mayBeIsLabel(by: EFnRefBy): boolean {
    return [EFnRefBy.SetTimer, EFnRefBy.Hotkey, EFnRefBy.Hotkey, EFnRefBy.Gui].includes(by);
}

export type TLineFnCall = {
    upName: string,
    line: number,
    col: number,
    by: EFnRefBy,
};

export type TFuncRef = Omit<TLineFnCall, 'upName'>;

export function fnRefLStr(AhkTokenLine: TAhkTokenLine): readonly TLineFnCall[] {
    const { lStr, line } = AhkTokenLine;
    const arr: TLineFnCall[] = [];

    for (const ma of lStr.matchAll(/(?<=[!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)([#$@\w\u{A1}-\u{FFFF}]+)\(/giu)) {
        // -----------------------------------^ without .`% and #$@                         ^funcName(      of lStr
        const col: number | undefined = ma.index;
        if (col === undefined) continue;

        if ((/(?<=[.%!"/&'()*+,\-:;<=>?\u{5B}-\u{60}\u{7B}-\u{7E} \t]|^)new$/iu).test(lStr.slice(0, col).trimEnd())) {
            // ^ all case mock \b
            continue;
        }

        const upName: string = ToUpCase(ma[1]);

        arr.push({
            by: EFnRefBy.justCall,
            col,
            line,
            upName,
        });
    }
    // don't search of
    // MsgBox,
    // (
    //   fnName()
    // )
    return arr;
}

export function fnRefTextRaw(AhkTokenLine: TAhkTokenLine): readonly TLineFnCall[] {
    const { lStr, textRaw, line } = AhkTokenLine;
    const arr: TLineFnCall[] = [];

    for (const ma of textRaw.slice(0, lStr.length).matchAll(/(?<=")([#$@\w\u{A1}-\u{FFFF}]+)"/giu)) {
        // ------------------------------------------------------------------------^funcName // of textRaw
        // RegisterCallback("funcName")
        // Func("funcName")
        //
        // text := "funcName"
        // Func(text)

        const col: number | undefined = ma.index;
        if (col === undefined) continue;

        const upName: string = ToUpCase(ma[1]);

        arr.push({
            by: EFnRefBy.wordWrap,
            col,
            line,
            upName,
        });
    }
    // don't search of
    // MsgBox,
    // (
    //   "fnName"
    // )
    return arr;
}

/**
 *  (?CNumber:Function)
 *     Number   -> part1 -> https://www.regular-expressions.info/pcre.html (?C1) to (?C255) call pcre_callout
 *     :        -> part2
 *     Function -> part3
 */
type TRegCallFn = {
    // part1_text: string,
    // part1_offset: number,

    // part2_offset: number,

    part3_text: string,
    part3_offset: number,
    by: EFnRefBy.Reg1 | EFnRefBy.Reg2 | EFnRefBy.Reg3,
};

function fnRegCallFn(maa1: string): TRegCallFn | null {
    // Reg1 -> (?CCallout)
    //      -> (?CNumber)

    if ((/^[#$@\w\u{A1}-\u{FFFF}]+$/u).test(maa1)) {
        return {
            part3_text: maa1,
            part3_offset: 0,
            by: EFnRefBy.Reg1,
        };
    }

    // Reg2 -> (?C:Function)

    if ((/^:[#$@\w\u{A1}-\u{FFFF}]+$/u).test(maa1)) {
        return {
            part3_text: maa1.replace(/^:/u, ''),
            part3_offset: 1, // ':'.length
            by: EFnRefBy.Reg2,
        };
    }

    // Reg3 -> (?CNumber:Function)

    if ((/^\d+:[#$@\w\u{A1}-\u{FFFF}]+$/u).test(maa1)) {
        return {
            part3_text: maa1.replace(/^\d+:/u, ''),
            part3_offset: maa1.indexOf(':') + 1,
            by: EFnRefBy.Reg3,
        };
    }
    return null;
}

export function fnRefTextRawReg(AhkTokenLine: TAhkTokenLine): readonly TLineFnCall[] {
    // `RegEx` CallOut Functions<https://www.autohotkey.com/docs/v1/misc/RegExCallout.htm#callout-functions>
    const { lStr, textRaw, line } = AhkTokenLine;
    const arr: TLineFnCall[] = [];
    for (const ma of textRaw.slice(0, lStr.length).matchAll(/"([^"]*)"/gu)) {
        // -----------------------------------------------------------match all "string"
        if (!ma[1].includes('(?')) continue;
        const col: number | undefined = ma.index;
        if (col === undefined) continue;
        // RegExMatch(Haystack, "i)(The) (\w+)\b(?CCallout)")
        //                                      ^^^^^^^^^^^
        //                      "               (?CFuncName)
        //                      ^ not close     (?C        )
        //                                      ^^^        ^

        for (const maa of ma[1].matchAll(/(?<=\(\?C)([:#$@\w\u{A1}-\u{FFFF}]+)\)/giu)) {
            //                                               ^ : and var-name
            // (?CNumber)
            // (?C:Function)
            // (?CNumber:Function)

            const RegCallFn: TRegCallFn | null = fnRegCallFn(maa[1]);
            if (RegCallFn === null) continue;

            const { part3_text, part3_offset, by } = RegCallFn;
            const upName: string = ToUpCase(part3_text);

            arr.push({
                upName,
                line,
                col: '"'.length + col + (maa.index ?? 0) + part3_offset,
                by,
            });
        }
    }
    return arr;
}

type TFnRefWithCmd = Readonly<{
    fn: (AhkTokenLine: TAhkTokenLine) => TScanData | null,
    by: EFnRefBy,
}>;
const CmdRefFuncList = [
    { fn: getSetTimerWrap, by: EFnRefBy.SetTimer },
    { fn: getHotkeyWrap, by: EFnRefBy.Hotkey },
    { fn: getMenuFunc, by: EFnRefBy.Menu },
    { fn: getSortFunc, by: EFnRefBy.SortFlag },
] as const satisfies readonly TFnRefWithCmd[];

export const fileFuncRef = new CMemo<TAhkFileData, ReadonlyMap<string, readonly TFuncRef[]>>(
    (AhkFileData: TAhkFileData): ReadonlyMap<string, readonly TFuncRef[]> => {
        const { DocStrMap, AST } = AhkFileData;
        const filterLineList: number[] = getDAListTop(AST)
            .filter((DA: CAhkFunc): boolean => DA.kind === vscode.SymbolKind.Method)
            .map((DA: CAhkFunc): number => DA.nameRange.start.line);

        const map = new Map<string, TFuncRef[]>();
        for (const AhkTokenLine of DocStrMap) {
            const { line, lStr } = AhkTokenLine;
            if (lStr.length === 0) continue;
            if (filterLineList.includes(line)) continue;

            for (
                const { upName, col, by } of [
                    ...fnRefLStr(AhkTokenLine),
                    ...fnRefTextRaw(AhkTokenLine),
                    ...fnRefTextRawReg(AhkTokenLine),
                ].sort((a: TLineFnCall, b: TLineFnCall): number => a.col - b.col)
            ) {
                const arr: TFuncRef[] = map.get(upName) ?? [];
                arr.push({
                    line,
                    col,
                    by,
                });
                map.set(upName, arr);
            }

            for (const { fn, by } of CmdRefFuncList) {
                const Data: TScanData | null = fn(AhkTokenLine);
                if (Data !== null) {
                    const { RawNameNew, lPos } = Data;
                    const upName: string = ToUpCase(RawNameNew);
                    const arr: TFuncRef[] = map.get(upName) ?? [];

                    arr.push({
                        line,
                        col: lPos,
                        by,
                    });
                    map.set(upName, arr);
                    break; // <-- only exists in one of the [getHotkeyWrap, getSetTimerWrap]
                }
            }
            const guiFnList: readonly TScanData[] | null = getGuiFunc(AhkTokenLine, 0);
            if (guiFnList !== null) {
                for (const { RawNameNew, lPos } of guiFnList) {
                    const upName: string = ToUpCase(RawNameNew);
                    const arr: TFuncRef[] = map.get(upName) ?? [];
                    arr.push({
                        line,
                        col: lPos,
                        by: EFnRefBy.Gui,
                    });
                    map.set(upName, arr);
                }
            }
        }

        return map;
    },
);

export type TFnRefLike = {
    uri: vscode.Uri,
    line: number,
    col: number,
    by: EFnRefBy,
};

export const fixComObjConnect = new CMemo<TAhkFileData, readonly TLineFnCall[]>(
    (AhkFileData: TAhkFileData): readonly TLineFnCall[] => {
        const oldList: readonly TFuncRef[] | undefined = fileFuncRef.up(AhkFileData).get('ComObjConnect'.toUpperCase());
        if (oldList === undefined) return [];

        //
        const arr: TLineFnCall[] = [];
        for (const { line, col } of oldList) {
            // ComObjConnect(ie, "IE_")
            //                    ^^^
            const ahkTokenLine: TAhkTokenLine = AhkFileData.DocStrMap[line];
            const { textRaw } = ahkTokenLine;
            const t2: string = textRaw.slice(col).padStart(textRaw.length);
            const ma: RegExpMatchArray | null = t2.match(/ComObjConnect\([^,]+,\s*"(\w+)"\s*\)/iu);
            if (ma === null) continue;
            const ma0: string = ma[0];
            const ma1: string = ma[1];
            const colFix: number = (ma.index ?? 0) + ma0
                .replace(/ComObjConnect\([^,]+,\s*"/iu, '')
                .padStart(ma0.length)
                .indexOf(ma1);

            arr.push({
                by: EFnRefBy.ComObjConnect,
                col: colFix,
                line,
                upName: ToUpCase(ma1),
            });
        }
        return arr;
    },
);

function visitComObjConnect(AhkFileData: TAhkFileData, funcSymbol: CAhkFunc): TFnRefLike[] {
    const arr: readonly TLineFnCall[] = fixComObjConnect.up(AhkFileData);
    if (arr.length === 0) return [];
    //
    const up: string = funcSymbol.upName;
    const { uri } = AhkFileData;
    const arr2: TFnRefLike[] = [];
    for (
        const {
            by,
            col,
            line,
            upName,
        } of arr
    ) {
        if (up.startsWith(upName)) {
            arr2.push({
                by,
                col,
                line,
                uri,
            });
        }
    }
    return arr2;
}

type TMap = Map<string, readonly TFnRefLike[]>;
const wm = new WeakMap<TAhkFileData, TMap>();

export function getFuncRef(funcSymbol: CAhkFunc): readonly TFnRefLike[] {
    const { upName } = funcSymbol;

    const allList: TFnRefLike[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const fileMap: TMap = wm.get(AhkFileData) ?? new Map<string, readonly TFnRefLike[]>();

        const oldList: readonly TFnRefLike[] | undefined = fileMap.get(upName);
        if (oldList !== undefined) {
            allList.push(...oldList);
            continue;
        }

        // set fileMap
        const { uri } = AhkFileData;
        const list: TFnRefLike[] = (fileFuncRef.up(AhkFileData).get(upName) ?? [])
            .map(({ line, col, by }: TFuncRef): TFnRefLike => ({
                by,
                col,
                line,
                uri,
            }));
        list.push(...visitComObjConnect(AhkFileData, funcSymbol)); // ...

        allList.push(...list);

        fileMap.set(upName, list);
        wm.set(AhkFileData, fileMap);
    }
    // log.info(`find Ref of ${funcSymbol.name}() , use ${Date.now() - timeStart} ms`);

    const hasSameLabel: boolean = findLabel(upName) !== null;

    const allowList: TFnRefLike[] = [];
    for (const re of allList) {
        /**
         * Check is Label
         */
        if (hasSameLabel && mayBeIsLabel(re.by)) {
            continue;
        }
        allowList.push(re);
    }
    return allowList;
}

export function RefLike2Location(funcSymbol: CAhkFunc): vscode.Location[] {
    const refLikeList: readonly TFnRefLike[] = getFuncRef(funcSymbol);

    const { upName } = funcSymbol;

    const wordUpLen: number = upName.length;
    const arr1: vscode.Location[] = [];
    for (const re of refLikeList) {
        const { uri, line, col } = re;
        arr1.push(
            new vscode.Location(
                uri,
                new vscode.Range(
                    new vscode.Position(line, col),
                    new vscode.Position(line, col + wordUpLen),
                ),
            ),
        );
    }
    return arr1;
}
