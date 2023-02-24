import * as vscode from 'vscode';

const MouseKeyboardSnip: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    type TListKeys = {
        group: string,
        uri: `https://www.autohotkey.com/docs/v1/KeyList.htm#${string}`,
        list: readonly string[],
    };

    const Mouse: TListKeys = {
        group: 'Mouse',
        uri: 'https://www.autohotkey.com/docs/v1/KeyList.htm#mouse',
        list: [
            'LButton',
            'MButton',
            'RButton',
            'WheelDown',
            'WheelLeft',
            'WheelRight',
            'WheelUp',
            'XButton1',
            'XButton2',
        ],
    };

    //
    const keyboard: TListKeys = {
        group: 'Keyboard',
        uri: 'https://www.autohotkey.com/docs/v1/KeyList.htm#keyboard',
        list: [
            'CapsLock',
            'Space',
            'Tab',
            'Enter',
            'Escape',
            'Esc',
            'BackSpace',
            'BS',
            'ScrollLock',
            'Delete',
            'Del',
            'Insert',
            'Ins',
            'Home',
            'End',
            'PgUp',
            'PgDn',
            'Up',
            'Down',
            'Left',
            'Right',
            //
            'LWin',
            'RWin',
            //
            'Control',
            'LControl',
            'RControl',
            'Ctrl',
            'LCtrl',
            'RCtrl',
            //
            'Alt',
            'LAlt',
            'RAlt',
            'AltDown',
            'AltUp',
            //
            'Shift',
            'LShift',
            'RShift',
            'ShiftDown',
            'ShiftUp',
            //

            'CtrlDown',
            'CtrlUp',
            'LWinDown',
            'LWinUp',
            'RWinDown',
            'RWinUp',
        ],
    };

    const MultimediaKeys: TListKeys = {
        group: 'Multimedia Keys',
        uri: 'https://www.autohotkey.com/docs/v1/KeyList.htm#multimedia',
        list: [
            'Browser_Back',
            'Browser_Forward',
            'Browser_Refresh',
            'Browser_Stop',
            'Browser_Search',
            'Browser_Favorites',
            'Browser_Home',
            //
            'Volume_Mute',
            'Volume_Down',
            'Volume_Up',
            //
            'Media_Next',
            'Media_Prev',
            'Media_Stop',
            'Media_Play_Pause',
            //
            'Launch_Mail',
            'Launch_Media',
            'Launch_App1',
            'Launch_App2',
        ],
    };

    const OtherKeys: TListKeys = {
        group: 'Other Keys',
        uri: 'https://www.autohotkey.com/docs/v1/KeyList.htm#other',
        list: [
            'AppsKey',
            'PrintScreen',
            'CtrlBreak',
            'Pause',
            // 'Help',
            // 'Sleep',
        ],
    };
    // TODO https://www.autohotkey.com/docs/v1/lib/Send.htm#keynames

    function makeSnip(params: TListKeys): vscode.CompletionItem[] {
        const List: vscode.CompletionItem[] = [];
        const { group, uri, list } = params;
        for (const key of list) {
            const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
                .appendCodeblock(key, 'ahk')
                .appendMarkdown(group)
                .appendMarkdown(`[\\(Read Doc\\)](${uri})`);
            md.supportHtml = true;

            const item: vscode.CompletionItem = new vscode.CompletionItem({
                label: key, // Left
                description: group, // Right
            });
            // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
            item.kind = vscode.CompletionItemKind.EnumMember;
            item.insertText = key;
            item.detail = group;
            item.documentation = md;
            //
            List.push(item);
        }

        return List;
    }

    return [...makeSnip(Mouse), ...makeSnip(keyboard), ...makeSnip(MultimediaKeys), ...makeSnip(OtherKeys)];
})();

export function getSnipMouseKeyboard(subStr: string): readonly vscode.CompletionItem[] {
    return (/(?<![.`#])\w+$/iu).test(subStr)
        ? MouseKeyboardSnip
        : [];
}
