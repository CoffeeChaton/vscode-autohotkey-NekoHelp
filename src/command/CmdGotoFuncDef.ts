import * as vscode from 'vscode';
import type { CAhkFunc } from '../AhkSymbol/CAhkFunc';

// --------

export async function CmdGotoFuncDef(uri: vscode.Uri, position: vscode.Position, funcSymbol: CAhkFunc): Promise<void> {
    // https://code.visualstudio.com/api/references/commands
    await vscode.commands.executeCommand(
        'editor.action.goToLocations',
        uri,
        position,
        [new vscode.Location(funcSymbol.uri, funcSymbol.selectionRange)],
        'gotoAndPeek',
        'not-Def',
    );
}

// 'executeReferenceProvider'
