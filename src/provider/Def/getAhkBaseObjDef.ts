import type * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { ahkBaseGetDef } from '../../tools/Built-in/8_built_in_method_property/Obj.tools';
import type { TAhkObjData } from '../Hover/tools/hoverAhkObj';
import { posGetAhkObjData } from '../Hover/tools/hoverAhkObj';

export function getAhkBaseObjDef(
    document: vscode.TextDocument,
    AhkFileData: TAhkFileData,
    position_raw: vscode.Position,
): vscode.LocationLink[] | null {
    const data: TAhkObjData | null = posGetAhkObjData(document, AhkFileData, position_raw);
    if (data === null) return null;

    const locList: vscode.Location[] = ahkBaseGetDef(data.obj, data.wordLast);
    if (locList.length === 0) return null;

    const need: vscode.LocationLink[] = [];
    for (const loc of locList) {
        need.push({
            originSelectionRange: data.range,
            targetUri: loc.uri,
            targetRange: loc.range,
        });
    }

    return need;
}
