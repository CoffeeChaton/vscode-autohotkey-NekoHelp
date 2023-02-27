/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as vscode from 'vscode';
import { getCommandOptions } from '../../../configUI';
import { ECommandOption } from '../../../configUI.data';
import { enumLog } from '../../enumErr';
import { MenuSubCmdList } from './Menu.data';

const { snippetMenu, MenuMDMap } = (() => {
    const MDMapRW = new Map<string, vscode.MarkdownString>();
    const snippetListRW: vscode.CompletionItem[] = [];

    for (const v of MenuSubCmdList) {
        const {
            SubCommand,
            body,
            doc,
            link,
            exp,
        } = v;
        const upName: string = SubCommand.toUpperCase();
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown(`# Menu ${SubCommand}`)
            .appendCodeblock(body, 'ahk')
            .appendMarkdown(doc)
            .appendMarkdown(`[(Read Doc)](${link})\n\n`)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');

        md.supportHtml = true;
        MDMapRW.set(upName, md);

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: `Menu, ${SubCommand}`, // Left
            description: 'Menu-sub-command', // Right
        });
        item.kind = vscode.CompletionItemKind.Keyword;
        item.insertText = new vscode.SnippetString(body);
        item.detail = 'Menu';
        item.documentation = md;

        snippetListRW.push(item);
    }

    /**
     * after initialization clear
     */
    MenuSubCmdList.length = 0;

    // ---
    // ---
    return {
        snippetMenu: snippetListRW as readonly vscode.CompletionItem[],
        MenuMDMap: MDMapRW as ReadonlyMap<string, vscode.MarkdownString>,
    };
})();

export function getSnippetMenu(subStr: string): readonly vscode.CompletionItem[] {
    // FIXME: Menu add vs `MAdd`
    const isOK: boolean = (/^M\w*$/iu).test(subStr)
        || (/^case\s[^:]+:\s*M\w*$/iu).test(subStr)
        || (/^default\s*:\s*M\w*$/iu).test(subStr)
        || (!subStr.trim().startsWith(':') && (/::\s*M\w*$/iu).test(subStr)); // just allow hotkey, not allow hotString

    if (!isOK) return [];

    //
    const opt: ECommandOption = getCommandOptions();

    switch (opt) {
        case ECommandOption.All:
        case ECommandOption.Recommended:
        case ECommandOption.noSameFunc:
            return snippetMenu;

        case ECommandOption.notProvided:
            return [];

        default:
            enumLog(opt, 'getSnippetMenu');
            return [];
    }
}

export const MenuMDMapOut: ReadonlyMap<string, vscode.MarkdownString> = MenuMDMap;
