import * as vscode from 'vscode';
import type { CAhkClass, TClassChildren } from '../../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { getUserDefTopClassSymbol } from '../../../tools/DeepAnalysis/getUserDefTopClassSymbol';

function getKindOfCh(kind: vscode.SymbolKind): vscode.CompletionItemKind {
    // dprint-ignore
    switch (kind) {
        case vscode.SymbolKind.Class: return vscode.CompletionItemKind.Class;
        case vscode.SymbolKind.Method: return vscode.CompletionItemKind.Method;
        case vscode.SymbolKind.Property: return vscode.CompletionItemKind.Property;
        case vscode.SymbolKind.Variable: return vscode.CompletionItemKind.Variable;
        default: return vscode.CompletionItemKind.User;
    }
}

function wrapItem(
    AhkSymbol: TClassChildren,
    track: string[],
): vscode.CompletionItem {
    const item: vscode.CompletionItem = new vscode.CompletionItem(AhkSymbol.name.trim(), getKindOfCh(AhkSymbol.kind));
    item.detail = 'neko help; (wrapClass)';
    if (AhkSymbol instanceof CAhkFunc) {
        item.documentation = AhkSymbol.md;
        item.label = AhkSymbol.selectionRangeText;
        item.insertText = AhkSymbol.selectionRangeText;
        return item;
    }

    const md: vscode.MarkdownString = new vscode.MarkdownString('', true);
    md.appendMarkdown([...track].reverse().join('   \n'));
    item.documentation = md;
    return item;
}

export function parsingUserDefClassRecursive(
    ahkClass: CAhkClass,
    track: readonly string[],
    ChapterArr: readonly string[],
    deep: number,
): vscode.CompletionItem[] {
    const itemS: vscode.CompletionItem[] = [];
    const newTrack: string[] = [...track, `Class  ${ahkClass.name}`];
    for (const ch of ahkClass.children) {
        //
        if (ChapterArr.length === deep) {
            itemS.push(wrapItem(ch, newTrack));
        } else if (
            // track
            ch.kind === vscode.SymbolKind.Class
            && ChapterArr[deep].toUpperCase() === ch.upName
        ) {
            itemS.push(...parsingUserDefClassRecursive(ch, newTrack, ChapterArr, deep + 1)); // getCh
        }
    }

    const { Base } = ahkClass;
    if (Base !== '') {
        const c1: CAhkClass | null = getUserDefTopClassSymbol(Base.toUpperCase());
        if (c1 !== null) {
            itemS.push(...parsingUserDefClassRecursive(c1, newTrack, ChapterArr, deep));
        }
    }

    return itemS;
}
