import { getConfig } from '../../../configUI';
import { ECommandOption } from '../../../configUI.data';
import type { TAhkTokenLine } from '../../../globalEnum';
import { enumLog } from '../../enumErr';
import { getAllFunc } from '../../Func/getAllFunc';
import { Cmd_Snip } from './Command.tools';
import type { CSnippetCommand } from './CSnippetCommand';

const snippetCommandFilter: readonly CSnippetCommand[] = Cmd_Snip.filter((v: CSnippetCommand) => v.recommended);

export function getSnipCmd(subStr: string, AhkTokenLine: TAhkTokenLine): readonly CSnippetCommand[] {
    const { fistWordUp } = AhkTokenLine;
    // ^ ~~ $  need close
    const isOK: boolean = (/^\w+$/u).test(subStr)
        || (fistWordUp === 'CASE' && (/^case\s[^:]+:[ \t]*\w*$/iu).test(subStr))
        || (fistWordUp === 'DEFAULT' && (/^default\s*:[ \t]*\w*$/iu).test(subStr))
        || (!subStr.trim().startsWith(':') && (/::[ \t]*\w*$/iu).test(subStr)); // allow hotkey

    // || (/^[{}]\s*\w*$/iu).test(subStr);
    // { MsgBox hi!
    // ^---- "{" and cmd
    // i know this is OK, but i don't want to Completion this case...

    // Try Hotkey, %Key1%, label1
    // ;-----^ cmd
    // i know this is OK, but i don't want to Completion this case...

    if (!isOK) return [];

    //
    const opt: ECommandOption = getConfig().snippets.CommandOption;

    switch (opt) {
        case ECommandOption.All:
            return Cmd_Snip;

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
