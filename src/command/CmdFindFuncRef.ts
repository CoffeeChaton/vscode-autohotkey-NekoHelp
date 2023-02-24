import * as vscode from 'vscode';
import type { CAhkFunc } from '../AhkSymbol/CAhkFunc';
import { RefLike2Location } from '../provider/Def/getFnRef';

// --------

export async function CmdFindFuncRef(uri: vscode.Uri, position: vscode.Position, funcSymbol: CAhkFunc): Promise<void> {
    const locList: vscode.Location[] = RefLike2Location(funcSymbol);
    if (locList.length === 2) {
        const loc0: vscode.Location = locList[0];
        const loc1: vscode.Location = locList[1];
        if (loc0.uri.fsPath === funcSymbol.uri.fsPath && loc0.range.start.line === funcSymbol.range.start.line) {
            locList.length = 0;
            locList.push(loc1);
        } else {
            locList.length = 0;
            locList.push(loc0);
        }
    }

    // https://code.visualstudio.com/api/references/commands
    await vscode.commands.executeCommand(
        'editor.action.goToLocations',
        uri,
        position,
        locList,
        'gotoAndPeek',
        'not-Reference',
    );
}

// 'executeReferenceProvider'
