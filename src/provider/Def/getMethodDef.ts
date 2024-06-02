import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { getConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { getMethodRef2Def } from '../../tools/Method/Method';

function method2Location(methodList: readonly CAhkFunc[]): vscode.Location[] {
    return methodList.map(
        (method: CAhkFunc): vscode.Location => new vscode.Location(method.uri, method.selectionRange),
    );
}

export function getMethodDef(
    document: vscode.TextDocument,
    position: vscode.Position,
    AhkFileData: TAhkFileData,
): vscode.Location[] | null {
    const methodList: readonly CAhkFunc[] | null = getMethodRef2Def(
        document,
        position,
        AhkFileData,
        getConfig().method.gotoDef,
    );

    return methodList === null || methodList.length === 0
        ? null
        : method2Location(methodList);
}
