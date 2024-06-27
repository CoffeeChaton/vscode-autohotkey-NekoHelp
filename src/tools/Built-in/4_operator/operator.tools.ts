import * as vscode from 'vscode';
import { operatorDataList } from './operator.data';

type TOperator_MDMap = ReadonlyMap<string, vscode.MarkdownString>;
type TOperator_snip = readonly vscode.CompletionItem[];

const temp_operator: [TOperator_MDMap, TOperator_snip] = (
    (): [TOperator_MDMap, TOperator_snip] => {
        const map1 = new Map<string, vscode.MarkdownString>();
        const List2: vscode.CompletionItem[] = [];
        //
        for (const v of operatorDataList) {
            const {
                body,
                doc,
                exp,
                keyRawName,
                link,
                recommended,
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
            if (recommended) {
                List2.push(item);
            }
        }

        /**
         * after initialization clear
         */
        operatorDataList.length = 0;

        return [map1, List2];
    }
)();

export const operator_MDMap: TOperator_MDMap = temp_operator[0];
const Operator_snip: TOperator_snip = temp_operator[1];

export function getHoverOperator(wordUp: string): vscode.MarkdownString | undefined {
    return operator_MDMap.get(wordUp);
}

export function getSnippetOperator(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('A_')
        ? []
        : Operator_snip;
}
