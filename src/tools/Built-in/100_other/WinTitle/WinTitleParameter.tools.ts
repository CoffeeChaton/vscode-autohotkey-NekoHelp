import * as vscode from 'vscode';
import { WinTitleParameterData } from './WinTitleParameter.data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const [WinTitleMDMap, snippetWinTitle] = (() => {
    const map1 = new Map<string, vscode.MarkdownString>();
    const List2: vscode.CompletionItem[] = [];
    //
    for (const vv of WinTitleParameterData) {
        const {
            body,
            // uri,
            tittleMD,
            exp,
        } = vv;
        const md: vscode.MarkdownString = new vscode.MarkdownString(tittleMD, true)
            .appendCodeblock(body, 'ahk')
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');

        md.supportHtml = true;
        map1.set(body.toUpperCase(), md);
        //
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: body, // Left
            description: 'WinTitle', // Right
        });
        item.kind = vscode.CompletionItemKind.Keyword; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = body;
        item.detail = 'WinTitle Parameter (neko-help)';
        item.documentation = md;
        // item.filterText = 'A_';
        //
        List2.push(item);
    }

    /**
     * after initialization clear
     */
    WinTitleParameterData.length = 0;
    return [
        map1 as ReadonlyMap<string, vscode.MarkdownString>,
        List2 as readonly vscode.CompletionItem[],
    ];
})();

export function getSnippetWinTitleParam(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('a')
        ? snippetWinTitle
        : [];
}

export function hoverWinTitleParam(wordUp: string): vscode.MarkdownString | undefined {
    return WinTitleMDMap.get(wordUp);
}
