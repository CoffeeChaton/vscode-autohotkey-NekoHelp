import * as vscode from 'vscode';
import { CSnippetCommand } from './CSnippetCommand';
import { otherKeyword1 } from './otherKeyword1.data';

export const [snippetOtherKeyword, OtherKeyWordMDMap] = (
    (): [readonly CSnippetCommand[], ReadonlyMap<string, vscode.MarkdownString>] => {
        const map1 = new Map<string, vscode.MarkdownString>();
        const tempList: CSnippetCommand[] = [];

        for (const v of otherKeyword1) {
            const {
                body,
                doc,
                exp,
                link,
                upName,
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

            map1.set(upName, md);
            tempList.push(new CSnippetCommand(v, md));
        }

        /**
         * after initialization clear
         */
        otherKeyword1.length = 0;
        return [tempList, map1];
    }
)();

export function getHoverOtherKeyWord1(wordUp: string): vscode.MarkdownString | undefined {
    return OtherKeyWordMDMap.get(wordUp);
}

export function getSnippetOtherKeyWord1(lStr: string): readonly CSnippetCommand[] {
    return (/^[ \t{]*\w*$/iu).test(lStr)
        ? snippetOtherKeyword
        : [];
}
