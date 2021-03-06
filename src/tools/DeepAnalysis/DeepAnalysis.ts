/* eslint-disable security/detect-unsafe-regex */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10,60,200,1000] }] */
import * as vscode from 'vscode';
import { getGlobalValDef } from '../../core/getGlobalValDef';
import {
    TArgList,
    DeepAnalysisResult,
    EValType, TAhkSymbol, TAhkValType, TRunValType2, TTokenStream, TValList, TValObj, EFnMode,
} from '../../globalEnum';
import { fnModeToValType } from '../Func/fnModeToValType';

import { getFnModeWM } from '../Func/getFnMode';
import { kindPick } from '../Func/kindPick';
import { getCommentOfLine } from '../getCommentOfLine';
import { Pretreatment } from '../Pretreatment';
import { ahkValRegex } from '../regexTools';

import { ClassWm } from '../wm';
import { setArgList } from './fnArgs';

function getLineType(lStr: string, fnMode: EFnMode)
    : EValType.local | EValType.global | EValType.Static {
    const fnTypeList: ([RegExp, TRunValType2])[] = [
        [/^\s*local\s/i, EValType.local],
        [/^\s*global\s/i, EValType.global],
        [/^\s*Static\s/i, EValType.Static],
    ];
    for (const [ruler, t] of fnTypeList) {
        if (ruler.test(lStr)) {
            return t;
        }
    }
    return fnModeToValType(fnMode);
}

type TGetValue = {
    keyRawName: string,
    line: number,
    character: number,
    valMap: TValList,
    textRaw: string,
    lStr: string,
    lineType: TAhkValType,
    uri: vscode.Uri
};

function getValue({
    keyRawName,
    line,
    character,
    valMap,
    textRaw,
    lStr,
    lineType,
    uri,
}: TGetValue): TValObj {
    const pos = new vscode.Position(line, character);
    const defLoc = new vscode.Location(uri, pos);
    const comment = getCommentOfLine({ textRaw, lStr }) ?? '';
    const oldVal: TValObj | undefined = valMap.get(keyRawName);
    if (oldVal) {
        return {
            keyRawName,
            defLoc: [defLoc, ...oldVal.defLoc],
            commentList: [comment, ...oldVal.commentList],
            refLoc: [],
            ahkValType: oldVal.ahkValType,
        };
    }

    const ahkValType = getGlobalValDef(ahkValRegex(keyRawName))
        ? EValType.global
        : lineType;
    return {
        keyRawName,
        defLoc: [defLoc],
        commentList: [comment],
        refLoc: [],
        ahkValType,
    };
}

function setValListDef(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream, argList: TArgList): TValList {
    const fnMode = getFnModeWM(ahkSymbol, DocStrMap);
    const valMap: TValList = new Map<string, TValObj>();

    const startLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, textRaw, line } of DocStrMap) {
        if (line < startLine) continue;
        const lineType: TAhkValType = getLineType(lStr, fnMode);

        [...lStr.matchAll(/(?<!\.|`|%)\b(\w\w*)\s*:?=/g)]
            .forEach((v: RegExpMatchArray) => {
                const character = v.index;
                if (character === undefined) return;
                const keyRawName = v[1];
                if (argList.has(keyRawName)) return;

                const value: TValObj = getValue({
                    keyRawName,
                    line,
                    character,
                    valMap,
                    textRaw,
                    lStr,
                    lineType,
                    uri,
                });
                valMap.set(keyRawName, value);
            });
    }

    return valMap;
}
function setValList(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream, argList: TArgList): TValList {
    const valMap: TValList = setValListDef(uri, ahkSymbol, DocStrMap, argList);

    return valMap;
}

const w = new ClassWm<TAhkSymbol, DeepAnalysisResult>(10 * 60 * 1000, 'DeepAnalysis', 200);

export function DeepAnalysis(document: vscode.TextDocument, ahkSymbol: TAhkSymbol): null | DeepAnalysisResult {
    const kindStr = kindPick(ahkSymbol.kind);
    if (!kindStr) return null;

    const cache = w.getWm(ahkSymbol);
    if (cache) return cache;

    const DocStrMap = Pretreatment(document.getText(ahkSymbol.range).split('\n'),
        ahkSymbol.range.start.line);
    const argList: TArgList = setArgList(document.uri, ahkSymbol, DocStrMap);
    const valList = setValList(document.uri, ahkSymbol, DocStrMap, argList);
    const v: DeepAnalysisResult = {
        argList,
        valList,
    };
    return w.setWm(ahkSymbol, v);
}
