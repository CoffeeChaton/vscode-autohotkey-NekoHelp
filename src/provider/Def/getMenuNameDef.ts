import * as vscode from 'vscode';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import type { TMenuParam1stData } from '../../tools/Built-in/7_sub_command/Menu/MenuName';
import { getMenuParam_Line, memoFileMenuRefMap } from '../../tools/Built-in/7_sub_command/Menu/MenuName';
import { ToUpCase } from '../../tools/str/ToUpCase';

export function getMenuNameDef(
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
            const { range, nextSubCmd } = v;
            if (nextSubCmd !== 'ADD') continue;
            const item = new vscode.Location(uri, range);
            need.push(item);
            break;
        }
    }

    return need.length === 0
        ? null
        : need;
}
