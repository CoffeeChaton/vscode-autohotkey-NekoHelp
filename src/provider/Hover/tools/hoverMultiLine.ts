import * as vscode from 'vscode';
import type { TTokenStream } from '../../../globalEnum';
import { EMultiline } from '../../../globalEnum';

// https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section
const mdOfMultiLine116: vscode.MarkdownString = new vscode.MarkdownString('', true);

mdOfMultiLine116.appendMarkdown(
    [
        '### Multi-line ([Read Doc](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section))\n\n',
        '**Method #2**: This method should be used to merge a large number of lines or when the lines are not suitable for Method #1.',
        'Although this method is especially useful for [auto-replace hotStrings](https://www.autohotkey.com/docs/v1/Hotstrings.htm)',
        ', it can also be used with any command or [expression](https://www.autohotkey.com/docs/v1/Variables.htm#Expressions).\n\n',
        '**some example**: of [AutoHotkey_L-Docs](https://github.com/Lexikos/AutoHotkey_L-Docs/blob/master/compile_chm.ahk#L52)',
        '\n\n',
    ].join(''),
);

mdOfMultiLine116.appendCodeblock(
    [
        'output =',
        '( LTrim',
        '<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">',
        '<html lang="en">',
        '<body>',
        '<object type="text/site properties">',
        '<param name="Window Styles" value="0x800025">',
        '<param name="ImageType" value="Folder">',
        '</object>',
        ')',
    ].join('\n'),
    'ahk',
);

export function hoverMultiLine(DocStrMap: TTokenStream, position: vscode.Position): vscode.MarkdownString | null {
    const { multiline, multilineFlag } = DocStrMap[position.line];
    if (multiline !== EMultiline.start) return null;
    if (multilineFlag === null) return null;

    return position.character >= multilineFlag.L && position.character < multilineFlag.R
        ? mdOfMultiLine116
        : null;
}
