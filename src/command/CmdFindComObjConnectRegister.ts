import * as vscode from 'vscode';

// --------

export async function CmdFindComObjConnectRegister(
    uri: vscode.Uri,
    position: vscode.Position,
    locations: vscode.Location[],
): Promise<void> {
    // https://code.visualstudio.com/api/references/commands
    await vscode.commands.executeCommand(
        'editor.action.goToLocations',
        uri,
        position,
        locations,
        'gotoAndPeek',
        'not-Reference',
    );
}
