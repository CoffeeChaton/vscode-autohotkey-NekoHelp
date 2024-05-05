import * as vscode from 'vscode';
import type { CmdJustGotoLoc } from '../../command/CmdFindComObjConnectRegister';
import { ECommand } from '../../command/ECommand';
import type { TAhkFileData } from '../../core/ProjectManager';
import { searchAllGlobalVarRef } from '../Def/searchAllVarRef';

import { EGlobalDefBy } from '../../core/ParserTools/ahkGlobalDef';
import { ECodeLensStr } from './ECodeLensStr';

export function addGVarReference(need: vscode.CodeLens[], AhkFileData: TAhkFileData): void {
    const { GValMap, uri, DocStrMap } = AhkFileData;

    for (const [wordUp, { defRangeList }] of GValMap) {
        const { rawName, range, by } = defRangeList[0];
        if (by !== EGlobalDefBy.byGlobal) continue;
        const position: vscode.Position = range.start;

        const s0: string = DocStrMap[position.line].lStr.slice(position.character + wordUp.length).trimStart();
        if (!s0.startsWith(':=')) continue;

        const refList: vscode.Location[] = searchAllGlobalVarRef(wordUp);
        const cmd: vscode.Command = {
            title: `"${rawName}" Ref ${refList.length}`,
            command: ECommand.CmdJustGotoLoc,
            tooltip: ECodeLensStr.tooltip,
            arguments: [
                uri,
                position,
                refList,
            ] satisfies Parameters<typeof CmdJustGotoLoc>,
        };

        need.push(new vscode.CodeLens(range, cmd)); //
    }
    //
}
