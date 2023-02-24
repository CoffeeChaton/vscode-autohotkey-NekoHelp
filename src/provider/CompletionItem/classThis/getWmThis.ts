import * as vscode from 'vscode';
import type { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import type { TAhkFileData } from '../../../core/ProjectManager';
import { pm } from '../../../core/ProjectManager';
import type { TTokenStream } from '../../../globalEnum';
import { CMemo } from '../../../tools/CMemo';
import { getDocStrMapMask } from '../../../tools/getDocStrMapMask';

const WmThis = new CMemo<CAhkClass, vscode.CompletionItem[]>((AhkClassSymbol: CAhkClass): vscode.CompletionItem[] => {
    const { fsPath } = AhkClassSymbol.uri;
    const AhkFileData: TAhkFileData | undefined = pm.getDocMap(fsPath);
    if (AhkFileData === undefined) return [];
    const { DocStrMap } = AhkFileData;
    const AhkTokenList: TTokenStream = getDocStrMapMask(AhkClassSymbol.range, DocStrMap);

    const mapStrNumber = new Map<string, number>();

    for (const { lStr, line } of AhkTokenList) {
        for (const ma of lStr.matchAll(/\bthis\.(\w+)\b(?!\()/giu)) {
            const valName = ma[1];
            if (!mapStrNumber.has(valName)) {
                mapStrNumber.set(valName, line);
            }
        }
    }

    const itemS: vscode.CompletionItem[] = [];
    for (const [label, line] of mapStrNumber) {
        const item = new vscode.CompletionItem({ label, description: 'this' }, vscode.CompletionItemKind.Value);
        item.detail = 'neko help : class > this';
        item.documentation = new vscode.MarkdownString(AhkClassSymbol.name, true)
            .appendMarkdown(`\n\n    this.${label}\n\n`)
            .appendMarkdown(`line   ${line + 1}  of  ${fsPath}`);
        itemS.push(item);
    }
    return itemS;
});

export function getWmThis(AhkClassSymbol: CAhkClass): vscode.CompletionItem[] {
    return WmThis.up(AhkClassSymbol);
}
