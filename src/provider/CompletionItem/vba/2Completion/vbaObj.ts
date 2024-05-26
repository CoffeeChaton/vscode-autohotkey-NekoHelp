import * as vscode from 'vscode';
import type { TObject, TOther } from '../../../../../script/make_vba_json';
import { $t } from '../../../../i18n';
import { enumLog } from '../../../../tools/enumErr';
import type { TVba2Map } from '../type';
import { CVbaCompletionItem } from './CVbaCompletionItem';

function vbaObj2LikeMethodSetKind(vbaKind: 'method' | 'property' | 'event'): vscode.CompletionItemKind {
    // dprint-ignore
    switch (vbaKind) {
        case 'method': return vscode.CompletionItemKind.Method;
        case 'property': return vscode.CompletionItemKind.Property;
        case 'event': return vscode.CompletionItemKind.Event;
        default:
            enumLog(vbaKind, 'vbaObj2LikeMethod');
            break;
    }
    // never path...
    return vscode.CompletionItemKind.Text;
}

export function vbaObj2Completion(
    vbaKind: 'method' | 'property' | 'event',
    method_Like_array: string[],
    api_e: TObject,
    Vba2Map: TVba2Map,
    filePath: string,
): CVbaCompletionItem[] {
    const CompletionItemKind: vscode.CompletionItemKind = vbaObj2LikeMethodSetKind(vbaKind);

    const list: CVbaCompletionItem[] = [];

    for (const Method_name of method_Like_array) {
        const { api_nameMap } = Vba2Map;
        const searchKey = `${api_e.api_name}.${Method_name}`;
        const data: TOther | undefined = api_nameMap
            .get(searchKey.toUpperCase())
            ?.find((f): f is TOther => f.kind === vbaKind);
        if (data === undefined) continue;
        const arrStr: string = [
            '```vba',
            `${searchKey}()`,
            '```',
            data.main,
            '',
            '```js',
            data.Return_value.length === 0
                ? ''
                : `\n//may \nReturn ${JSON.stringify(data.Return_value, null, 2)}`,
            '```',
            '',
            `[${$t('VBA.md.search.it.txt')}](${$t('VBA.md.search.it.uri')}${searchKey})`,
            '',
            `[${$t('VBA.md.goto.doc.txt')}](${$t('VBA.md.goto.doc.uri')}${searchKey})`,
            '```ahk',
            `dev_id := "${data.file_name}"\nfile := "${filePath}"`,
            '```',
        ].join('\n');
        const md: vscode.MarkdownString = new vscode.MarkdownString(arrStr, true);

        // https://learn.microsoft.com/en-us/office/vba/api/Excel.Application.ActivateMicrosoftApp
        // https://learn.microsoft.com/en-us/search/?terms=Excel.Application.ActivateMicrosoftApp

        const item: CVbaCompletionItem = new CVbaCompletionItem(
            Method_name,
            'VBA',
            CompletionItemKind,
            md,
        );

        item.insertText = vbaKind === 'property' && data.Parameters.length === 0
            ? Method_name
            : `${Method_name}(${data.Parameters.join(', ')})`;

        list.push(item);
    }
    return list;
}
