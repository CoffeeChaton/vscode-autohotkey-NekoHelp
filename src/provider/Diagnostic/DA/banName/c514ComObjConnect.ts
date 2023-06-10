import * as vscode from 'vscode';
import type { TAhkFileData } from '../../../../core/ProjectManager';
import type { TFullFuncMap } from '../../../../tools/Func/getAllFunc';
import { getAllFunc } from '../../../../tools/Func/getAllFunc';
import type { TLineFnCall } from '../../../Def/getFnRef';
import { fixComObjConnect } from '../../../Def/getFnRef';
import type { CDiagFn } from '../../tools/CDiagFn';
import { C514Class } from '../CDiagFnLib/C514Class';

export function c514ComObjConnect(
    AhkFileData: TAhkFileData,
    displayFnErrList: readonly boolean[],
): readonly CDiagFn[] {
    const arr: readonly TLineFnCall[] = fixComObjConnect.up(AhkFileData);
    if (arr.length === 0) return [];

    const { fsPath } = AhkFileData.uri;
    const fullFuncMap: TFullFuncMap = getAllFunc();

    const diag514List: C514Class[] = [];

    for (const { upName, col, line } of arr) {
        if (displayFnErrList[line]) {
            for (const [k, ahkFn] of fullFuncMap) {
                if (k.startsWith(upName) && ahkFn.uri.fsPath !== fsPath) {
                    const range: vscode.Range = new vscode.Range(
                        new vscode.Position(line, col),
                        new vscode.Position(line, col + upName.length),
                    );

                    diag514List.push(new C514Class(range, ahkFn, upName.toLowerCase()));
                }
            }
        }
    }

    return diag514List;
}
