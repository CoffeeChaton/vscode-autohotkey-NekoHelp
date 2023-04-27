/* eslint-disable @typescript-eslint/naming-convention */

type TA_SendCore = {
    label: string,
    icon: string,
    doc: string[],
    body: string,
    link: `https://www.autohotkey.com/docs/v1/${string}`,
};

type TA_Send = {
    // key is Private
    [k in string]: TA_SendCore;
};

export const A_Send: TA_Send = {
    Text: {
        label: '{Text}',
        icon: 'Text mode',
        doc: [
            'Enables the *Text mode*, which sends a stream of characters rather than keystrokes.',
            'exp:',
            '    Send {Text} your text',
        ],
        body: 'Text',
        link: 'https://www.autohotkey.com/docs/v1/lib/Send.htm#Text',
    },
    Up: {
        label: '{Up}',
        icon: '↑',
        doc: ['↑ (up arrow) on main keyboard'],
        body: 'Up',
        link: 'https://www.autohotkey.com/docs/v1/lib/Send.htm#keynames',
    },
    // 'Blind',
    // 'Click',
    // 'Raw',
    // 'AltDown',
    // 'AltUp',
    // 'ShiftDown',
    // 'ShiftUp',
    // 'CtrlDown',
    // 'CtrlUp',
    // 'LWinDown',
    // 'LWinUp',
    // 'RWinDown',
    // 'RWinUp',
    // 'Enter',
    // 'Escape',
    // 'Esc',
    // 'Space',
    // 'Tab',
    // 'Text',
    // 'PrintScreen',
    // 'Click 100, 200, 0',
};

// TODO send Key names https://www.autohotkey.com/docs/v1/lib/Send.htm#keynames
// https://www.autohotkey.com/docs/v1/lib/Send.htm#vk
