import * as path from 'node:path';
import * as vscode from 'vscode';
import type { TParamMapIn, TTextMapIn } from '../../AhkSymbol/CAhkFunc';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TLineClass } from '../../AhkSymbol/CAhkLine';
import type { CAhkSwitch } from '../../AhkSymbol/CAhkSwitch';
import type { TTokenStream } from '../../globalEnum';
import { EFnMode } from '../../tools/DeepAnalysis/FnVar/EFnMode';
import { getFnVarDef } from '../../tools/DeepAnalysis/FnVar/getFnVarDef';
import { getParamDef } from '../../tools/DeepAnalysis/getParamDef';
import { getUnknownTextMap } from '../../tools/DeepAnalysis/getUnknownTextMap';
import type { TFuncDefData } from '../../tools/Func/getFuncDef';
import { getFuncDef } from '../../tools/Func/getFuncDef';
import { getDocStrMapMask } from '../../tools/getDocStrMapMask';
import { getTextInRange } from '../../tools/getTextInRange';
import { getFuncDocCore } from '../../tools/MD/getFuncDocMD';
import { getRange } from '../../tools/range/getRange';
import type { TFuncInput } from '../getChildren';
import { getChildren } from '../getChildren';
import { ParserBlock } from '../Parser';
import { ParserLine } from './ParserLine';

function getFuncDetail(line: number, DocStrMap: TTokenStream): string {
    if (line === 0) return '';
    const PreviousLineText = DocStrMap[line - 1].textRaw.trimStart();
    return PreviousLineText.startsWith(';@')
        ? PreviousLineText.slice(2) // 2=== ';@'.len
        : '';
}

function getAllowsListOfFunc(DocStrMap: TTokenStream, startLine: number, endLine: number): readonly boolean[] {
    const allowList: boolean[] = [];
    for (const { line } of DocStrMap) {
        if (line <= startLine) {
            allowList.push(false);
        } else if (line > startLine && line < endLine) {
            allowList.push(true);
        } else if (line >= endLine) {
            break;
        }
    }
    return allowList;
}

// TODO spilt this func
export function getFunc(FuncInput: TFuncInput): CAhkFunc | null {
    const { line, lStr } = FuncInput.AhkTokenLine;

    const col: number = lStr.indexOf('(');
    if (lStr.length === 0 || col === -1) return null;

    const {
        DocStrMap,
        RangeEndLine,
        defStack,
        uri,
        GValMap,
    } = FuncInput;

    const fnDefData: TFuncDefData | null = getFuncDef(DocStrMap, line);
    if (fnDefData === null) return null;

    const { name, selectionRange } = fnDefData;

    const range = getRange(DocStrMap, line, selectionRange.end.line, RangeEndLine, selectionRange.start.character);
    const ch: (CAhkSwitch | TLineClass)[] = getChildren<CAhkFunc>(
        [ParserBlock.getSwitchBlock, ParserLine],
        {
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            defStack,
            uri,
            GValMap,
        },
    );

    const AhkTokenList: TTokenStream = getDocStrMapMask(range, DocStrMap);

    const paramMap: TParamMapIn = getParamDef(name, selectionRange, AhkTokenList);
    const startLine: number = selectionRange.end.line;
    const endLine: number = range.end.line;
    // normal mode OK!
    // if is global mode
    // if is local mode
    // if is static mode
    const allowList: readonly boolean[] = getAllowsListOfFunc(DocStrMap, startLine, endLine);

    const { valMap, fnMode } = getFnVarDef(allowList, AhkTokenList, paramMap, GValMap, EFnMode.normal, DocStrMap);
    const textMap: TTextMapIn = getUnknownTextMap(allowList, AhkTokenList, paramMap, valMap, GValMap, name); // eval!!

    const selectionRangeText: string = getTextInRange(selectionRange, DocStrMap);
    const fileName: string = path.basename(uri.fsPath);

    return new CAhkFunc({
        name,
        detail: getFuncDetail(line, DocStrMap),
        range,
        selectionRange,
        selectionRangeText,
        md: getFuncDocCore({
            fileName,
            AhkTokenList,
            ahkDoc: DocStrMap.at(range.start.line - 1)?.ahkDoc ?? '',
            selectionRangeText,
            classStack: defStack,
        }),
        uri,
        defStack,
        paramMap,
        valMap,
        textMap,
        ch,
        nameRange: new vscode.Range(
            selectionRange.start,
            new vscode.Position(
                line,
                col,
            ),
        ),
        fnMode,
    });
}
