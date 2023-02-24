import type * as vscode from 'vscode';
import type { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import type { TTokenStream } from '../../../globalEnum';
import { ahkBaseWrap } from '../../../tools/Built-in/ahkBase';
import type { TAhkBaseObj } from '../../../tools/Built-in/ahkBase_tools';
import { ahkBaseUp } from '../../../tools/Built-in/ahkBase_tools';
import { getUserDefTopClassSymbol } from '../../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { ahkValDefRegex } from '../../../tools/regexTools';
import { getWmThis } from './getWmThis';
import { parsingUserDefClassRecursive } from './parsingUserDefClassRecursive';

type TMathName = {
    ChapterArr: readonly string[],
    strPart: string,
    ahkBaseObj: TAhkBaseObj,
};

function matchClassName({ ChapterArr, strPart, ahkBaseObj }: TMathName): string | null {
    // case 1: https://www.autohotkey.com/docs/v1/Objects.htm#Objects_as_Functions
    const ahkNewClass: RegExpMatchArray | null = strPart.match(/^new\s*(\w+)/iu);
    if (ahkNewClass !== null) {
        return ahkNewClass[1];
    }

    // case 2:
    if (ChapterArr.length === 1) {
        ahkBaseUp(strPart, ahkBaseObj);
    }

    // case 3:
    // case ...
    return null;
}

function valTrackCore(
    ChapterArr: readonly string[],
    ahkBaseObj: TAhkBaseObj,
    AhkTokenList: TTokenStream,
): string[] {
    const Head: string = ChapterArr[0];

    const reg: RegExp = ahkValDefRegex(Head);
    // eslint-disable-next-line security/detect-non-literal-regexp
    const cacheReg = new RegExp(`\\b${Head}\\b`, 'iu');

    const classNameList: string[] = []; // value name
    for (const { lStr, fistWordUp } of AhkTokenList) {
        if (fistWordUp === 'CATCH' && cacheReg.test(lStr)) {
            // eslint-disable-next-line no-param-reassign
            ahkBaseObj.ahkCatch = true;
        }
        const col: number = lStr.search(reg);
        if (col === -1) continue;
        const strPart: string = lStr
            .slice(col + Head.length, lStr.length)
            .replace(/^\s*:=\s*/u, '');

        const name0: string | null = matchClassName({ ChapterArr, strPart, ahkBaseObj });
        if (name0 !== null) classNameList.push(name0);
    }

    return classNameList;
}

export function valTrack(ChapterArr: readonly string[], AhkTokenList: TTokenStream): vscode.CompletionItem[] {
    const ahkBaseObj: TAhkBaseObj = {
        ahkArray: false,
        ahkFileOpen: false,
        ahkFuncObject: false,
        ahkBase: false,
        ahkCatch: false,
    };
    const itemS: vscode.CompletionItem[] = [];

    const nameList: string[] = valTrackCore(ChapterArr, ahkBaseObj, AhkTokenList);

    for (const name of nameList) {
        const c0: CAhkClass | null = getUserDefTopClassSymbol(name.toUpperCase());
        if (c0 === null) continue;

        const ahkThis: vscode.CompletionItem[] = ChapterArr.length === 1
            ? getWmThis(c0)
            : [];
        itemS.push(...ahkThis, ...parsingUserDefClassRecursive(c0, [c0.uri.fsPath], ChapterArr, 1));
    }

    // keep after const nameList, because ahkBaseObj modified of valTrackCore
    if (ChapterArr.length === 1) itemS.push(...ahkBaseWrap(ahkBaseObj));
    return itemS;
}
