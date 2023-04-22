import type * as vscode from 'vscode';
import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TMethodModeOpt } from '../../configUI.data';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getFileAllMethod } from '../DeepAnalysis/getDAList';
import type { TFullClassMap } from '../DeepAnalysis/getUserDefTopClassSymbol';
import { getAllClass } from '../DeepAnalysis/getUserDefTopClassSymbol';
import { enumLog } from '../enumErr';
import { ToUpCase } from '../str/ToUpCase';
import { getFileAllClassMap } from '../visitor/getFileAllClassMap';
import type { TMethodRef } from './fileMethodRef';
import { fileMethodRef } from './fileMethodRef';
import { methodRefMemo } from './methodRefMemo';
import { position2nameList } from './position2nameList';

function findMethodClassDef(
    position: vscode.Position,
    ChapterArr: readonly string[],
    AhkFileData: TAhkFileData,
): readonly CAhkClass[] {
    const { AST } = AhkFileData;
    const HeadUp: string = ToUpCase(ChapterArr[0]);
    if (HeadUp === 'THIS') {
        for (const topSymbol of AST) {
            if (topSymbol instanceof CAhkClass && topSymbol.range.contains(position)) {
                return [topSymbol];
            }
        }
        return [];
    }

    // class cName{}; definition at this file.
    // ...
    // cName.  ; <--
    const theFileAhkClass: CAhkClass | undefined = getFileAllClassMap(AST).get(HeadUp);
    if (theFileAhkClass !== undefined) return [theFileAhkClass];

    const fullClassMap: TFullClassMap = getAllClass();

    // class cName{}; definition at other file.
    // ...
    // cName.  ; <--
    const AhkClass: CAhkClass | undefined = fullClassMap.get(HeadUp);
    if (AhkClass !== undefined) return [AhkClass];

    // a := new ClassName
    // a.  ;<---
    const nameList: readonly string[] = position2nameList(position, ChapterArr, AhkFileData);

    const classList: CAhkClass[] = [];

    for (const name of nameList) {
        const c0: CAhkClass | undefined = fullClassMap.get(ToUpCase(name));
        if (c0 !== undefined) classList.push(c0);
    }

    return classList;
}

function class2Method(
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

function getMethodPrecisionMode(
    ref: TMethodRef,
    AhkFileData: TAhkFileData,
): readonly CAhkFunc[] | null {
    const position = ref.range.start;
    const { DocStrMap } = AhkFileData;

    const ChapterArrFull: readonly string[] | null = methodRefMemo(ref, DocStrMap[position.line]);
    if (ChapterArrFull === null) return null;

    const classNameList: readonly CAhkClass[] = findMethodClassDef(position, ChapterArrFull, AhkFileData);
    return class2Method(ref.upName, ChapterArrFull, classNameList);
}

function getMethodLooseMode(wordUp: string): readonly CAhkFunc[] {
    // loose_mode
    const list: CAhkFunc[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const { AST } = AhkFileData;
        const method: CAhkFunc[] | undefined = getFileAllMethod(AST).get(wordUp);
        if (method !== undefined) list.push(...method);
    }

    return list;
}

export function getMethodRef2Def(
    document: vscode.TextDocument,
    position: vscode.Position,
    AhkFileData: TAhkFileData,
    mode: TMethodModeOpt,
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
