import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { EDetail } from '../../../globalEnum';
import { getDAListTop } from '../../../tools/DeepAnalysis/getDAList';

function getNextFuncLine(
    AhkFileData: TAhkFileData,
    thisAhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
    context: vscode.CompletionContext,
): number {
    // quick filter
    if (context.triggerCharacter !== '@') return -1;
    const { lStr, textRaw } = thisAhkTokenLine;
    if (lStr.trim() !== '') return -1;

    const leftTextRaw: string = textRaw.slice(0, position.character);
    if (!(/^\s*[*;]\s*@$/u).test(leftTextRaw)) return -1;
    //

    const { DocStrMap } = AhkFileData;
    const { length } = DocStrMap;
    let i: number = position.line + 1;
    for (i = position.line + 1; i < length; i++) {
        const AhkTokenLine: TAhkTokenLine = DocStrMap[i];
        const { detail } = AhkTokenLine;
        if (!detail.includes(EDetail.inComment)) {
            break;
        }
    }
    i++;
    const AhkTokenLine: TAhkTokenLine | undefined = DocStrMap.at(i);
    if (AhkTokenLine === undefined) return -1;
    return AhkTokenLine.line;
}

export function ahkDocCompletions(
    AhkFileData: TAhkFileData,
    thisAhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
    context: vscode.CompletionContext,
): vscode.CompletionItem[] {
    const NextFuncLine: number = getNextFuncLine(AhkFileData, thisAhkTokenLine, position, context);
    if (NextFuncLine === -1) return [];

    const { AST } = AhkFileData;
    const DAList: readonly CAhkFunc[] = getDAListTop(AST);
    const DA: CAhkFunc | undefined = DAList
        .find((ahkFunc: CAhkFunc): boolean => (ahkFunc.range.start.line === NextFuncLine));
    if (DA === undefined) return [];

    const list: vscode.CompletionItem[] = [];

    for (const v of DA.paramMap.values()) {
        const { keyRawName } = v;
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: `@parma ${keyRawName}`,
            description: DA.name,
        });
        item.kind = vscode.CompletionItemKind.Keyword;
        item.insertText = new vscode.SnippetString(`parma {\${1:*}} ${keyRawName} \${2:information}`);
        item.detail = 'by-neko-help';

        list.push(item);
    }

    return list;
}
//
