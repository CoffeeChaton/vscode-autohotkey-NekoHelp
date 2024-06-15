import type * as vscode from 'vscode';
import { nekoExComment, nekoFormatIgnoreBlock } from '../../../tools/Built-in/100_other/nekoEx/nekoExComment.tool';
import { snippetAhk2exeKeep, snippetAhk2exeLine } from '../../../tools/Built-in/99_Ahk2Exe_compiler/Ahk2exe.tools';

export function getCommentCompletion(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] | null {
    const subStr: string = document.lineAt(position.line).text.slice(0, position.character);

    if ((/^\s*\/\*@$/u).test(subStr)) {
        return [...snippetAhk2exeKeep, nekoFormatIgnoreBlock];
    }

    return (/^\s*;@$/u).test(subStr)
        ? [...nekoExComment, ...snippetAhk2exeLine]
        : null;
}
