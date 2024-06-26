import type * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../globalEnum';
import { getGuiFunc } from '../../tools/Command/GuiTools';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getMenuFunc } from '../../tools/Command/MenuTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import { getSortFunc } from '../../tools/Command/sortTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { fnRefLStr } from './fnRefLStr';
import { fnRefTextRaw, fnRefTextRawReg } from './getFnRef';

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
    for (
        const ma of AhkTokenLine.textRaw.matchAll(
            /(?<=[!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)([#$@\w\u{A1}-\u{FFFF}]+)\(/giu,
            // // without .`% and #$@
        )
    ) {
        const col: number = ma.index;

        if (
            (/(?<=[.%!"/&'()*+,\-:;<=>?\u{5B}-\u{60}\u{7B}-\u{7E} \t]|^)new$/iu).test(
                // ^ all case , mock \b ..
                AhkTokenLine.textRaw.slice(0, col).trimEnd(),
            )
        ) {
            continue;
        }

        const upName: string = ToUpCase(ma[1]);
        if (upName === wordUpFix && (character >= col || character <= col + len)) return true;
    }
    // expansion--end

    return false;
}
