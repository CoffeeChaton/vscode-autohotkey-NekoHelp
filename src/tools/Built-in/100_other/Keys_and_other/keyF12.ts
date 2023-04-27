import * as vscode from 'vscode';

const F12FuncKeysSnippets: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    const List: vscode.CompletionItem[] = [];
    //
    // eslint-disable-next-line no-magic-numbers
    for (let i = 1; i < 25; i++) {
        const key = `F${i}`;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(key, 'ahk')
            .appendMarkdown('Function Keys')
            .appendMarkdown('\n\n')
            .appendMarkdown('The 12 or more function keys at the top of most keyboards.')
            .appendMarkdown('[Read Doc](https://www.autohotkey.com/docs/v1/KeyList.htm#function)');

        md.supportHtml = true;

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: key, // Left
            description: 'Keyboard', // Right
        });
        // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.kind = vscode.CompletionItemKind.EnumMember;
        item.insertText = key;
        item.detail = 'Function Keys';
        item.documentation = md;
        //
        List.push(item);
    }

    return List;
})();

export function getSnipStartF(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('F') // Num
        ? F12FuncKeysSnippets
        : [];
}
