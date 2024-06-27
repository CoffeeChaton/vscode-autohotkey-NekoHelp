import type * as vscode from 'vscode';
import { getConfig } from '../../../configUI';
import { ECommandOption } from '../../../configUI.data';
import type { TAhkTokenLine } from '../../../globalEnum';
import { EDetail } from '../../../globalEnum';
import { Control_Snip } from '../../../tools/Built-in/7_sub_command/Control/Control.tools';
import { ControlGet_snip } from '../../../tools/Built-in/7_sub_command/ControlGet/ControlGet.tools';
import { Gui_snip } from '../../../tools/Built-in/7_sub_command/Gui/Gui.tools';
import { GuiControl_snip } from '../../../tools/Built-in/7_sub_command/GuiControl/GuiControl.tools';
import { snippetMenu } from '../../../tools/Built-in/7_sub_command/Menu/Menu.tools';
import { SysGet_snip } from '../../../tools/Built-in/7_sub_command/SysGet/SysGet.tools';
import { WinGet_snip } from '../../../tools/Built-in/7_sub_command/WinGet/WinGet.tools';
import { WinSet_snip } from '../../../tools/Built-in/7_sub_command/WinSet/WinSet.tools';
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

export function getSnipSubCmd(subStr: string, AhkTokenLine: TAhkTokenLine): readonly vscode.CompletionItem[] {
    const { CommandOption, subCmdPlus } = getConfig().snippets;
    if (CommandOption === ECommandOption.notProvided) return [];

    const { fistWordUp, detail } = AhkTokenLine;

    switch (CommandOption) {
        case ECommandOption.All:
        case ECommandOption.Recommended:
        case ECommandOption.noSameFunc: {
            // did i check this?

            const subStr2: string = getSubStr2(subStr, fistWordUp, detail).toLowerCase();

            const list: vscode.CompletionItem[] = [];

            if (subCmdPlus.Gui && 'Gui'.toLowerCase().startsWith(subStr2)) list.push(...Gui_snip);
            if (subCmdPlus.GuiControl && 'GuiControl'.toLowerCase().startsWith(subStr2)) {
                list.push(...GuiControl_snip);
            }
            if (subCmdPlus.Menu && 'Menu'.toLowerCase().startsWith(subStr2)) list.push(...snippetMenu);
            if (subCmdPlus.SysGet && 'SysGet'.toLowerCase().startsWith(subStr2)) list.push(...SysGet_snip);
            if (subCmdPlus.WinSet === true && 'WinSet'.toLowerCase().startsWith(subStr2)) list.push(...WinSet_snip);
            if (subCmdPlus.WinGet === true && 'WinGet'.toLowerCase().startsWith(subStr2)) list.push(...WinGet_snip);
            if (subCmdPlus.Control === true && 'Control'.toLowerCase().startsWith(subStr2)) {
                list.push(...Control_Snip);
            }
            if (subCmdPlus.ControlGet === true && 'ControlGet'.toLowerCase().startsWith(subStr2)) {
                list.push(...ControlGet_snip);
            }

            // todo something
            return list;
        }
        default:
            enumLog(CommandOption, 'getSnippetGui');
            return [];
    }
}
