import * as vscode from 'vscode';
import { Ahk2exeData } from './Ahk2exe.data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const { Ahk2exeMdMap, snippetAhk2exe } = (() => {
    const Ahk2exeMdMapRW = new Map<string, vscode.MarkdownString>();
    const snippetAhk2exeRW: vscode.CompletionItem[] = [];
    //
    for (const v of Ahk2exeData) {
        const {
            keyRawName,
            link,
            doc,
            exp,
            body,
        } = v;

        const msgName = `;@Ahk2Exe-${keyRawName}`;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(msgName, 'ahk')
            .appendMarkdown(`Script Compiler Directives ([Read Doc](${link}))`)
            .appendMarkdown('\n\n')
            .appendMarkdown(doc)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');
        md.supportHtml = true;

        Ahk2exeMdMapRW.set(keyRawName.toUpperCase(), md);
        //

        if (keyRawName === 'Bin') continue;

        const item: vscode.CompletionItem = new vscode.CompletionItem(msgName);
        item.kind = vscode.CompletionItemKind.Snippet; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = new vscode.SnippetString(body.replace(';@', ''));
        item.detail = 'Script Compiler Directives (neko-help)';
        item.documentation = md;
        //
        if (keyRawName === 'IgnoreBegin') {
            item.preselect = true;
        }
        snippetAhk2exeRW.push(item);
    }

    /**
     * after initialization clear
     */
    Ahk2exeData.length = 0;

    return {
        Ahk2exeMdMap: Ahk2exeMdMapRW as ReadonlyMap<string, vscode.MarkdownString>,
        snippetAhk2exe: snippetAhk2exeRW as readonly vscode.CompletionItem[],
    };
})();

export function getSnipAhk2exe(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] | null {
    const subStr: string = document.lineAt(position.line).text.slice(0, position.character);

    return (/^\s*;@$/u).test(subStr)
        ? [...snippetAhk2exe]
        : null;
}

/**
 * ; else
 */
