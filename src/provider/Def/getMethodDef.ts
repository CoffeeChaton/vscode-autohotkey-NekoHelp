import * as vscode from 'vscode';
import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { getMethodConfig } from '../../configUI';
import type { TMethodMode } from '../../configUI.data';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import { CMemo } from '../../tools/CMemo';
import { getFileAllMethod } from '../../tools/DeepAnalysis/getDAList';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import type { TFullClassMap } from '../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { getAllClass } from '../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { enumLog } from '../../tools/enumErr';
import { getObjChapterArr } from '../../tools/Obj/getObjChapterArr';
import { ahkValDefRegex } from '../../tools/regexTools';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { valTrackMethod } from '../CompletionItem/classThis/valTrackWithGetClass';
import { setVarTrackRange } from '../CompletionItem/classThis/wrapClass';

function ChapterArr2nameList(
    ChapterArr: readonly string[],
    AhkTokenList: TTokenStream,
): readonly string[] {
    const Head: string = ChapterArr[0];

    const reg: RegExp = ahkValDefRegex(Head);
    const classNameList: string[] = []; // value name
    for (const { lStr } of AhkTokenList) {
        const col: number = lStr.search(reg);
        if (col === -1) continue;
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

const position2nameListMemo = new WeakMap<vscode.Position, readonly string[]>();

function position2nameList(
    position: vscode.Position, // depends on `ref` , ref depends on `AhkFileData` .. so this is OK!
    ChapterArr: readonly string[],
    AhkFileData: TAhkFileData,
): readonly string[] {
    const cache: readonly string[] | undefined = position2nameListMemo.get(position);
    if (cache !== undefined) return cache;

    //
    const DA: CAhkFunc | null = getDAWithPos(AhkFileData.AST, position);
    const AhkTokenList: TTokenStream = setVarTrackRange(position, AhkFileData, DA);
    const nameList: readonly string[] = ChapterArr2nameList(ChapterArr, AhkTokenList);

    position2nameListMemo.set(position, nameList);
    return nameList;
    //
}

function findMethodClassDef(
    position: vscode.Position,
    ChapterArr: readonly string[],
    AhkFileData: TAhkFileData,
): readonly CAhkClass[] {
    const Head: string = ChapterArr[0];
    if ((/^this$/iu).test(Head)) {
        for (const topSymbol of AhkFileData.AST) {
            if (topSymbol instanceof CAhkClass && topSymbol.range.contains(position)) {
                return [topSymbol];
            }
        }
        return [];
    }

    const fullClassMap: TFullClassMap = getAllClass();

    // class cName{};
    // ...
    // cName.  ; <--
    const AhkClass: CAhkClass | undefined = fullClassMap.get(ToUpCase(Head));
    if (AhkClass !== undefined) return [AhkClass];

    // a := new ClassName
    // a.  ;<---
    const nameList: readonly string[] = position2nameList(position, ChapterArr, AhkFileData);

    return valTrackMethod(nameList, fullClassMap);
}

function class2Location(
    wordUp: string,
    ChapterArrFull: readonly string[],
    classNameList: readonly CAhkClass[],
): readonly CAhkFunc[] {
    const arr: CAhkFunc[] = [];
    const _arr: string[] = [...ChapterArrFull];
    _arr.pop();
    _arr.shift();
    const arrFix: readonly string[] = [..._arr];

    const { length } = arrFix;

    for (const ahkClass of classNameList) {
        // FIXME `class in class`
        if (length === 0) {
            for (const ch of ahkClass.children) {
                if (ch instanceof CAhkFunc && ch.upName === wordUp) {
                    arr.push(ch);
                }
            }
        }
    }

    return arr;
}

// weakMap -> this
type TMethodRef = {
    rawName: string,
    upName: string,
    range: vscode.Range,
    // track: readonly string[],
};

type TMethodDefShell = ReadonlyMap<string, readonly TMethodRef[]>;
const fileMethodRef = new CMemo<TAhkFileData, TMethodDefShell>((AhkFileData: TAhkFileData): TMethodDefShell => {
    const { DocStrMap } = AhkFileData;
    const map = new Map<string, TMethodRef[]>();
    //
    for (const AhkTokenLine of DocStrMap) {
        const { line, lStr } = AhkTokenLine;
        for (const ma of lStr.matchAll(/(?<=\.)([#$@\w\u{A1}-\u{FFFF}]+)(?=\()/giu)) {
            //                                        .Name(
            const col: number | undefined = ma.index;
            if (col === undefined) continue;

            const rawName: string = ma[1];
            const upName: string = ToUpCase(rawName);
            const range: vscode.Range = new vscode.Range(
                new vscode.Position(line, col),
                new vscode.Position(line, col + rawName.length),
            );

            const arr: TMethodRef[] = map.get(upName) ?? [];
            arr.push({
                rawName,
                upName,
                range,
            });
            map.set(upName, arr);
        }
    }

    return map;
});

const methodRefMemoN2 = new WeakMap<TMethodRef, readonly string[] | null>();

function methodRefMemoN2Up(
    ref: TMethodRef,
    AhkTokenLine: TAhkTokenLine,
): readonly string[] | null {
    const cache: readonly string[] | null | undefined = methodRefMemoN2.get(ref);

    if (cache !== undefined) {
        return cache;
    }

    const position = ref.range.start;
    const { textRaw } = AhkTokenLine;
    const _chapterArr: readonly string[] | null = getObjChapterArr(textRaw, position.character);
    if (_chapterArr === null) {
        methodRefMemoN2.set(ref, null);
        return null;
    }
    const ChapterArrFull: readonly string[] = [..._chapterArr, ref.upName];
    //
    methodRefMemoN2.set(ref, ChapterArrFull);
    return ChapterArrFull;
}

function getMethodPrecisionMode(
    ref: TMethodRef,
    AhkFileData: TAhkFileData,
): readonly CAhkFunc[] | null {
    const position = ref.range.start;
    const { DocStrMap } = AhkFileData;

    const ChapterArrFull: readonly string[] | null = methodRefMemoN2Up(ref, DocStrMap[position.line]);
    if (ChapterArrFull === null) return null;

    const classNameList: readonly CAhkClass[] = findMethodClassDef(position, ChapterArrFull, AhkFileData);
    return class2Location(ref.upName, ChapterArrFull, classNameList);
}

function getMethodLooseMode(wordUp: string): readonly CAhkFunc[] {
    // loose_mode
    const list: CAhkFunc[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const { AST } = AhkFileData;
        const method: CAhkFunc | undefined = getFileAllMethod(AST).get(wordUp);
        if (method !== undefined) list.push(method);
    }

    return list;
}

export function getMethodRef2Def(
    document: vscode.TextDocument,
    position: vscode.Position,
    AhkFileData: TAhkFileData,
    mode: TMethodMode,
): readonly CAhkFunc[] | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(
        position,
        /(?<=\.)[#$@\w\u{A1}-\u{FFFF}]+(?=\()/u,
        //            .Name(
    );

    if (range === undefined) {
        /**
         * delay to up fileMethodRef, until need
         */
        return null;
    }

    const wordUp: string = ToUpCase(document.getText(range));

    const refList: readonly TMethodRef[] | undefined = fileMethodRef.up(AhkFileData).get(wordUp);
    if (refList === undefined) return null; // exp : in `(LTrim` range or `/**` range

    const ref: TMethodRef | undefined = refList.find((v: TMethodRef): boolean => v.range.contains(position));
    if (ref === undefined) return null;

    switch (mode) {
        case 'loose_mode':
            return getMethodLooseMode(wordUp);

        case 'precision_mode':
            return getMethodPrecisionMode(ref, AhkFileData);

        case 'precision_or_loose_mode': {
            const Precision: readonly CAhkFunc[] | null = getMethodPrecisionMode(ref, AhkFileData);
            if (Precision !== null && Precision.length > 0) {
                return Precision;
            }
            return getMethodLooseMode(wordUp);
        }

        default:
            enumLog(mode, 'getMethodRef2Def');
            break;
    }

    // never
    return null;
}

function method2Location(methodList: readonly CAhkFunc[]): vscode.Location[] {
    return methodList.map(
        (method: CAhkFunc): vscode.Location => new vscode.Location(method.uri, method.selectionRange),
    );
}

export function getMethodDef(
    document: vscode.TextDocument,
    position: vscode.Position,
    AhkFileData: TAhkFileData,
): vscode.Location[] | null {
    const methodList: readonly CAhkFunc[] | null = getMethodRef2Def(
        document,
        position,
        AhkFileData,
        getMethodConfig().gotoDef,
    );

    return methodList === null
        ? null
        : method2Location(methodList);
}
