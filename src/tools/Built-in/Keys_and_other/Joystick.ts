import * as vscode from 'vscode';

const JoySnippets: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    const JoyList = [
        'JoyX',
        'JoyY',
        'JoyZ',
        'JoyR',
        'JoyU',
        'JoyV',
        'JoyPOV',
        'JoyName',
        'JoyButtons',
        'JoyAxes',
        'JoyInfo',
        // 'JoyZRUVPD', // ??
        'Joy1',
        'Joy2',
        'Joy3',
        'Joy4',
        'Joy5',
        'Joy6',
        'Joy7',
        'Joy8',
        'Joy9',
        'Joy10',
        'Joy11',
        'Joy12',
        'Joy13',
        'Joy14',
        'Joy15',
        'Joy16',
        'Joy17',
        'Joy18',
        'Joy19',
        'Joy20',
        'Joy21',
        'Joy22',
        'Joy23',
        'Joy24',
        'Joy25',
        'Joy26',
        'Joy27',
        'Joy28',
        'Joy29',
        'Joy30',
        'Joy31',
        'Joy32',
    ];

    const List: vscode.CompletionItem[] = [];
    for (const key of JoyList) {
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(key, 'ahk')
            .appendMarkdown('Joystick')
            .appendMarkdown('[\\(Read Doc\\)](https://www.autohotkey.com/docs/v1/KeyList.htm#Joystick)');
        md.supportHtml = true;

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: key, // Left
            description: 'Joystick', // Right
        });
        // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.kind = vscode.CompletionItemKind.EnumMember;
        item.insertText = key;
        item.detail = 'Joystick';
        item.documentation = md;
        //
        List.push(item);
    }

    return List;
})();

export function getSnipStartJoy(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('Jo') // Jo
        ? JoySnippets
        : [];
}
