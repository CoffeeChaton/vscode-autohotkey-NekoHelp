/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,7,8,11,12,13,14] }] */
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
     * by (?CCallout) https://www.autohotkey.com/docs/v1/misc/RegExCallout.htm#callout-functions
     */
    Reg = 8,
    //
    SetTimer = 11,
    Hotkey = 12,
    Menu = 13,
    Gui = 14,
    //

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

export function fnRefLStr(AhkTokenLine: TAhkTokenLine): TLineFnCall[] {
    const { lStr, line } = AhkTokenLine;
    const arr: TLineFnCall[] = [];
    for (const ma of lStr.matchAll(/(?<![.`%#]|new\s)\b(\w+)\(/giu)) {
        // -------------------------------------------------^funcName(      of lStr
        const col: number | undefined = ma.index;
        if (col === undefined) continue;

        const upName: string = ma[1].toUpperCase();

        arr.push({
            upName,
            line,
            col,
            by: EFnRefBy.justCall,
        });
    }
    // don't search of
    // MsgBox,
    // (
    //   fnName()
    // )
    return arr;
}

export function fnRefTextRaw(AhkTokenLine: TAhkTokenLine): TLineFnCall[] {
    const { lStr, textRaw, line } = AhkTokenLine;
    const arr: TLineFnCall[] = [];
    for (const ma of textRaw.slice(0, lStr.length).matchAll(/(?<=")(\w+)"/giu)) {
        // ------------------------------------------------------------------------^funcName // of textRaw
        // RegisterCallback("funcName")
        // Func("funcName")
        //
        // text := "funcName"
        // Func(text)

        const col: number | undefined = ma.index;
        if (col === undefined) continue;

        const upName: string = ma[1].toUpperCase();

        arr.push({
            upName,
            line,
            col,
            by: EFnRefBy.wordWrap,
        });
    }
    // don't search of
    // MsgBox,
    // (
    //   "fnName"
    // )
    return arr;
}

export function fnRefTextRawReg(AhkTokenLine: TAhkTokenLine): TLineFnCall[] {
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
        for (const maa of ma[1].matchAll(/(?<=\(\?C)(\w+)\)/giu)) {
            const upName: string = maa[1].toUpperCase();
            arr.push({
                upName,
                line,
                col: '"'.length + col + (maa.index ?? 0),
                by: EFnRefBy.Reg,
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

export const fileFuncRef = new CMemo<TAhkFileData, ReadonlyMap<string, TFuncRef[]>>(
    (AhkFileData: TAhkFileData): Map<string, TFuncRef[]> => {
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
                    const upName: string = RawNameNew.toUpperCase();
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
                    const upName: string = RawNameNew.toUpperCase();
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
        const list: readonly TFnRefLike[] = (fileFuncRef.up(AhkFileData).get(upName) ?? [])
            .map(({ line, col, by }: TFuncRef): TFnRefLike => ({
                uri,
                line,
                col,
                by,
            }));

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
