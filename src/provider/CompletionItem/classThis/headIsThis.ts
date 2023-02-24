import type * as vscode from 'vscode';
import { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import type { TTopSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import { getWmThis } from './getWmThis';
import { parsingUserDefClassRecursive } from './parsingUserDefClassRecursive';

export function headIsThis(topSymbol: TTopSymbol | undefined, ChapterArr: readonly string[]): vscode.CompletionItem[] {
    return topSymbol instanceof CAhkClass
        ? [
            ...parsingUserDefClassRecursive(topSymbol, [topSymbol.uri.fsPath], ChapterArr, 1),
            ...getWmThis(topSymbol),
        ]
        : [];
}
