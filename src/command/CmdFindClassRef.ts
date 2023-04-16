import * as vscode from 'vscode';
import type { CAhkClass } from '../AhkSymbol/CAhkClass';

// --------

export async function CmdFindClassRef(
    uri: vscode.Uri,
    position: vscode.Position,
    ahkClass: CAhkClass,
    refList: readonly vscode.Location[],
): Promise<void> {
    const locList: vscode.Location[] = [...refList];
    if (locList.length === 2) {
        const loc0: vscode.Location = locList[0];
        const loc1: vscode.Location = locList[1];
        if (loc0.uri.fsPath === ahkClass.uri.fsPath && loc0.range.start.line === ahkClass.range.start.line) {
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
