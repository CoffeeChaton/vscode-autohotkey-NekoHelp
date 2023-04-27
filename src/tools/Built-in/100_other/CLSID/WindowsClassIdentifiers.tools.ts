/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../../globalEnum';
import { WindowsClassIdentifiersData } from './WindowsClassIdentifiers.data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const { snippetCLSID, CLSIDMap } = (() => {
    const list: vscode.CompletionItem[] = [];
    const map = new Map<string, vscode.MarkdownString>();

    const doc: string = [
        'CLSID List [(Windows Class Identifiers)](https://www.autohotkey.com/docs/v1/misc/CLSID-List.htm)',
        '',
        '',
        'Certain special folders within the operating system are identified by unique strings. Some of these strings can be used with',
        '- [FileSelectFile](https://www.autohotkey.com/docs/v1/lib/FileSelectFile.htm)',
        '- [FileSelectFolder](https://www.autohotkey.com/docs/v1/lib/FileSelectFolder.htm)',
        '- [Run](https://www.autohotkey.com/docs/v1/lib/Run.htm)',
        '',
        'For example:',
        '',
        '```ahk',
        'FileSelectFile, OutputVar,, ::{645ff040-5081-101b-9f08-00aa002f954e} ; Select a file in the Recycle Bin.',
        'FileSelectFolder, OutputVar, ::{20d04fe0-3aea-1069-a2d8-08002b30309d} ; Select a folder within My Computer.',
        '```',
        '',
        '',
        '### ahk-neko-help',
        '',
        'you can key `:` at `Run` / `FileSelectFolder` / `FileSelectFile` line to Completion [(youtube 4K)](https://www.autohotkey.com/docs/v1/misc/CLSID-List.htm).',
    ].join('\n');

    for (const [CLSID, Location] of WindowsClassIdentifiersData) {
        const k2: string = Location.replaceAll(' ', '_');

        const body = `${k2} := "${CLSID}"`;

        const md: vscode.MarkdownString = new vscode.MarkdownString('### Windows Class Identifiers', true);
        md.supportHtml = true;

        md.appendMarkdown('\n\n')
            .appendCodeblock(body, 'ahk')
            .appendMarkdown('\n\n')
            .appendMarkdown(doc);

        map.set(CLSID.toUpperCase(), md);

        const item = new vscode.CompletionItem({
            label: Location, // Left
            description: 'CLSID', // Right
        });
        item.kind = vscode.CompletionItemKind.Variable;
        item.insertText = new vscode.SnippetString(`${CLSID.replace(/^:/u, '')} ; ${Location}`);

        item.detail = 'CLSID (neko-help)'; // description
        item.documentation = md;

        list.push(item);
    }

    WindowsClassIdentifiersData.length = 0;

    return {
        snippetCLSID: list as readonly vscode.CompletionItem[],
        CLSIDMap: map as ReadonlyMap<string, vscode.MarkdownString>,
    };
})();

export function getSnippetCLSID(
    AhkTokenLine: TAhkTokenLine,
    _position: vscode.Position,
    context: vscode.CompletionContext,
): readonly vscode.CompletionItem[] {
    const { fistWordUp } = AhkTokenLine;
    if (
        [
            'FILESELECTFILE',
            'FILESELECTFOLDER',
            'RUN',
        ].includes(fistWordUp)
        && context.triggerCharacter === ':'
    ) {
        return snippetCLSID;
    }

    return [];
}

export function hoverWindowsClassIdentifiers(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): vscode.MarkdownString | null {
    //
    const { textRaw } = AhkTokenLine;

    const i: number = textRaw.indexOf('::{');
    if (i === -1) return null;

    const len = 40; // '::{bdeadf00-c265-11d0-bced-00a0c90ab50f}'.length

    const { character } = position;
    if (character < i || character > i + len) return null;

    const partStr: string = textRaw.slice(i, i + len).toUpperCase();

    return CLSIDMap.get(partStr) ?? null;
}
