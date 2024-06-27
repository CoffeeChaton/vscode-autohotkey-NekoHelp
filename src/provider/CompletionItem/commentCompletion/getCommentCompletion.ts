import type * as vscode from 'vscode';
import { nekoExComment, nekoFormatIgnoreBlock } from '../../../tools/Built-in/100_other/nekoEx/nekoExComment.tool';
import { Ahk2exe_snip_Keep, Ahk2exe_snip_Line } from '../../../tools/Built-in/99_Ahk2Exe_compiler/Ahk2exe.tools';

export function getCommentCompletion(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] | null {
    const subStr: string = document.lineAt(position.line).text.slice(0, position.character);

    if ((/^\s*\/\*@$/u).test(subStr)) {
        return [...Ahk2exe_snip_Keep, nekoFormatIgnoreBlock];
    }

    return (/^\s*;@$/u).test(subStr)
        ? [...nekoExComment, ...Ahk2exe_snip_Line]
        : null;
}
