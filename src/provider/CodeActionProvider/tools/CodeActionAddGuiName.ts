import * as vscode from 'vscode';
import type { CmdCodeActionAddGuiName } from '../../../command/CmdCodeActionAddGuiName';
import { ECommand } from '../../../command/ECommand';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import type { TGui2ndParamEx } from '../../../tools/Built-in/7_sub_command/GuiName/GuiName.tools';
import { getGuiParam } from '../../../tools/Built-in/7_sub_command/GuiName/GuiName.tools';

export function CodeActionAddGuiName(
    active: vscode.Position,
    AhkTokenLine: TAhkTokenLine,
    AhkFileData: TAhkFileData,
): [vscode.CodeAction] | never[] {
    const g: TGui2ndParamEx | null = getGuiParam(AhkTokenLine);
    if (g === null || g.GuiName !== null) return [];
    const { range } = g.SubCmd;
    if (!range.contains(active)) return [];

    const CA = new vscode.CodeAction('Select and add guiName');
    CA.command = {
        title: 'Select and add guiName',
        command: ECommand.CmdCodeActionAddGuiName,
        tooltip: 'by neko-help',
        arguments: [
            AhkFileData.uri,
            range.start,
        ] satisfies Parameters<typeof CmdCodeActionAddGuiName>,
    };
    //
    return [CA];
}
