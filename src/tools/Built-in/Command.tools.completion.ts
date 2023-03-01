import { getCommandOptions } from '../../configUI';
import { ECommandOption } from '../../configUI.data';
import type { TAhkTokenLine } from '../../globalEnum';
import { enumLog } from '../enumErr';
import { getAllFunc } from '../Func/getAllFunc';
import { snippetCommand } from './Command.tools';
import type { CSnippetCommand } from './CSnippetCommand';

const snippetCommandFilter: readonly CSnippetCommand[] = snippetCommand.filter((v: CSnippetCommand) => v.recommended);

export function getSnippetCommand(subStr: string, AhkTokenLine: TAhkTokenLine): readonly CSnippetCommand[] {
    const { fistWordUp } = AhkTokenLine;
    // ^ ~~ $  need close
    const isOK: boolean = (/^\w+$/u).test(subStr)
        || (fistWordUp === 'CASE' && (/^case\s[^:]+:\s*\w*$/iu).test(subStr))
        || (fistWordUp === 'DEFAULT' && (/^default\s*:\s*\w*$/iu).test(subStr))
        || (!subStr.trim().startsWith(':') && (/::\s*\w*$/iu).test(subStr)); // allow hotkey

    // || (/^[{}]\s*\w*$/iu).test(subStr);
    // { MsgBox hi!
    // ^---- "{" and cmd
    // i know this is OK, but i don't want to Completion this case...

    // Try Hotkey, %Key1%, label1
    // ;-----^ cmd
    // i know this is OK, but i don't want to Completion this case...

    if (!isOK) return [];

    //
    const opt: ECommandOption = getCommandOptions().CommandOption;

    switch (opt) {
        case ECommandOption.All:
            return snippetCommand;

        case ECommandOption.Recommended:
            return snippetCommandFilter;

        case ECommandOption.noSameFunc: {
            const fnMap = getAllFunc();
            return snippetCommandFilter.filter((v) => !fnMap.has(v.upName));
        }

        case ECommandOption.notProvided:
            return [];

        default:
            enumLog(opt, 'getSnippetCommand');
            return [];
    }
}
