import * as vscode from 'vscode';
import { CSnippetCommand } from '../6_command/CSnippetCommand';
import { declarationDataList } from './declaration.data';

export const [snippetDeclaration, declarationMDMap] = (
    (): [readonly CSnippetCommand[], ReadonlyMap<string, vscode.MarkdownString>] => {
        const map1 = new Map<string, vscode.MarkdownString>();
        const tempList: CSnippetCommand[] = [];

        for (const v of declarationDataList) {
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
        declarationDataList.length = 0;
        return [tempList, map1];
    }
)();

export function getHoverDeclaration(wordUp: string): vscode.MarkdownString | undefined {
    return declarationMDMap.get(wordUp);
}

export function getSnipDeclaration(lStr: string): readonly CSnippetCommand[] {
    return (/^[ \t{]*\w*$/iu).test(lStr)
        ? snippetDeclaration
        : [];
}
