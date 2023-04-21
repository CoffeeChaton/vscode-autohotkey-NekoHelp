import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { getDefinitionProviderMethodConfig } from '../../configUI';
import type { TDefProviderMethod } from '../../configUI.data';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import { getFileAllMethod } from '../../tools/DeepAnalysis/getDAList';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import type { TFullClassMap } from '../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { getAllClass } from '../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { getObjChapterArr } from '../../tools/Obj/getObjChapterArr';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { valTrackMethod } from '../CompletionItem/classThis/valTrackWithGetClass';
import { setVarTrackRange } from '../CompletionItem/classThis/wrapClass';

function findMethodClassDef(
    position: vscode.Position,
    ChapterArr: readonly string[],
    AhkFileData: TAhkFileData,
    DA: CAhkFunc | null,
): readonly CAhkClass[] {
    const Head: string = ChapterArr[0];
    if ((/^this$/iu).test(Head)) return [];

    const fullClassMap: TFullClassMap = getAllClass();

    // class cName{};
    // ...
    // cName.  ; <--
    const AhkClass: CAhkClass | undefined = fullClassMap.get(ToUpCase(Head));
    if (AhkClass !== undefined) return [AhkClass];

    // a := new ClassName
    // a.  ;<---
    const AhkTokenList: TTokenStream = setVarTrackRange(position, AhkFileData, DA);
    return valTrackMethod(ChapterArr, AhkTokenList, fullClassMap);
}

function class2Location(
    wordUp: string,
    ChapterArrFull: readonly string[],
    classNameList: readonly CAhkClass[],
): vscode.Location[] {
    const locList: vscode.Location[] = [];
    const { length } = ChapterArrFull;

    for (const ahkClass of classNameList) {
        // FIXME
        if (length === 2) {
            for (const ch of ahkClass.children) {
                if (ch instanceof CAhkFunc && ch.upName === wordUp) {
                    locList.push(new vscode.Location(ch.uri, ch.selectionRange));
                }
            }
        }
    }

    return locList;
}

function getMethodPrecisionMode(
    wordUp: string,
    position: vscode.Position,
    AhkFileData: TAhkFileData,
): vscode.Location[] | null {
    // precision_mode

    const { DocStrMap, AST } = AhkFileData;
    const DA: CAhkFunc | null = getDAWithPos(AST, position);

    const ahkTokenLine: TAhkTokenLine = DocStrMap[position.line];
    const { textRaw } = ahkTokenLine;
    const _chapterArr: readonly string[] | null = getObjChapterArr(textRaw, position.character);
    if (_chapterArr === null) return null;
    const ChapterArrFull: readonly string[] = [..._chapterArr, wordUp];
    const classNameList: readonly CAhkClass[] = findMethodClassDef(position, ChapterArrFull, AhkFileData, DA);

    return class2Location(wordUp, ChapterArrFull, classNameList);
}

function getMethodLooseMode(wordUp: string): vscode.Location[] {
    // loose_mode
    const list: vscode.Location[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const { AST } = AhkFileData;
        const method: CAhkFunc | undefined = getFileAllMethod(AST).get(wordUp);
        if (method !== undefined) {
            list.push(new vscode.Location(method.uri, method.selectionRange));
        }
    }

    return list;
}

export function getMethodDef(
    document: vscode.TextDocument,
    position: vscode.Position,
    AhkFileData: TAhkFileData,
): vscode.Location[] | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(
        position,
        /(?<=\.)[#$@\w\u{A1}-\u{FFFF}]+(?=\()/u,
        //            .Name(
    );
    if (range === undefined) return null;
    const wordUp: string = ToUpCase(document.getText(range));

    const mode: TDefProviderMethod = getDefinitionProviderMethodConfig();
    if (mode === 'loose_mode') {
        return getMethodLooseMode(wordUp);
    }

    if (mode === 'precision_mode') {
        return getMethodPrecisionMode(wordUp, position, AhkFileData);
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (mode === 'precision_or_loose_mode') {
        const Precision: vscode.Location[] | null = getMethodPrecisionMode(wordUp, position, AhkFileData);
        if (Precision !== null && Precision.length > 0) {
            return Precision;
        }
        return getMethodLooseMode(wordUp);
    }
    // never
    return null;
}
