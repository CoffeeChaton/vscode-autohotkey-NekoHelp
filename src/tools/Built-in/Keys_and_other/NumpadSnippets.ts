import * as vscode from 'vscode';

const NumSnippets: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    const NumObj = {
        NumLock: 'NumLock',
        Numpad0: '0',
        Numpad1: '1',
        Numpad2: '2',
        Numpad3: '3',
        Numpad4: '4',
        Numpad5: '5',
        // NumpadClear:'',
        Numpad6: '6',
        Numpad7: '7',
        Numpad8: '8',
        Numpad9: '9',
        NumpadMult: '*',
        NumpadAdd: '+',
        NumpadSub: '-',
        NumpadDiv: '/',
        NumpadDot: '.',
        NumpadDel: 'Del',
        NumpadIns: 'Ins',
        NumpadUp: '↑',
        NumpadDown: '↓',
        NumpadLeft: '←',
        NumpadRight: '→',
        NumpadHome: 'Home',
        NumpadEnd: 'End',
        NumpadPgUp: 'PgUp',
        NumpadPgDn: 'PgDn',
        NumpadEnter: 'Enter',
    } as const;

    const List: vscode.CompletionItem[] = [];
    //
    // eslint-disable-next-line no-magic-numbers
    for (const [key, code] of Object.entries(NumObj)) {
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(`${key} -> ${code}`, 'ahk')
            .appendMarkdown('[Read Doc](https://www.autohotkey.com/docs/v1/KeyList.htm#numpad)');
        md.supportHtml = true;

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: key, // Left
            description: 'Numpad Keys', // Right
        });
        // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.kind = vscode.CompletionItemKind.EnumMember;
        item.insertText = key;
        item.detail = 'Numpad Keys';
        item.documentation = md;
        //
        List.push(item);
    }

    return List;
})();

export function getSnipStartNum(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('Nu') // Num
        ? NumSnippets
        : [];
}
