/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as vscode from 'vscode';
import { GuiControlSubCmdList } from './GuiControl.data';

export const { snippetGuiControl, GuiControlMDMap } = (() => {
    const MDMapRW = new Map<string, vscode.MarkdownString>();
    const snippetListRW: vscode.CompletionItem[] = [];

    for (const v of GuiControlSubCmdList) {
        const {
            SubCommand,
            body,
            doc,
            link,
            exp,
        } = v;
        const upName: string = SubCommand.toUpperCase();
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown('GuiControl')
            .appendCodeblock(body, 'ahk')
            .appendMarkdown(`[(Read Doc)](${link})\n\n`)
            .appendMarkdown(doc)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');

        md.supportHtml = true;
        MDMapRW.set(upName, md);

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: `GuiControl, ${SubCommand}`, // Left
            description: 'sub-command', // Right
        });
        item.kind = vscode.CompletionItemKind.Keyword;
        item.insertText = new vscode.SnippetString(body);
        item.detail = 'GuiControl';
        item.documentation = md;

        snippetListRW.push(item);
    }

    /**
     * after initialization clear
     */
    GuiControlSubCmdList.length = 0;

    // ---
    // ---
    return {
        snippetGuiControl: snippetListRW as readonly vscode.CompletionItem[],
        GuiControlMDMap: MDMapRW as ReadonlyMap<string, vscode.MarkdownString>,
    };
})();
