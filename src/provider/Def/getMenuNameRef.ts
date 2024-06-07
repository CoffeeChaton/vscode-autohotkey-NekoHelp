import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import type { TGui2ndParamEx } from '../../tools/Built-in/7_sub_command/GuiName/GuiName.tools';
import { getGuiParam } from '../../tools/Built-in/7_sub_command/GuiName/GuiName.tools';
import type { TMenuParam1stData } from '../../tools/Built-in/7_sub_command/Menu/MenuName';
import { getMenuParam_Line, memoFileMenuRefMap } from '../../tools/Built-in/7_sub_command/Menu/MenuName';
import { CMemo } from '../../tools/CMemo';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { ToUpCase } from '../../tools/str/ToUpCase';

type TGuiMenuRefData = {
    readonly RawNameNew: string,
    readonly range: vscode.Range,
};

/**
 * ```ahk
 * Gui, Menu, MyMenuBar
 * ;          ^^^^^^^^ find it
 * ```
 */
const memGuiMenuRef = new CMemo<TAhkFileData, ReadonlyMap<string, readonly TGuiMenuRefData[]>>(
    (AhkFileData: TAhkFileData): ReadonlyMap<string, readonly TGuiMenuRefData[]> => {
        const { DocStrMap } = AhkFileData;
        const guiFull: TGui2ndParamEx[] = [];

        for (const AhkTokenLine of DocStrMap) {
            const g: TGui2ndParamEx | null = getGuiParam(AhkTokenLine);
            if (g !== null) {
                guiFull.push(g);
            }
        }

        const need: TGuiMenuRefData[] = [];
        for (const Gui2ndParamEx of guiFull) {
            const { range, wordUp } = Gui2ndParamEx.SubCmd;
            if (wordUp !== 'MENU') continue;
            const AhkTokenLine: TAhkTokenLine = DocStrMap[range.start.line];
            const { lStr, line } = AhkTokenLine;
            // https://www.autohotkey.com/docs/v1/lib/Gui.htm#Menu
            // Gui, Menu, MyMenuBar        lStr
            //          , MyMenuBar        p2
            //      ^a0    ^a1             arr
            const p2 = lStr.slice(range.end.character).padStart(lStr.length);

            const arr: TScanData[] = spiltCommandAll(p2);
            const a1: TScanData | undefined = arr.at(1);
            if (a1 !== undefined) {
                const { RawNameNew, lPos } = a1;
                need.push({
                    RawNameNew,
                    range: new vscode.Range(
                        new vscode.Position(line, lPos),
                        new vscode.Position(line, lPos + RawNameNew.length),
                    ),
                });
            }
        }
        return Map.groupBy(need, (item: TGuiMenuRefData): string => ToUpCase(item.RawNameNew));
    },
);

export function getMenuNameRef(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): null | vscode.Location[] {
    const m: TMenuParam1stData | null = getMenuParam_Line(AhkTokenLine);
    if (!(m !== null && m.range.contains(position))) return null;

    const rawStrUp: string = ToUpCase(m.rawName);
    const need: vscode.Location[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const { uri } = AhkFileData;
        const vv: readonly TMenuParam1stData[] | undefined = memoFileMenuRefMap.up(AhkFileData).get(rawStrUp);
        if (vv === undefined) continue;
        for (const v of vv) {
            const { range } = v;
            const item = new vscode.Location(uri, range);
            need.push(item);
        }

        const refList: readonly TGuiMenuRefData[] = memGuiMenuRef.up(AhkFileData).get(rawStrUp) ?? [];
        for (const ref of refList) {
            need.push(new vscode.Location(uri, ref.range));
        }
    }

    return need.length === 0
        ? null
        : need;
}
