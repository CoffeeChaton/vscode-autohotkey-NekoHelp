import type * as vscode from 'vscode';
import { getCommandOptions } from '../../../configUI';
import { ECommandOption } from '../../../configUI.data';
import type { TAhkTokenLine } from '../../../globalEnum';
import { EDetail } from '../../../globalEnum';
import { snippetGui } from '../../../tools/Built-in/Gui/gui.tools';
import { snippetGuiControl } from '../../../tools/Built-in/GuiControl/GuiControl.tools';
import { snippetMenu } from '../../../tools/Built-in/Menu/Menu.tools';
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
    const { CommandOption, expandSubCommand } = getCommandOptions();
    if (!expandSubCommand) return [];
    if (CommandOption === ECommandOption.notProvided) return [];

    const { fistWordUp, detail } = AhkTokenLine;

    switch (CommandOption) {
        case ECommandOption.All:
        case ECommandOption.Recommended:
        case ECommandOption.noSameFunc: // did i check this?
        {
            const subStr2: string = getSubStr2(subStr, fistWordUp, detail).toLowerCase();

            const list: vscode.CompletionItem[] = [];

            if ('Gui'.toLowerCase().startsWith(subStr2)) list.push(...snippetGui);
            if ('GuiControl'.toLowerCase().startsWith(subStr2)) list.push(...snippetGuiControl);
            if ('Menu'.toLowerCase().startsWith(subStr2)) list.push(...snippetMenu);

            // todo something
            return list;
        }
        default:
            enumLog(CommandOption, 'getSnippetGui');
            return [];
    }
}
