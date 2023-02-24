import type * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../globalEnum';
import { getGuiFunc } from '../../tools/Command/GuiTools';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getMenuFunc } from '../../tools/Command/MenuTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import { getSortFunc } from '../../tools/Command/sotrTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { fnRefLStr, fnRefTextRaw, fnRefTextRawReg } from './getFnRef';

/**
* ```ahk
* c := c();
* ;No   Yes check pos at like func()

* c := c();
* ;    ^
* "c" c c() "c" c c "c("
* ;^    ^    ^
*
* c(){
* ;^
* }
* ```
*/
export function posAtFnRef(
    {
        AhkTokenLine,
        position,
        wordUpFix,
    }: {
        AhkTokenLine: TAhkTokenLine,
        position: vscode.Position,
        wordUpFix: string,
    },
): boolean {
    const { character } = position;
    const len: number = wordUpFix.length;
    for (
        const { upName, col } of [
            ...fnRefLStr(AhkTokenLine),
            ...fnRefTextRaw(AhkTokenLine),
            ...fnRefTextRawReg(AhkTokenLine),
        ]
    ) {
        if (upName === wordUpFix && (character >= col || character <= col + len)) return true;
    }

    const Data: TScanData | null = getSetTimerWrap(AhkTokenLine)
        ?? getHotkeyWrap(AhkTokenLine)
        ?? getMenuFunc(AhkTokenLine)
        ?? getSortFunc(AhkTokenLine);
    if (Data !== null) return true;

    const GuiData: readonly TScanData[] | null = getGuiFunc(AhkTokenLine, 0);
    if (GuiData !== null && GuiData.length > 0) return true;

    // not ref... but allow goto-def
    // expansion--start
    for (const ma of AhkTokenLine.textRaw.matchAll(/(?<![.`%#]|new\s)\b(\w+)\(/giu)) {
        const col: number | undefined = ma.index;
        if (col === undefined) continue;

        const upName: string = ma[1].toUpperCase();
        if (upName === wordUpFix && (character >= col || character <= col + len)) return true;
    }
    // expansion--end

    return false;
}
