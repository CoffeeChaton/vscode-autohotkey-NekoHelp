import * as vscode from 'vscode';
import { CSnippetCommand } from '../6_command/CSnippetCommand';
import { declarationDataList } from './declaration.data';

type TDeclaration_snip = readonly CSnippetCommand[];
type TDeclaration_MDMap = ReadonlyMap<string, vscode.MarkdownString>;

const temp_Declaration: [TDeclaration_snip, TDeclaration_MDMap] = (
    (): [TDeclaration_snip, TDeclaration_MDMap] => {
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

export const Declaration_snip: TDeclaration_snip = temp_Declaration[0];
export const Declaration_MDMap: TDeclaration_MDMap = temp_Declaration[1];

export function getHoverDeclaration(wordUp: string): vscode.MarkdownString | undefined {
    return Declaration_MDMap.get(wordUp);
}

export function getSnipDeclaration(lStr: string): readonly CSnippetCommand[] {
    return (/^[ \t{]*\w*$/iu).test(lStr)
        ? Declaration_snip
        : [];
}
