import * as vscode from 'vscode';
import type { TObject, TOther } from '../../../../script/make_vba_json';
import { $t } from '../../../i18n';
import { enumLog } from '../../../tools/enumErr';
import type { TVba2Map } from './type';

function vbaObj2LikeMethodSetKind(vbaKind: 'method' | 'property' | 'event'): vscode.CompletionItemKind | null {
    // dprint-ignore
    switch (vbaKind) {
        case 'method': return vscode.CompletionItemKind.Method;
        case 'property': return vscode.CompletionItemKind.Property;
        case 'event': return vscode.CompletionItemKind.Event;
        default:
            enumLog(vbaKind, 'vbaObj2LikeMethod');
            break;
    }
    return null;
}

export function vbaObj2LikeMethod(
    vbaKind: 'method' | 'property' | 'event',
    method_Like_array: string[],
    api_e: TObject,
    Vba2Map: TVba2Map,
): vscode.CompletionItem[] {
    const CompletionItemKind: vscode.CompletionItemKind | null = vbaObj2LikeMethodSetKind(vbaKind);

    const list: vscode.CompletionItem[] = [];

    for (const Method_name of method_Like_array) {
        const { api_nameMap } = Vba2Map;
        const searchKey = `${api_e.api_name}.${Method_name}`;
        const data: TOther | undefined = api_nameMap
            .get(searchKey.toUpperCase())
            ?.find((f): f is TOther => f.kind === vbaKind);
        if (data === undefined) continue;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(`${searchKey}()`, 'vba')
            .appendMarkdown(data.main)
            .appendCodeblock(
                data.Return_value.length === 0
                    ? ''
                    : `\n\n//may \nReturn ${JSON.stringify(data.Return_value, null, 2)}`,
                'js',
            )
            .appendMarkdown(
                `\n\n${$t('VBA.md.search.it')}${searchKey})`,
            )
            .appendMarkdown(
                `\n\n${$t('VBA.md.goto.doc')}${searchKey})`,
            );

        // https://learn.microsoft.com/en-us/office/vba/api/Excel.Application.ActivateMicrosoftApp
        // https://learn.microsoft.com/en-us/search/?terms=Excel.Application.ActivateMicrosoftApp

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: Method_name,
            description: 'VBA',
        });
        if (CompletionItemKind !== null) {
            item.kind = CompletionItemKind;
        }
        item.insertText = `${Method_name}(${data.Parameters.join(', ')})`;
        item.detail = 'by-neko-help (VBA-ex)';
        item.documentation = md;

        list.push(item);
    }
    return list;
}
