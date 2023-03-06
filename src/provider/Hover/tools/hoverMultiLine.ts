import * as vscode from 'vscode';
import type { TPos, TTokenStream } from '../../../globalEnum';
import { EMultiline } from '../../../globalEnum';

// https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section
const mdOfMultiLine116: vscode.MarkdownString = new vscode.MarkdownString('', true)
    .appendMarkdown(
        [
            '### Multi-line ([Read Doc](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section))',
            '- **Method #2**: This method should be used to merge a large number of lines or when the lines are not suitable for Method #1.',
            'Although this method is especially useful for [auto-replace hotStrings](https://www.autohotkey.com/docs/v1/Hotstrings.htm)',
            ', it can also be used with any command or [expression](https://www.autohotkey.com/docs/v1/Variables.htm#Expressions).',
            '',
            '',
            'The default behavior of a continuation section can be overridden by including one or more of the following options to the right of the section\'s opening parenthesis. If more than one option is present, separate each one from the previous with a space. For example: `( LTrim Join| %`.',
            '',
            '- Join',
            '- LTrim',
            '- RTrim0',
            '- Comments (or Comment or Com or C)',
            '- % (percent sign)',
            '- , (comma)',
            '- ` (accent)',
            '',
            '',
            '- **some example**: of [AutoHotkey_L-Docs](https://github.com/Lexikos/AutoHotkey_L-Docs/blob/master/compile_chm.ahk#L52)',
            '',
            '',
        ].join('\n'),
    )
    .appendCodeblock(
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

const mdOfMultiJoin: vscode.MarkdownString = new vscode.MarkdownString('', true)
    .appendMarkdown(
        [
            '### Multi-line Join ([Read Doc](https://www.autohotkey.com/docs/v1/Scripts.htm#Join))\n\n',
            '',
            '**Join**: Specifies how lines should be connected together. If this option is omitted, each line except the last will be followed by a linefeed character (\\`n). If the word _Join_ is specified by itself, lines are connected directly to each other without any characters in between. Otherwise, the word _Join_ should be followed immediately by as many as `15` characters. For example, ``Join`s`` would insert a space after each line except the last ("\\`s" indicates a literal space -- it is a special escape sequence recognized only by _Join_). Another example is ``Join`r`n``, which inserts CR+LF between lines. Similarly, `Join|` inserts a pipe between lines. To have the final line in the section also ended by a join-string, include a blank line immediately above the section\'s closing parenthesis.',
            '',
            '',
            // '[look diag](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/code121.md)',
            // '![warn-img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/note/img/diag121.png)',
        ].join('\n'),
    );

const mdOfMultiLTrim: vscode.MarkdownString = new vscode.MarkdownString('', true)
    .appendMarkdown(
        [
            '### Multi-line LTrim ([Read Doc](https://www.autohotkey.com/docs/v1/Scripts.htm#LTrim))\n\n',
            '',
            '**LTrim**: Omits spaces and tabs at the beginning of each line. This is primarily used to allow the continuation section to be indented. Also, this option may be turned on for multiple continuation sections by specifying [`#LTrim`](https://www.autohotkey.com/docs/v1/Scripts.htm#LTrim) on a line by itself. [`#LTrim`](https://www.autohotkey.com/docs/v1/Scripts.htm#LTrim) is positional: it affects all continuation sections physically beneath it. The setting may be turned off via [`#LTrim`](https://www.autohotkey.com/docs/v1/Scripts.htm#LTrim) Off.',
            '',
            '',
        ].join('\n'),
    );

const mdOfMultiC: vscode.MarkdownString = new vscode.MarkdownString('', true)
    .appendMarkdown(
        [
            '### Multi-line C ([Read Doc](https://www.autohotkey.com/docs/v1/Scripts.htm#CommentOption))\n\n',
            '',
            '**Comments** (or **Comment** or **Com** or **C**) [[v1.0.45.03+]](https://www.autohotkey.com/docs/v1/ChangeLogHelp.htm#v1.0.45.03 "Applies to AutoHotkey v1.0.45.03 and later"): Allows [semicolon comments](https://www.autohotkey.com/docs/v1/Language.htm#comments) inside the continuation section (but not `/*..*/`). Such comments (along with any spaces and tabs to their left) are entirely omitted from the joined result rather than being treated as literal text. Each comment can appear to the right of a line or on a new line by itself.',
            '',
            '',
        ].join('\n'),
    );

export function hoverMultiLine(DocStrMap: TTokenStream, position: vscode.Position): vscode.MarkdownString | null {
    const {
        multiline,
        multilineFlag,
    } = DocStrMap[position.line];
    if (multiline !== EMultiline.start) return null;
    if (multilineFlag === null) return null;

    const { character } = position;
    const {
        L,
        R,
        Join,
        LTrim,
        CommentFlag,
    } = multilineFlag;

    if (!(character >= L && character < R)) return null;

    if (character === L) return mdOfMultiLine116; // at '('

    type TMatch = [readonly TPos[], vscode.MarkdownString];
    const arr: readonly TMatch[] = [
        [Join, mdOfMultiJoin],
        [LTrim, mdOfMultiLTrim],
        [CommentFlag, mdOfMultiC],
    ];

    for (const [list, md] of arr) {
        for (const { col, len } of list) {
            if (character >= col && character < col + len) {
                return md;
            }
        }
    }

    return mdOfMultiLine116; // guard
}
