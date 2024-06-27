import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { EDetail } from '../../../globalEnum';
import { initNlsDefMap, readNlsJson } from '../nls_json.tools';
import type { TAhk2exeDataElement } from './Ahk2exe.data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const ahk2Exe = (() => {
    const Ahk2exeMdMapRW = new Map<string, vscode.MarkdownString>();
    const snippetAhk2exeRW: vscode.CompletionItem[] = [];
    const snippetAhk2exeKeepRW: vscode.CompletionItem[] = [];
    //
    const Ahk2exeData: TAhk2exeDataElement[] = readNlsJson('Ahk2exeData') as TAhk2exeDataElement[];

    for (const v of Ahk2exeData) {
        const {
            keyRawName,
            link,
            doc,
            exp,
            body,
        } = v;

        const msgName = keyRawName === 'Keep'
            ? '@Ahk2Exe-Keep'
            : `;@Ahk2Exe-${keyRawName}`;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(msgName, 'ahk')
            .appendMarkdown(`Script Compiler Directives ([Read Doc](${link}))`)
            .appendMarkdown('\n\n')
            .appendMarkdown(doc.join('\n'))
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');
        md.supportHtml = true;

        Ahk2exeMdMapRW.set(keyRawName.toUpperCase(), md);
        //

        if (keyRawName === 'Bin') continue;

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: msgName,
            description: 'Compiler',
        });
        item.kind = vscode.CompletionItemKind.Snippet; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = new vscode.SnippetString(body.replace(';@', ''));
        item.detail = 'Script Compiler Directives (neko-help)';
        item.documentation = md;

        if (keyRawName === 'Keep') {
            snippetAhk2exeKeepRW.push(item);
        } else {
            snippetAhk2exeRW.push(item);
        }
    }

    return {
        Ahk2exeMdMapRW,
        snippetAhk2exeRW,
        snippetAhk2exeKeepRW,
    };
})();

const Ahk2exe_MdMap: ReadonlyMap<string, vscode.MarkdownString> = ahk2Exe.Ahk2exeMdMapRW;
export const Ahk2exe_snip_Line: readonly vscode.CompletionItem[] = ahk2Exe.snippetAhk2exeRW;
export const Ahk2exe_snip_Keep: readonly vscode.CompletionItem[] = ahk2Exe.snippetAhk2exeKeepRW;

type TRangeAndKeyUp = {
    upKey: string,
    md: vscode.MarkdownString,
    /**
     * hover of position
     */
    range: vscode.Range,
};

function getAhk2exeMeta(AhkTokenLine: TAhkTokenLine, position: vscode.Position): TRangeAndKeyUp | null {
    if (!AhkTokenLine.detail.includes(EDetail.inComment)) return null;

    const { textRaw } = AhkTokenLine;
    const commentStr: string = textRaw.trimStart();
    const lStrLen: number = textRaw.length - commentStr.length;
    const maAhk2exe: RegExpMatchArray | null = commentStr.match(/^;@ahk2exe-(\S+)/iu);
    if (maAhk2exe !== null) {
        const col: number = lStrLen + maAhk2exe[0].length;
        const { character, line } = position;
        if (character > lStrLen && character < col) {
            const upKey: string = maAhk2exe[1].toUpperCase();
            const md: vscode.MarkdownString | undefined = Ahk2exe_MdMap.get(upKey);
            if (md !== undefined) {
                return {
                    upKey,
                    md,
                    range: new vscode.Range(
                        new vscode.Position(line, lStrLen),
                        new vscode.Position(line, col),
                    ),
                };
            }
        }

        return null;
    }

    //  `/*@Ahk2Exe-Keep`
    const maAhk2exeKeep: RegExpMatchArray | null = commentStr.match(/\/\*@Ahk2Exe-Keep\b/iu);
    if (maAhk2exeKeep !== null) {
        const col = lStrLen + maAhk2exeKeep[0].length;
        const { character, line } = position;
        if (character > lStrLen && character < col) {
            const upKey = 'KEEP';
            const md: vscode.MarkdownString | undefined = Ahk2exe_MdMap.get(upKey);
            if (md !== undefined) {
                return {
                    upKey,
                    md,
                    range: new vscode.Range(
                        new vscode.Position(line, lStrLen),
                        new vscode.Position(line, col),
                    ),
                };
            }
        }

        return null;
    }

    return null;
}

export function hoverAhk2exe(AhkTokenLine: TAhkTokenLine, position: vscode.Position): vscode.Hover | null {
    const meta: TRangeAndKeyUp | null = getAhk2exeMeta(AhkTokenLine, position);
    return meta === null
        ? null
        : new vscode.Hover(meta.md, meta.range);
}

const Ahk2ExeDefMap: ReadonlyMap<string, [vscode.Location]> = initNlsDefMap('Ahk2exeData');

/**
 * goto `;@ahk2exe-set` def-json
 */
export function gotoDefAhk2exe(AhkTokenLine: TAhkTokenLine, position: vscode.Position): [vscode.Location] | null {
    const meta: TRangeAndKeyUp | null = getAhk2exeMeta(AhkTokenLine, position);
    if (meta === null) return null;

    return Ahk2ExeDefMap.get(meta.upKey) ?? null;
}
