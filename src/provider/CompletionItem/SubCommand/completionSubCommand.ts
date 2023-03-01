import type * as vscode from 'vscode';
import { getCommandOptions } from '../../../configUI';
import { ECommandOption } from '../../../configUI.data';
import type { TAhkTokenLine } from '../../../globalEnum';
import { snippetGui } from '../../../tools/Built-in/Gui/gui.tools';
import { snippetMenu } from '../../../tools/Built-in/Menu/Menu.tools';
import { enumLog } from '../../../tools/enumErr';

export function completionSubCommand(subStr: string, AhkTokenLine: TAhkTokenLine): readonly vscode.CompletionItem[] {
    const { CommandOption, expandSubCommand } = getCommandOptions();
    if (!expandSubCommand) return [];
    if (CommandOption === ECommandOption.notProvided) return [];

    const { fistWordUp } = AhkTokenLine;

    switch (CommandOption) {
        case ECommandOption.All:
        case ECommandOption.Recommended:
        case ECommandOption.noSameFunc: // did i check this?
            if (
                (/^(?:G|GU|GUI)$/iu).test(subStr)
                || (fistWordUp === 'CASE' && (/^case\s[^:]+:\s*(?:G|GU|GUI)$/iu).test(subStr))
                || (fistWordUp === 'DEFAULT' && (/^default\s*:\s*(?:G|GU|GUI)$/iu).test(subStr))
                || (!subStr.trim().startsWith(':') && (/::\s*(?:G|GU|GUI)$/iu).test(subStr)) // FIXME
            ) return snippetGui;

            if (
                (/^(?:M|ME|MEN|MENU)$/iu).test(subStr)
                || (fistWordUp === 'CASE' && (/^case\s[^:]+:\s*(?:M|ME|MEN|MENU)$/iu).test(subStr))
                || (fistWordUp === 'DEFAULT' && (/^default\s*:\s*(?:M|ME|MEN|MENU)$/iu).test(subStr))
                || (!subStr.trim().startsWith(':') && (/::\s*(?:M|ME|MEN|MENU)$/iu).test(subStr))
            ) return snippetMenu;

            // todo something
            return [];

        default:
            enumLog(CommandOption, 'getSnippetGui');
            return [];
    }
}
