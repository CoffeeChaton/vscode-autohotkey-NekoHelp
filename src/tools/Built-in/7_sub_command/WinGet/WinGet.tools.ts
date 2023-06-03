/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as vscode from 'vscode';
import { WinGetSubCmdList } from './WinGet.data';

export const { snippetWinGet, WinGetMDMap } = (() => {
    const MDMapRW = new Map<string, vscode.MarkdownString>();
    const snippetListRW: vscode.CompletionItem[] = [];

    for (const v of WinGetSubCmdList) {
        const {
            SubCommand,
            body,
            doc,
            link,
            exp,
        } = v;
        const upName: string = SubCommand.toUpperCase();
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown(`WinGet, ${SubCommand}`)
            .appendCodeblock(body, 'ahk')
            .appendMarkdown(`[(Read Doc)](${link})\n\n`)
            .appendMarkdown(doc)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');

        md.supportHtml = true;
        MDMapRW.set(upName, md);

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: `WinGet, ${SubCommand}`, // Left
            description: 'sub-command', // Right
        });
        item.kind = vscode.CompletionItemKind.Keyword;
        const body2: string = body.includes('[')
            ? body
                .replaceAll(/\s*,\s*\[/gu, '[')
                .replaceAll(/\[\s*,\s*/gu, '[')
                .replaceAll(/\s*\[\s*/gu, ',$0 ')
                .replaceAll(/\s*\]\s*/gu, '')
            : body;
        item.insertText = new vscode.SnippetString(body2);
        item.detail = 'WinGet';
        item.documentation = md;

        snippetListRW.push(item);
    }

    /**
     * after initialization clear
     */
    WinGetSubCmdList.length = 0;

    // ---
    // ---
    return {
        snippetWinGet: snippetListRW as readonly vscode.CompletionItem[],
        WinGetMDMap: MDMapRW as ReadonlyMap<string, vscode.MarkdownString>,
    };
})();
