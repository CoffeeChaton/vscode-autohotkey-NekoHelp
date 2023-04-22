import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TTokenStream } from '../../globalEnum';
import { setVarTrackRange } from '../../provider/CompletionItem/classThis/wrapClass';
import { getDAWithPos } from '../DeepAnalysis/getDAWithPos';
import { ahkValDefRegex } from '../regexTools';

function ChapterArr2nameList(
    ChapterArr: readonly string[],
    AhkTokenList: TTokenStream,
): readonly string[] {
    const Head: string = ChapterArr[0];

    const reg: RegExp = ahkValDefRegex(Head);
    const classNameList: string[] = []; // value name
    for (const { lStr } of AhkTokenList) {
        const col: number = lStr.search(reg);
        if (col === -1) {
            continue;
        }
        const strPart: string = lStr
            .slice(col + Head.length, lStr.length)
            .replace(/^\s*:=\s*/u, '');

        const ahkNewClass: RegExpMatchArray | null = strPart.match(/^new[ \t]*([#$@\w\u{A1}-\u{FFFF}]+)/iu);
        if (ahkNewClass !== null) {
            classNameList.push(ahkNewClass[1]);
        }
    }

    return classNameList;
}

/**
 * WeakMap
 */
const position2nameListMemo = new WeakMap<vscode.Position, readonly string[]>();

export function position2nameList(
    position: vscode.Position,
    ChapterArr: readonly string[],
    AhkFileData: TAhkFileData,
): readonly string[] {
    const cache: readonly string[] | undefined = position2nameListMemo.get(position);
    if (cache !== undefined) return cache;

    //
    const DA: CAhkFunc | null = getDAWithPos(AhkFileData.AST, position);
    const AhkTokenList: TTokenStream = setVarTrackRange(position, AhkFileData, DA);
    const nameList: readonly string[] = ChapterArr2nameList(ChapterArr, AhkTokenList);
    //

    position2nameListMemo.set(position, nameList);
    return nameList;
}
