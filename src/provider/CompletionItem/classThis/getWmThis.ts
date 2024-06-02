import * as vscode from 'vscode';
import type { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import type { TAhkFileData } from '../../../core/ProjectManager';
import { pm } from '../../../core/ProjectManager';
import type { TTokenStream } from '../../../globalEnum';
import { CMemo } from '../../../tools/CMemo';
import { getDocStrMapMask } from '../../../tools/getDocStrMapMask';
import { ToUpCase } from '../../../tools/str/ToUpCase';

export type TWmThisPos = Readonly<{
    rawName: string,
    line: number,
    col: number,
}>;
type TWmThisMap = ReadonlyMap<string, readonly TWmThisPos[]>;

export const WmThisCore = new CMemo<CAhkClass, TWmThisMap>(
    (AhkClassSymbol: CAhkClass): TWmThisMap => {
        const { fsPath } = AhkClassSymbol.uri;
        const map = new Map<string, TWmThisPos[]>();

        const AhkFileData: TAhkFileData | undefined = pm.getDocMap(fsPath);
        if (AhkFileData === undefined) return map;
        const { DocStrMap } = AhkFileData;
        const AhkTokenList: TTokenStream = getDocStrMapMask(AhkClassSymbol.range, DocStrMap);

        for (const { lStr, line } of AhkTokenList) {
            for (
                const ma of lStr.matchAll(
                    /\bthis\.([#$@\w\u{A1}-\u{FFFF}]+)(?=[#$@.`%!"/&')*+,\-:;<=>?[\\^\]{|}~ \t]|$)/giu,
                )
                //                                                                 ^ with out (
            ) {
                const col: number = (ma.index ?? 0) + 'this.'.length;
                const rawName: string = ma[1];
                const upName: string = ToUpCase(rawName);
                const oldArr: TWmThisPos[] = map.get(upName) ?? [];
                oldArr.push({ rawName, line, col });
                map.set(upName, oldArr);
            }
        }
        return map;
    },
);

const WmThis = new CMemo<CAhkClass, vscode.CompletionItem[]>((AhkClassSymbol: CAhkClass): vscode.CompletionItem[] => {
    const map: TWmThisMap = WmThisCore.up(AhkClassSymbol);

    const { fsPath } = AhkClassSymbol.uri;
    const itemS: vscode.CompletionItem[] = [];
    for (const v of map.values()) {
        const { line, col, rawName } = v[0];
        const item = new vscode.CompletionItem(
            { label: rawName, description: 'this' },
            vscode.CompletionItemKind.Value,
        );
        item.detail = 'neko help : class > this';
        item.documentation = new vscode.MarkdownString(AhkClassSymbol.name, true)
            .appendMarkdown(`\n\n    this.${rawName}\n\n`)
            .appendMarkdown(`Ln ${line + 1}, Col ${col + 1}  of  ${fsPath}`);
        itemS.push(item);
    }
    return itemS;
});

export function getWmThis(AhkClassSymbol: CAhkClass): vscode.CompletionItem[] {
    return WmThis.up(AhkClassSymbol);
}
