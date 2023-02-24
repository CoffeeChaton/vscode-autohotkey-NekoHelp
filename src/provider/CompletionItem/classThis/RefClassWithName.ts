import type * as vscode from 'vscode';
import type { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import { getWmThis } from './getWmThis';
import { parsingUserDefClassRecursive } from './parsingUserDefClassRecursive';

export function RefClassWithName(ChapterArr: readonly string[], AhkClass: CAhkClass): vscode.CompletionItem[] {
    const ahkThis: vscode.CompletionItem[] = ChapterArr.length === 1
        ? getWmThis(AhkClass)
        : [];
    return [
        ...parsingUserDefClassRecursive(AhkClass, [AhkClass.uri.fsPath], ChapterArr, 1),
        ...ahkThis,
    ];
}
