import * as vscode from 'vscode';
import type { TEnum } from '../../../../../script/make_vba_json';
import { $t } from '../../../../i18n';
import { CVbaCompletionItem } from './CVbaCompletionItem';

export function vbaEnum2Completion(api_e: TEnum, filePath: string): CVbaCompletionItem[] {
    const list: CVbaCompletionItem[] = [];

    const data = api_e;

    const searchKey: string = api_e.api_name;
    const shareStr: string = [
        // api_e.api_name,
        data.main,
        '',
        `[${$t('VBA.md.search.it.txt')}](${$t('VBA.md.search.it.uri')}${searchKey})`,
        '',
        `[${$t('VBA.md.goto.doc.txt')}](${$t('VBA.md.goto.doc.uri')}${searchKey})`,
        // https://learn.microsoft.com/en-us/office/vba/api/Excel.Application.ActivateMicrosoftApp
        // https://learn.microsoft.com/en-us/search/?terms=Excel.Application.ActivateMicrosoftApp
        '',
        '```ahk',
        `dev_id := "${data.file_name}"\nfile := "${filePath}"`,
        '```',
    ].join('\n');

    for (const enum_chs of api_e.enum_ch) {
        const md: vscode.MarkdownString = new vscode.MarkdownString(`${searchKey}.${enum_chs}\n\n${shareStr}`, true);

        const item: CVbaCompletionItem = new CVbaCompletionItem(
            enum_chs,
            'VBA',
            vscode.CompletionItemKind.EnumMember,
            md,
        );

        list.push(item);
    }

    return list;
}
