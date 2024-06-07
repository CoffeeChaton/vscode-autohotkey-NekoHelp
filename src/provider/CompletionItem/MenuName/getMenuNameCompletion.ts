import * as vscode from 'vscode';
import { pm } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import type { TMenuParam1stData } from '../../../tools/Built-in/7_sub_command/Menu/MenuName';
import { getMenuParam_Line, memoFileMenuRefMap } from '../../../tools/Built-in/7_sub_command/Menu/MenuName';
import { makeMarkDownLinkPos } from '../../../tools/MD/msgWithPos';

const itemMenuTray = new vscode.CompletionItem({
    label: 'Tray',
    description: 'MenuName',
}, vscode.CompletionItemKind.Variable);
itemMenuTray.detail = 'by-neko-help';
itemMenuTray.documentation = new vscode.MarkdownString(
    'The _MenuName_ parameter can be `Tray` or the name of any custom menu',
)
    .appendCodeblock('Menu, MenuName, SubCommand [, Value1, Value2, Value3, Value4]', 'ahk')
    .appendCodeblock(';     ^^^^^^^^', 'ahk')
    .appendMarkdown('[Read Doc](https://www.autohotkey.com/docs/v1/lib/Menu.htm)\n\n');

export function getMenuNameCompletion(
    uri: vscode.Uri,
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): vscode.CompletionItem[] {
    const m: TMenuParam1stData | null = getMenuParam_Line(AhkTokenLine);
    if (m !== null && m.range.contains(position)) {
        const need: vscode.CompletionItem[] = [itemMenuTray];
        const set = new Set<string>('TRAY');
        for (const AhkFileData of pm.getDocMapValue()) {
            const { fsPath } = AhkFileData.uri;
            for (const [k, v] of memoFileMenuRefMap.up(AhkFileData)) {
                if (set.has(k)) continue;
                set.add(k);

                const { rawName, range } = v[0];

                //
                if (fsPath === uri.fsPath && range.contains(position)) {
                    continue;
                }

                //
                const { line, character } = range.start;
                const item = new vscode.CompletionItem({
                    label: rawName,
                    description: 'MenuName',
                }, vscode.CompletionItemKind.Variable);
                item.detail = 'by-neko-help';
                item.documentation = new vscode.MarkdownString('', true)
                    .appendCodeblock('Menu, MenuName, SubCommand [, Value1, Value2, Value3, Value4]', 'ahk')
                    .appendCodeblock(';     ^^^^^^^^', 'ahk')
                    .appendMarkdown('[Read Doc](https://www.autohotkey.com/docs/v1/lib/Menu.htm)\n\n')
                    .appendMarkdown(`\n<${makeMarkDownLinkPos(fsPath, line, character)}>`);
                item.documentation.isTrusted = true;

                need.push(item);
            }
        }
        return need;
        //
    }
    return [];
}
