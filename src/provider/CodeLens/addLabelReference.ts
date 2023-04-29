import * as vscode from 'vscode';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import type { CmdFindLabelRef } from '../../command/CmdFindLabelRef';
import { ECommand } from '../../command/ECommand';
import { getFileAllTopLabelList } from '../../tools/visitor/getFileAllTopLabelList';
import { getLabelRef } from '../Def/getDefWithLabel';
import { ECodeLensStr } from './ECodeLensStr';

export function addLabelReference(need: vscode.CodeLens[], AST: TAstRoot): void {
    for (const ahkLabel of getFileAllTopLabelList.up(AST)) {
        const refList: readonly vscode.Location[] = getLabelRef(ahkLabel.upName);
        const cmdClass: vscode.Command = {
            title: `Reference ${refList.length - 1}`,
            command: ECommand.CmdFindLabelRef,
            tooltip: ECodeLensStr.tooltip,
            arguments: [
                ahkLabel,
                refList,
            ] satisfies Parameters<typeof CmdFindLabelRef>,
        };
        need.push(new vscode.CodeLens(ahkLabel.range, cmdClass));
    }
}
