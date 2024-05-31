import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TTokenStream } from '../../../globalEnum';
import { setVarTrackRange } from '../classThis/wrapClass';
import type { CVbaCompletionItem } from './2Completion/CVbaCompletionItem';
import type { TVbaDataLast } from './valTrackFn';
import { valTrackAllowFnCall } from './valTrackFn';
import { vbaCompletionDeep1 } from './vbaCompletion';

export function getObjChapterArrAllowFnCall(textRaw: string, character: number): readonly string[] | null {
    if (character === 0) return null;

    const ma: RegExpMatchArray | null = textRaw
        .slice(0, character)
        .match(/([#$@\w\u{A1}-\u{FFFF}.()^]+)$/u); // allow fn

    if (ma === null) return null;

    const ChapterList: string[] = ma[1].split('.');
    ChapterList.pop();

    if (ChapterList.length === 0) return null;

    // ex: 0.5
    //     ^0   -> [0] ^\d+$ to check it
    //       ^5 -> [1]

    // ex: ComObjActive(Excel.
    //     ^^^^^^^^^^^^^^^^^^ -> [0] -> .includes('(') to check it
    return (/^\d+$/u).test(ChapterList[0]) || ChapterList[0].includes('(')
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
): TVbaDataLast | null {
    const col: number = position.character;
    if (col > lStr.length) return null;

    // a.b().c.d. ;<---
    // ['a', 'b', 'c', 'd']
    const ChapterArr: readonly string[] | null = getObjChapterArrAllowFnCall(textRaw, col);
    if (ChapterArr === null) return null;

    const AhkTokenList: TTokenStream = setVarTrackRange(position, AhkFileData, DA);
    return valTrackAllowFnCall(ChapterArr, AhkTokenList);
}

export function wrapVba2Completion(
    position: vscode.Position,
    textRaw: string,
    lStr: string,
    AhkFileData: TAhkFileData,
    DA: CAhkFunc | null,
): CVbaCompletionItem[] {
    const data: TVbaDataLast | null = wrapVba(position, textRaw, lStr, AhkFileData, DA);
    if (data === null) return [];
    return vbaCompletionDeep1(data);
}
