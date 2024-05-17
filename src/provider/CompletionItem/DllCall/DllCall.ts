import * as vscode from 'vscode';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TSignatureFuncMeta } from '../../SignatureHelpProvider/SignatureFunc';
import { SignatureFuncCore } from '../../SignatureHelpProvider/SignatureFunc';

const DllCallCompletion: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    const DllCallType = [
        'Str',
        'AStr',
        'WStr',

        'Int64',
        'Int',
        'UInt',
        'UInt64',

        'Short',
        'UShort',

        'Char',
        'UChar',

        'Float',
        'Double',

        'Ptr',
        'UPtr',
    ] as const;
    type T = typeof DllCallType[number];

    const allMdArr: string[] = [
        'about `DllCall()` type [(Read More)](https://www.autohotkey.com/docs/v1/lib/DllCall.htm#types)',
        '',
        '| ahk  | ',
        '| ---- |',
        '| Str |',
        '| AStr |',
        '| WStr |',
        '| Int64 |',
        '| Int |',
        '| UInt |',
        '| UInt64 |',
        '| Short |',
        '| UShort |',
        '| Char |',
        '| UChar |',
        '| Float |',
        '| Double |',
        '| Ptr |',
        '| UPtr |',
        '',
        '---',
        '',
        'about `str` [(Read More)](https://www.autohotkey.com/docs/v1/Compat.htm#DllCall)',
        '',
        '| ahk  | Char Size | C / Win32 Types                      | Encoding                                                              |',
        '| ---- | --------- | ------------------------------------ | --------------------------------------------------------------------- |',
        '| WStr | 16-bit    | wchar\\_t\\*, WCHAR\\*, LPWSTR, LPCWSTR | UTF-16                                                                |',
        '| AStr | 8-bit     | char\\*, CHAR\\*, LPSTR, LPCSTR        | ANSI (the system default ANSI code page)                              |',
        '| Str  | \\--       | TCHAR\\*, LPTSTR, LPCTSTR             | Equivalent to **WStr** in Unicode builds and **AStr** in ANSI builds. |',
    ];
    const allMd = new vscode.MarkdownString(allMdArr.join('\n'), true); //
    //
    return DllCallType.map((v: T): vscode.CompletionItem => {
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: v,
            description: 'DllCall type',
        });
        item.documentation = allMd;
        item.insertText = `"${v}"`;
        item.kind = vscode.CompletionItemKind.TypeParameter;
        item.detail = 'by-neko-help';
        return item;
    });
})();

export function getDllCallCompletion(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
): readonly vscode.CompletionItem[] {
    const need: TSignatureFuncMeta | null = SignatureFuncCore(AhkFileData, position);
    if (need === null || !need.isBiFunc) return [];

    const { comma, biFuncMsg } = need;
    if (biFuncMsg.keyRawName !== 'DllCall') return [];
    if (comma === 0) return []; // add something ?
    if (comma % 2 === 0) return [];
    // check ?
    //
    return DllCallCompletion;
}
