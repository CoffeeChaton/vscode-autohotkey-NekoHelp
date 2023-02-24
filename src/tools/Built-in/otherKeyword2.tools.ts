import * as vscode from 'vscode';
import { otherKeyword2 } from './otherKeyword2.data';

export const [otherKeyword2MD, snippetOtherKeyword2] = (
    (): [ReadonlyMap<string, vscode.MarkdownString>, readonly vscode.CompletionItem[]] => {
        const map1 = new Map<string, vscode.MarkdownString>();
        const List2: vscode.CompletionItem[] = [];
        //
        for (const v of otherKeyword2) {
            const {
                keyRawName,
                link,
                doc,
                exp,
                body,
            } = v;
            const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
                .appendMarkdown('other Key Word')
                .appendCodeblock(body, 'ahk')
                .appendMarkdown(`[(Read Doc)](${link})\n\n`)
                .appendMarkdown(doc)
                .appendMarkdown('\n\n***')
                .appendMarkdown('\n\n*exp:*')
                .appendCodeblock(exp.join('\n'), 'ahk');
            md.supportHtml = true;

            map1.set(keyRawName.toUpperCase(), md);
            //
            const item: vscode.CompletionItem = new vscode.CompletionItem(
                keyRawName,
                vscode.CompletionItemKind.Keyword,
            );
            item.insertText = body;
            item.detail = 'otherKeyword2 (neko-help)';
            item.documentation = md;
            //
            List2.push(item);
        }

        /**
         * after initialization clear
         */
        otherKeyword2.length = 0;

        return [map1, List2];
    }
)();

export function getHoverOtherKeyWord2(wordUp: string): vscode.MarkdownString | undefined {
    return otherKeyword2MD.get(wordUp);
}

export function getSnippetOtherKeyWord2(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('A_')
        ? []
        : snippetOtherKeyword2;
}
