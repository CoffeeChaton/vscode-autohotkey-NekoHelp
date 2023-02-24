import type * as vscode from 'vscode';
import type { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TTopSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import type { TTokenStream } from '../../../globalEnum';
import { getUserDefTopClassSymbol } from '../../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { getObjChapterArr } from '../../../tools/Obj/getObjChapterArr';
import { headIsThis } from './headIsThis';
import { RefClassWithName } from './RefClassWithName';
import { valTrack } from './valTrack';

function setVarTrackRange(
    position: vscode.Position,
    DocStrMap: TTokenStream,
    DA: CAhkFunc | null,
): TTokenStream {
    const varSearchStartLine: number = (DA === null)
        ? 0
        : DA.selectionRange.end.line;

    return DocStrMap.slice(
        varSearchStartLine,
        position.line,
    );
}

function findClassDef(
    position: vscode.Position,
    ChapterArr: readonly string[],
    topSymbol: TTopSymbol | undefined,
    DocStrMap: TTokenStream,
    DA: CAhkFunc | null,
): vscode.CompletionItem[] {
    const Head: string = ChapterArr[0];
    if ((/^this$/iu).test(Head)) return headIsThis(topSymbol, ChapterArr);

    // class cName{};
    // ...
    // cName.  ; <--
    const AhkClass: CAhkClass | null = getUserDefTopClassSymbol(Head.toUpperCase());
    if (AhkClass !== null) return RefClassWithName(ChapterArr, AhkClass);

    // a := new ClassName
    // a.  ;<---
    const AhkTokenList: TTokenStream = setVarTrackRange(position, DocStrMap, DA);
    return valTrack(ChapterArr, AhkTokenList);
}

// eslint-disable-next-line max-params
export function wrapClass(
    position: vscode.Position,
    textRaw: string,
    lStr: string,
    topSymbol: TTopSymbol | undefined,
    DocStrMap: TTokenStream,
    DA: CAhkFunc | null,
): vscode.CompletionItem[] {
    const col = position.character;
    if (col > lStr.length) return [];

    // a.b.c.d. ;<---
    // ['a', 'b', 'c', 'd']
    const ChapterArr: readonly string[] | null = getObjChapterArr(textRaw, col);
    return ChapterArr === null
        ? []
        : findClassDef(position, ChapterArr, topSymbol, DocStrMap, DA);
}
