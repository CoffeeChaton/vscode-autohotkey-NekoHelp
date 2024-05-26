import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TTokenStream } from '../../../globalEnum';
import { valTrackAllowFnCall } from '../classThis/valTrackFn';
import { setVarTrackRange } from '../classThis/wrapClass';

function getObjChapterArrAllowFnCall(textRaw: string, character: number): readonly string[] | null {
    if (character === 0) return null;

    const ma: RegExpMatchArray | null = textRaw
        .slice(0, character)
        .match(/([#$@\w\u{A1}-\u{FFFF}.()^]+)$/u); // allow fn

    if (ma === null) return null;

    const ChapterList: string[] = ma[1].split('.');
    ChapterList.pop();

    if (ChapterList.length === 0) return null;

    return (/^\d+$/u).test(ChapterList[0]) // ex: 0.5
        ? null
        : ChapterList.map((s: string): string => s.replace(/\([ \t^]*\)/u, '').toUpperCase());
}

// eslint-disable-next-line max-params
export function wrapVba(
    position: vscode.Position,
    textRaw: string,
    lStr: string,
    AhkFileData: TAhkFileData,
    DA: CAhkFunc | null,
): vscode.CompletionItem[] {
    const col = position.character;
    if (col > lStr.length) return [];

    // a.b().c.d. ;<---
    // ['a', 'b', 'c', 'd']
    const ChapterArr: readonly string[] | null = getObjChapterArrAllowFnCall(textRaw, col);
    if (ChapterArr === null) return [];

    const AhkTokenList: TTokenStream = setVarTrackRange(position, AhkFileData, DA);
    return valTrackAllowFnCall(ChapterArr, AhkTokenList);
}
