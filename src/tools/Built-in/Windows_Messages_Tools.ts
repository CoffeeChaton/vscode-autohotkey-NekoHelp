import * as vscode from 'vscode';
import { winMsg } from './Windows_Messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const { snippetWinMsg, winMsgMDMap } = (() => {
    const map1 = new Map<string, vscode.MarkdownString>();

    const tempList: vscode.CompletionItem[] = [];
    for (const [k, v] of winMsg.entries()) {
        // WM_DDE_EXECUTE -> [1000,'0x03E8']
        // WM_DDE_EXECUTE := 0x03E8 ; 1000

        const body = `${k} := ${v[1]} ; ${v[0]}`;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(body, 'ahk')
            .appendMarkdown('Windows Messages')
            .appendMarkdown('\n\n')
            .appendMarkdown(
                '[Read More of Windows Messages](https://www.autohotkey.com/docs/v1/misc/SendMessageList.htm)',
            );
        md.supportHtml = true;

        map1.set(k, md);
        const item = new vscode.CompletionItem({
            label: k, // Left
            description: 'winMsg', // Right
        });
        item.kind = vscode.CompletionItemKind.Variable;
        item.insertText = new vscode.SnippetString()
            .appendChoice([
                `${k} := ${v[1]} ; ${v[0]}`,
                `${k} := ${v[1]}`,
                v[1],
                // eslint-disable-next-line @fluffyfox/string/no-simple-template-literal
                `${v[0]}`,
            ]);

        item.detail = 'Windows Messages (neko-help)'; // description
        item.documentation = md;

        tempList.push(item);
    }
    return {
        snippetWinMsg: tempList as readonly vscode.CompletionItem[],
        winMsgMDMap: map1 as ReadonlyMap<string, vscode.MarkdownString>,
    };
})();

export function getSnippetWinMsg(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('WM') || PartStr.startsWith('wm')
        ? snippetWinMsg
        : [];
}

export function hover2winMsgMd(wordUp: string): vscode.MarkdownString | undefined {
    return winMsgMDMap.get(wordUp);
}
