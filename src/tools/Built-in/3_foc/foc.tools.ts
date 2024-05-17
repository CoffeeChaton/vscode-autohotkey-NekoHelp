import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { EDetail } from '../../../globalEnum';
import { CommandMDMap } from '../6_command/Command.tools';
import { initNlsDefMap, readNlsJson } from '../nls_json.tools';
import type { TFocDiag, TStatementElement } from './foc.data';

type TStatementMDMap = ReadonlyMap<string, vscode.MarkdownString>;
type TSnippetStatement = readonly vscode.CompletionItem[];
type TForErrMap = ReadonlyMap<string, TFocDiag>;

export const [StatementMDMap, snippetStatement, forErrMap] = ((): [TStatementMDMap, TSnippetStatement, TForErrMap] => {
    const map1: Map<string, vscode.MarkdownString> = new Map<string, vscode.MarkdownString>();
    const List2: vscode.CompletionItem[] = [];
    const errMap = new Map<string, TFocDiag>();

    const Statement: TStatementElement[] = readNlsJson('foc') as TStatementElement[];
    for (const v of Statement) {
        const {
            keyRawName,
            doc,
            link,
            exp,
            body,
            recommended,
            diag,
        } = v;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(keyRawName, 'ahk')
            .appendMarkdown(doc.join('\n'))
            .appendMarkdown('\n')
            .appendMarkdown(`[(Read Doc)](${link})`)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');

        md.supportHtml = true;
        map1.set(keyRawName.toUpperCase(), md);

        if (diag !== undefined) errMap.set(keyRawName.toUpperCase(), diag);
        if (!recommended) continue;

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: keyRawName,
            description: keyRawName,
        });
        item.kind = vscode.CompletionItemKind.Keyword; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        const body2: string = body.includes('[')
            ? body
                .replaceAll(/\s*,\s*\[/gu, '[')
                .replaceAll(/\[\s*,\s*/gu, '[')
                .replaceAll(/\s*\[\s*/gu, ',$0 ')
                .replaceAll(/\s*\]\s*/gu, '')
            : body;

        item.insertText = new vscode.SnippetString(body2);
        item.detail = 'Flow of Control (neko-help)';
        item.documentation = md;

        List2.push(item);
    }

    return [map1, List2, errMap]; // [Map(19), Array(19)]
})();

export function getSnippetStatement(
    PartStr: string,
    fistWordUp: string,
    AhkTokenLine: TAhkTokenLine,
): readonly vscode.CompletionItem[] {
    if (AhkTokenLine.detail.includes(EDetail.inComment)) return [];

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

export const focDefMap: ReadonlyMap<string, [vscode.Location]> = initNlsDefMap('foc');
