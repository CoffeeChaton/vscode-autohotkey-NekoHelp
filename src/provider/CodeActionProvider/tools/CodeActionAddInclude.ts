import * as vscode from 'vscode';
import type { CmdCodeActionAddInclude } from '../../../command/CmdCodeActionAddInclude';
import { ECommand } from '../../../command/ECommand';

export function CodeActionAddInclude(uri: vscode.Uri, position: vscode.Position): vscode.CodeAction {
    const CA = new vscode.CodeAction('Select and complete file name');
    CA.command = {
        title: 'Select and complete file name',
        command: ECommand.CmdCodeActionAddInclude,
        tooltip: 'by neko-help',
        arguments: [
            uri,
            position,
        ] satisfies Parameters<typeof CmdCodeActionAddInclude>,
    };
    //
    return CA;
}
