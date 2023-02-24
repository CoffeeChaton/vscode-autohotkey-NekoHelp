import * as vscode from 'vscode';
import { CommandMDMap } from './Command.tools';
import { Statement } from './statement.data';

type TStatementMDMap = ReadonlyMap<string, vscode.MarkdownString>;
type TSnippetStatement = readonly vscode.CompletionItem[];

export const [StatementMDMap, snippetStatement] = ((): [TStatementMDMap, TSnippetStatement] => {
    const map1: Map<string, vscode.MarkdownString> = new Map<string, vscode.MarkdownString>();
    const List2: vscode.CompletionItem[] = [];
    for (const v of Statement) {
        const {
            keyRawName,
            doc,
            link,
            exp,
            body,
            recommended,
            upName,
        } = v;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(keyRawName, 'ahk')
            .appendMarkdown(doc)
            .appendMarkdown('\n')
            .appendMarkdown(`[(Read Doc)](${link})`)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');

        md.supportHtml = true;
        map1.set(upName, md);

        if (!recommended) continue;
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: keyRawName,
            description: keyRawName,
        });
        item.kind = vscode.CompletionItemKind.Keyword; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = new vscode.SnippetString(body);
        item.detail = 'Flow of Control (neko-help)';
        item.documentation = md;

        List2.push(item);
    }

    /**
     * after initialization clear
     * Flow of Control
     * FOC
     */
    Statement.length = 0;
    return [map1, List2]; // [Map(19), Array(19)]
})();

export function getSnippetStatement(PartStr: string, fistWordUp: string): readonly vscode.CompletionItem[] {
    if (CommandMDMap.has(fistWordUp)) {
        return [];
    }

    return PartStr.startsWith('A_')
        ? []
        : snippetStatement;
}

export function getHoverStatement(wordUp: string): vscode.MarkdownString | undefined {
    return StatementMDMap.get(wordUp);
}
