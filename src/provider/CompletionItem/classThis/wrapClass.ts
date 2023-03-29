import type * as vscode from 'vscode';
import type { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TTopSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine, TTokenStream } from '../../../globalEnum';
import { getUserDefTopClassSymbol } from '../../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { getObjChapterArr } from '../../../tools/Obj/getObjChapterArr';
import { ToUpCase } from '../../../tools/str/ToUpCase';
import { headIsThis } from './headIsThis';
import { RefClassWithName } from './RefClassWithName';
import { valTrack } from './valTrack';

function setVarTrackRange(
    position: vscode.Position,
    AhkFileData: TAhkFileData,
    DA: CAhkFunc | null,
): TTokenStream {
    const { DocStrMap, ModuleVar } = AhkFileData;

    if (DA !== null) {
        return DocStrMap.slice(
            DA.selectionRange.end.line,
            position.line,
        );
    }

    const { allowList } = ModuleVar;

    // Minimum detectable area
    // let i: number = position.line;
    // for (i; i >= 0; i--) {
    //     if (!allowList[i]) {
    //         break;
    //     }
    // }
    // return DocStrMap.slice(
    //     i,
    //     position.line,
    // );

    return DocStrMap.filter((AhkTokenLine: TAhkTokenLine): boolean => allowList[AhkTokenLine.line]);
}

function findClassDef(
    position: vscode.Position,
    ChapterArr: readonly string[],
    topSymbol: TTopSymbol | undefined,
    AhkFileData: TAhkFileData,
    DA: CAhkFunc | null,
): vscode.CompletionItem[] {
    const Head: string = ChapterArr[0];
    if ((/^this$/iu).test(Head)) return headIsThis(topSymbol, ChapterArr);

    // class cName{};
    // ...
    // cName.  ; <--
    const AhkClass: CAhkClass | null = getUserDefTopClassSymbol(ToUpCase(Head));
    if (AhkClass !== null) return RefClassWithName(ChapterArr, AhkClass);

    // a := new ClassName
    // a.  ;<---
    const AhkTokenList: TTokenStream = setVarTrackRange(position, AhkFileData, DA);
    return valTrack(ChapterArr, AhkTokenList);
}

// eslint-disable-next-line max-params
export function wrapClass(
    position: vscode.Position,
    textRaw: string,
    lStr: string,
    topSymbol: TTopSymbol | undefined,
    AhkFileData: TAhkFileData,
    DA: CAhkFunc | null,
): vscode.CompletionItem[] {
    const col = position.character;
    if (col > lStr.length) return [];

    // a.b.c.d. ;<---
    // ['a', 'b', 'c', 'd']
    const ChapterArr: readonly string[] | null = getObjChapterArr(textRaw, col);
    return ChapterArr === null
        ? []
        : findClassDef(position, ChapterArr, topSymbol, AhkFileData, DA);
}
