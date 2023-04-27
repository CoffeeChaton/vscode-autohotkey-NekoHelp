import type * as vscode from 'vscode';
import { getCommandOptions } from '../../../configUI';
import { ECommandOption } from '../../../configUI.data';
import type { TAhkTokenLine } from '../../../globalEnum';
import { EDetail } from '../../../globalEnum';
import { snippetGui } from '../../../tools/Built-in/7_sub_command/Gui/Gui.tools';
import { snippetGuiControl } from '../../../tools/Built-in/7_sub_command/GuiControl/GuiControl.tools';
import { snippetMenu } from '../../../tools/Built-in/7_sub_command/Menu/Menu.tools';
import { snippetSysGet } from '../../../tools/Built-in/7_sub_command/SysGet/SysGet.tools';
import { snippetWinGet } from '../../../tools/Built-in/7_sub_command/WinGet/WinGet.tools';
import { snippetWinSet } from '../../../tools/Built-in/7_sub_command/WinSet/WinSet.tools';
import { enumLog } from '../../../tools/enumErr';

function getSubStr2(subStr: string, fistWordUp: string, detail: readonly EDetail[]): string {
    if (fistWordUp === 'CASE') {
        return subStr.replace(/^case\s[^:]+:\s*/iu, '');
    }
    if (fistWordUp === 'DEFAULT') {
        return subStr.replace(/^DEFAULT\s*:\s*/iu, '');
    }
    if (detail.includes(EDetail.isHotKeyLine)) {
        return subStr.replace(/^[^:]+::\s*/u, '');
    }

    return subStr;
}

export function completionSubCommand(subStr: string, AhkTokenLine: TAhkTokenLine): readonly vscode.CompletionItem[] {
    const { CommandOption, subCmdPlus } = getCommandOptions();
    if (CommandOption === ECommandOption.notProvided) return [];

    const { fistWordUp, detail } = AhkTokenLine;
    if (detail.includes(EDetail.inComment)) return [];

    switch (CommandOption) {
        case ECommandOption.All:
        case ECommandOption.Recommended:
        case ECommandOption.noSameFunc: // did i check this?
        {
            const subStr2: string = getSubStr2(subStr, fistWordUp, detail).toLowerCase();

            const list: vscode.CompletionItem[] = [];

            if (subCmdPlus.Gui && 'Gui'.toLowerCase().startsWith(subStr2)) list.push(...snippetGui);
            if (subCmdPlus.GuiControl && 'GuiControl'.toLowerCase().startsWith(subStr2)) {
                list.push(...snippetGuiControl);
            }
            if (subCmdPlus.Menu && 'Menu'.toLowerCase().startsWith(subStr2)) list.push(...snippetMenu);
            if (subCmdPlus.SysGet && 'SysGet'.toLowerCase().startsWith(subStr2)) list.push(...snippetSysGet);
            if (subCmdPlus.WinSet === true && 'WinSet'.toLowerCase().startsWith(subStr2)) list.push(...snippetWinSet);
            if (subCmdPlus.WinGet === true && 'WinGet'.toLowerCase().startsWith(subStr2)) list.push(...snippetWinGet);

            // todo something
            return list;
        }
        default:
            enumLog(CommandOption, 'getSnippetGui');
            return [];
    }
}
