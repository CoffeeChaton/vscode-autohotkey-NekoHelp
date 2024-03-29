import * as vscode from 'vscode';
import { Ahk2exeData } from './Ahk2exe.data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const { Ahk2exeMdMap, snippetAhk2exeLine, snippetAhk2exeKeep } = (() => {
    const Ahk2exeMdMapRW = new Map<string, vscode.MarkdownString>();
    const snippetAhk2exeRW: vscode.CompletionItem[] = [];
    const snippetAhk2exeKeepRW: vscode.CompletionItem[] = [];
    //
    // /*@Ahk2Exe-Keep\n$0\n*/
    const Ahk2ExeKeep = {
        keyRawName: 'Keep',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#IgnoreKeep',
        doc: 'The reverse is also possible, i.e. marking a code section to only be executed in the compiled script:',
        body: 'Ahk2Exe-Keep\n',
        exp: [
            '/*@Ahk2Exe-Keep',
            'MsgBox This message appears only in the compiled script',
            '*/',
            'MsgBox This message appears in both the compiled and unCompiled script',
        ],
    };

    for (const v of [...Ahk2exeData, Ahk2ExeKeep]) {
        const {
            keyRawName,
            link,
            doc,
            exp,
            body,
        } = v;

        const msgName = keyRawName === 'Keep'
            ? '@Ahk2Exe-Keep'
            : `;@Ahk2Exe-${keyRawName}`;
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

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: msgName,
            description: 'Compiler',
        });
        item.kind = vscode.CompletionItemKind.Snippet; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = new vscode.SnippetString(body.replace(';@', ''));
        item.detail = 'Script Compiler Directives (neko-help)';
        item.documentation = md;

        if (keyRawName === 'Keep') {
            snippetAhk2exeKeepRW.push(item);
        } else {
            snippetAhk2exeRW.push(item);
        }
    }

    /**
     * after initialization clear
     */
    Ahk2exeData.length = 0;

    return {
        Ahk2exeMdMap: Ahk2exeMdMapRW as ReadonlyMap<string, vscode.MarkdownString>,
        snippetAhk2exeLine: snippetAhk2exeRW as readonly vscode.CompletionItem[],
        snippetAhk2exeKeep: snippetAhk2exeKeepRW as readonly vscode.CompletionItem[],
    };
})();

/**
 * ; else
 */
