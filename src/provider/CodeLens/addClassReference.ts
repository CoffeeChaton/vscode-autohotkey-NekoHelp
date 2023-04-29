import * as vscode from 'vscode';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import type { CmdFindClassRef } from '../../command/CmdFindClassRef';
import { ECommand } from '../../command/ECommand';
import { getFileAllClass } from '../../tools/visitor/getFileAllClassList';
import { searchAllClassRef } from '../Def/searchAllClassRef';
import { ECodeLensStr } from './ECodeLensStr';

export function addClassReference(need: vscode.CodeLens[], AST: TAstRoot): void {
    for (const ahkClass of getFileAllClass(AST)) {
        const refList: readonly vscode.Location[] = searchAllClassRef(ahkClass);
        const cmdClass: vscode.Command = {
            title: `Reference ${refList.length - 1}`,
            command: ECommand.CmdFindClassRef,
            tooltip: ECodeLensStr.tooltip,
            arguments: [
                ahkClass.uri,
                ahkClass.range.start,
                ahkClass,
                refList,
            ] satisfies Parameters<typeof CmdFindClassRef>,
        };
        need.push(new vscode.CodeLens(ahkClass.range, cmdClass));
    }
}
