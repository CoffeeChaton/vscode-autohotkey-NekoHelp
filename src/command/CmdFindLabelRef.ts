import * as vscode from 'vscode';
import type { CAhkLabel } from '../AhkSymbol/CAhkLine';

// --------

export async function CmdFindLabelRef(
    ahkLabel: CAhkLabel,
    refList: readonly vscode.Location[],
): Promise<void> {
    const locList: vscode.Location[] = [...refList];
    if (locList.length === 2) {
        const loc0: vscode.Location = locList[0];
        const loc1: vscode.Location = locList[1];
        if (loc0.uri.fsPath === ahkLabel.uri.fsPath && loc0.range.start.line === ahkLabel.range.start.line) {
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
        ahkLabel.uri,
        ahkLabel.range.start,
        locList,
        'gotoAndPeek',
        'not-Reference',
    );
}

// 'executeReferenceProvider'
