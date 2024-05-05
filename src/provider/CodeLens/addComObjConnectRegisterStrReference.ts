import * as vscode from 'vscode';
import type { CmdJustGotoLoc } from '../../command/CmdFindComObjConnectRegister';
import { ECommand } from '../../command/ECommand';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TLineFnCall } from '../../globalEnum';
import type { TFullFuncMap } from '../../tools/Func/getAllFunc';
import { getAllFunc } from '../../tools/Func/getAllFunc';
import { fixComObjConnect } from '../Def/getFnRef';
import { ECodeLensStr } from './ECodeLensStr';

export function addComObjConnectRegisterStrReference(need: vscode.CodeLens[], AhkFileData: TAhkFileData): void {
    const arr: readonly TLineFnCall[] = fixComObjConnect.up(AhkFileData);
    if (arr.length === 0) return;

    const { uri, DocStrMap } = AhkFileData;
    const fullFuncMap: TFullFuncMap = getAllFunc();

    for (const { upName, col, line } of arr) {
        const refList: vscode.Location[] = [];

        for (const [k, v] of fullFuncMap) {
            if (k.startsWith(upName)) {
                refList.push(new vscode.Location(v.uri, v.selectionRange));
            }
        }

        const rawName: string = DocStrMap[line].textRaw.slice(col, col + upName.length);
        const position: vscode.Position = new vscode.Position(line, col);

        const cmd: vscode.Command = {
            title: `"${rawName}".Reference ${refList.length}`,
            command: ECommand.CmdJustGotoLoc,
            tooltip: ECodeLensStr.tooltip,
            arguments: [
                uri,
                position,
                refList,
            ] satisfies Parameters<typeof CmdJustGotoLoc>,
        };

        need.push(
            new vscode.CodeLens(
                new vscode.Range(
                    position,
                    new vscode.Position(line, col + upName.length),
                ),
                cmd,
            ),
        ); //
    }
}
