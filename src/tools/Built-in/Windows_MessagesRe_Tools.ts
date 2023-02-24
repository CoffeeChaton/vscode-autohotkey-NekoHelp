import * as vscode from 'vscode';
import { to0X, winMsgRe } from './Windows_Messages';

// https://www.autohotkey.com/docs/v1/Concepts.htm#numbers
function str2Number(str: string): number | null {
    if ((/^0x[\dA-F]+$/iu).test(str)) {
        // base 16
        // 0x1D: Hexadecimal
        return Number.parseInt(str, 16);
    }
    // if ((/^0o[0-7]+$/ui).test(str)) {
    //     // base 8
    //     // 0o35: Octal, denoted by an o
    //     return Number.parseInt(str, 8);
    // }
    // if ((/^0b[0-1]+$/ui).test(str)) {
    //     // base 2
    //     // 0b11101: Binary
    //     return Number.parseInt(str, 2);
    // }

    // !str.startsWith('0') wtf... ahk 001 === 1
    // https://www.autohotkey.com/docs/v1/Concepts.htm#numbers
    if ((/^\d+$/u).test(str)) {
        // base 10
        return Number.parseInt(str, 10);
    }
    return null;
}

export function numberFindWinMsg(wordUp: string): vscode.MarkdownString | null {
    const number: number | null = str2Number(wordUp);
    if (number === null || Number.isNaN(number)) {
        return null;
    }
    const msg: string[] | undefined = winMsgRe.get(number);
    if (msg === undefined) {
        return null;
    }
    // `${str} maybe is [${msg.join(', ')}] ?`
    const fail = ` := ${to0X(number)} ; ${number}\n`;
    const body: string = msg.join(fail) + fail;

    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown('Did you mean ?')
        .appendCodeblock(body, 'ahk')
        .appendMarkdown('\n\n')
        .appendMarkdown('[Read More of Windows Messages](https://www.autohotkey.com/docs/v1/misc/SendMessageList.htm)');
    md.supportHtml = true;

    return md;
}
