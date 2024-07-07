import * as vscode from 'vscode';
import type { CAhkClass, TClassChildren } from '../../../AhkSymbol/CAhkClass';

import { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../../core/ProjectManager';
import { getFileAllClass } from '../../visitor/getFileAllClassList';
import { class_meta_method } from './class_meta_method.data';

type TClass_meta_method_snip = ReadonlyMap<string, vscode.CompletionItem>;
type TClass_meta_method_MDMap = ReadonlyMap<string, vscode.MarkdownString>;

const temp_class_meta_method: [TClass_meta_method_snip, TClass_meta_method_MDMap] = (
    (): [TClass_meta_method_snip, TClass_meta_method_MDMap] => {
        const map1 = new Map<string, vscode.MarkdownString>();
        const snip_map = new Map<string, vscode.CompletionItem>();

        for (const v of class_meta_method) {
            const {
                keyRawName,
                insert,
                doc,
                uri,
            } = v;
            const upName: string = keyRawName.toUpperCase().replace('()', '');
            const md: vscode.MarkdownString = new vscode.MarkdownString('class method', true)
                .appendCodeblock(keyRawName, 'ahk')
                .appendMarkdown(`[(Read Doc)](${uri})\n\n`)
                .appendMarkdown(doc.join('\n'));
            md.supportHtml = true;

            map1.set(upName, md);

            const snip = new vscode.CompletionItem({
                label: keyRawName,
                description: 'class method',
            });
            snip.insertText = new vscode.SnippetString(insert);
            snip.documentation = md;
            snip_map.set(upName, snip);
        }

        return [snip_map, map1];
    }
)();

const Class_meta_method_snip: TClass_meta_method_snip = temp_class_meta_method[0];
export const Class_meta_method_MDMap: TClass_meta_method_MDMap = temp_class_meta_method[1];

export function getSnipClass_meta_method(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
): vscode.CompletionItem[] {
    const { AST } = AhkFileData;
    const classList: readonly CAhkClass[] = getFileAllClass(AST);
    const ahk_class: CAhkClass | undefined = classList.find((cc: CAhkClass): boolean => cc.range.contains(position));
    if (ahk_class === undefined) return []; // not in class

    const { children } = ahk_class;

    const chList: readonly string[] = children
        .filter((cc: TClassChildren): cc is CAhkFunc => cc instanceof CAhkFunc)
        .map((cc: CAhkFunc): string => cc.upName);

    // pos in Method | TLineClass
    if (children.some((cc: TClassChildren): boolean => cc.range.contains(position))) {
        return [];
    }

    const snipList: vscode.CompletionItem[] = [];
    for (const [k, v] of Class_meta_method_snip) {
        if (!chList.includes(k)) {
            snipList.push(v);
        }
    }

    return snipList;
}
