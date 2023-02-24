import * as vscode from 'vscode';
import type { C506Class } from '../../Diagnostic/tools/CDiagFnLib/C506Class';

export function c506CodeAction(uri: vscode.Uri, diag: C506Class): vscode.CodeAction[] {
    const { range, keyUpName } = diag;

    const baseOf: '0b' | '0o' = keyUpName.startsWith('0B')
        ? '0b' // base 2
        : '0o'; // base 8

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
    // js safe integer is 2^53 -1

    // i want to be conservative of ahk 32-bit integer
    // 2**30 === 8**10 === ((2)**3)**10

    // eslint-disable-next-line no-magic-numbers
    if (baseOf === '0b' && keyUpName.length > 30) {
        return []; // i think "str.length > 30" is edge cases...
    }

    // eslint-disable-next-line no-magic-numbers
    if (baseOf === '0o' && keyUpName.length > 10) {
        return []; // i think "str.length > 16" is edge cases...
    }

    const keyName: string = baseOf === '0b'
        ? keyUpName.replace('0B', '0b')
        : keyUpName.replace('0O', '0o');

    const base10: number = baseOf === '0b'
        ? Number.parseInt(keyName, 2)
        : Number.parseInt(keyName, 8);

    const title = `replace "${keyName}" to "${base10}"`;
    const CA0 = new vscode.CodeAction(title);
    CA0.kind = vscode.CodeActionKind.QuickFix;
    CA0.edit = new vscode.WorkspaceEdit();
    // eslint-disable-next-line @fluffyfox/string/no-simple-template-literal
    CA0.edit.replace(uri, range, `${base10}`);

    return [CA0];
}
