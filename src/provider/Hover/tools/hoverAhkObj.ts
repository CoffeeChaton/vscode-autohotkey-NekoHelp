import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine, TTokenStream } from '../../../globalEnum';
import { ahkBaseGetMd, type TAhkBaseObj } from '../../../tools/Built-in/8_built_in_method_property/Obj.tools';
import { getDAWithPos } from '../../../tools/DeepAnalysis/getDAWithPos';
import { valTrackCore } from '../../CompletionItem/classThis/valTrack';
import { setVarTrackRange } from '../../CompletionItem/classThis/wrapClass';
import { getObjChapterArrAllowFnCall } from '../../CompletionItem/vba/wrapVba';

export function valTrackJustObj(ChapterArr: readonly string[], AhkTokenList: TTokenStream): TAhkBaseObj {
    const ahkBaseObj: TAhkBaseObj = {
        ahkArray: false,
        ahkFileOpen: false,
        ahkFuncObject: false,
        ahkBase: false,
        ahkCatch: false,
        ahkInputHook: false,
    };

    // not need it now...
    void valTrackCore(ChapterArr, ahkBaseObj, AhkTokenList);

    return ahkBaseObj;
}

export function hoverAhkObj(
    document: vscode.TextDocument,
    AhkFileData: TAhkFileData,
    position_raw: vscode.Position,
): vscode.Hover | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position_raw);
    if (range === undefined) return null;
    const wordLast: string = document.getText(range).toUpperCase();

    const position = new vscode.Position(position_raw.line, range.end.character);
    const { AST, DocStrMap } = AhkFileData;

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];
    const { lStr, textRaw } = AhkTokenLine;

    const col: number = position.character;
    if (col > lStr.length) return null;

    const ChapterArr: readonly string[] | null = getObjChapterArrAllowFnCall(textRaw, col);
    if (ChapterArr === null) return null;

    const AhkTokenList: TTokenStream = setVarTrackRange(position, AhkFileData, DA);
    const Obj: TAhkBaseObj = valTrackJustObj(ChapterArr, AhkTokenList);

    const strList: string[] = ahkBaseGetMd(Obj, wordLast);
    if (strList.length === 0) return null;

    return new vscode.Hover(new vscode.MarkdownString(strList.join('\n')), range);
}
