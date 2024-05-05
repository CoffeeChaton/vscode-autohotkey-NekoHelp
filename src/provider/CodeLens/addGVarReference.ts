import * as vscode from 'vscode';
import type { CmdJustGotoLoc } from '../../command/CmdFindComObjConnectRegister';
import { ECommand } from '../../command/ECommand';
import { EGlobalDefBy } from '../../core/ParserTools/ahkGlobalDef';
import type { TAhkFileData } from '../../core/ProjectManager';
import { searchAllGlobalVarRef } from '../Def/searchAllVarRef';
import { ECodeLensStr } from './ECodeLensStr';

export type TGVarRefMeta = {
    rawName: string,
    uri: vscode.Uri,
    position: vscode.Position,
    refList: vscode.Location[],
    range: vscode.Range,
};

export function GVarRefCore(AhkFileData: TAhkFileData): readonly TGVarRefMeta[] {
    const { GValMap, uri, DocStrMap } = AhkFileData;

    const need: TGVarRefMeta[] = [];
    for (const [wordUp, { defRangeList }] of GValMap) {
        const { rawName, range, by } = defRangeList[0];
        if (by !== EGlobalDefBy.byGlobal) continue;
        const position: vscode.Position = range.start;

        const s0: string = DocStrMap[position.line].lStr.slice(position.character + wordUp.length).trimStart();
        if (!s0.startsWith(':=')) continue;

        const refList: vscode.Location[] = searchAllGlobalVarRef(wordUp);

        need.push({
            rawName,
            uri,
            position,
            refList,
            range,
        }); //
    }
    return need;
}

export function addGVarReference(need: vscode.CodeLens[], AhkFileData: TAhkFileData): void {
    const GVarRefMeta: readonly TGVarRefMeta[] = GVarRefCore(AhkFileData);

    for (const v of GVarRefMeta) {
        const {
            rawName,
            uri,
            position,
            refList,
            range,
        } = v;

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

        need.push(new vscode.CodeLens(range, cmd));
    }
}
