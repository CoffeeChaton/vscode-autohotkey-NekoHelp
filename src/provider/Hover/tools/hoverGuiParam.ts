import type * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import type { TGui2ndParamEx } from '../../../tools/Built-in/7_sub_command/GuiName/GuiName.tools';
import { getGuiParam } from '../../../tools/Built-in/7_sub_command/GuiName/GuiName.tools';

export function hoverGuiParam(AhkTokenLine: TAhkTokenLine, position: vscode.Position): vscode.MarkdownString | null {
    const param: TGui2ndParamEx | null = getGuiParam(AhkTokenLine);
    if (param === null) return null;

    const { GuiName, SubCmd } = param;
    if (SubCmd.range.contains(position)) return SubCmd.md;
    if (GuiName === null) return null;
    if (GuiName.range.contains(position)) return GuiName.md;
    return null;
}
