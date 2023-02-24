/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import type {
    TParamMapIn,
    TParamMetaIn,
    TTextMapIn,
    TTextMetaIn,
    TValMapIn,
    TValMetaIn,
} from '../../AhkSymbol/CAhkFunc';
import type { TGlobalVal, TGValMap } from '../../core/ParserTools/ahkGlobalDef';
import { EGlobalDefBy } from '../../core/ParserTools/ahkGlobalDef';
import type { TTokenStream } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import { AVariablesMDMap } from '../Built-in/A_Variables.tools';
import { Bi_VarMDMap } from '../Built-in/BiVariables.tools';
import { CommandMDMap } from '../Built-in/Command.tools';
import { otherKeyword2MD } from '../Built-in/otherKeyword2.tools';
import { StatementMDMap } from '../Built-in/statement.tools';
import { WinTitleMDMap } from '../Built-in/WinTitle/WinTitleParameter.tools';
import { newC502 } from './FnVar/def/c502';

function pushRef(
    oldDef: TParamMetaIn | TValMetaIn,
    keyRawName: string,
    line: number,
    character: number,
): void {
    const startPos: vscode.Position = new vscode.Position(line, character);
    if (oldDef.defRangeList.some((defRange: vscode.Range): boolean => defRange.contains(startPos))) {
        return;
    }

    const range: vscode.Range = new vscode.Range(
        startPos,
        new vscode.Position(line, character + keyRawName.length),
    );

    oldDef.refRangeList.push(range);
    oldDef.c502Array.push(newC502(oldDef.keyRawName, keyRawName));
}

// eslint-disable-next-line max-params
export function getUnknownTextMap(
    allowList: readonly boolean[],
    AhkTokenList: TTokenStream,
    paramMap: TParamMapIn,
    valMap: TValMapIn,
    GValMap: TGValMap,
    name: string,
): TTextMapIn {
    const textMap: TTextMapIn = new Map<string, TTextMetaIn>();
    for (const AhkTokenLine of AhkTokenList) {
        const {
            lStr,
            line,
            fistWordUpCol,
            SecondWordUpCol,
            detail,
        } = AhkTokenLine;

        if (line > allowList.length) break;

        if (!allowList[line] || detail.includes(EDetail.isHotStrLine) || detail.includes(EDetail.isLabelLine)) {
            continue;
        }

        /**
         * //FIXME:
         * b:=0
         * a:={b:10}
         * ;   ^ b is key, not var
         */
        for (const v of lStr.matchAll(/(?<![.#])\b(\w+)\b(?!\(|\s*:[^=])/gu)) {
            const keyRawName: string = v[1];
            const wordUp: string = keyRawName.toUpperCase();

            const character: number | undefined = v.index;
            const { input } = v;

            if (character === undefined || input === undefined) {
                void vscode.window.showErrorMessage(`getUnknown Error at line ${line} of ${name}()`);
                continue;
            }
            if (character === fistWordUpCol || character === SecondWordUpCol) {
                // ; Search(node, find, return="") { ; why ahk allow val/Param name like `keyword` ...
                // ;                     ^-----------------------------------------------------> param def
                // ;     found := this.xml.SelectNodes(....) ;...
                // ;     ;....
                // ;         if (ff.text=find) {
                // ;             if return
                // ;                  ^--------------------------------------------------------> param
                // ;                 return ff.SelectSingleNode("../" return)
                // ;                   ^-------------------------------------------------------> keyword
                // ;                                                     ^---------------------> param
                // ;             return ff.SelectSingleNode("..")
                // ;               ^-----------------------------------------------------------> keyword
                // ;         }
                // ;     ;...
                // ; }
                continue;
            }

            const L: string = input[character - 1];
            const R: string = input[character + keyRawName.length];
            if (L === '{' && R === '}') {
                // send {text} <-- text is not variable
                continue;
            }

            const oldParam: TParamMetaIn | undefined = paramMap.get(wordUp);
            if (oldParam !== undefined) {
                pushRef(oldParam, keyRawName, line, character);
                continue;
            }

            const oldVal: TValMetaIn | undefined = valMap.get(wordUp);
            if (oldVal !== undefined) {
                pushRef(oldVal, keyRawName, line, character);
                continue;
            }

            const GValMapOldVal: TGlobalVal | undefined = GValMap.get(wordUp);
            if (GValMapOldVal !== undefined) {
                const startPosOfGlobal: vscode.Position = new vscode.Position(line, character);
                if (
                    !GValMapOldVal.defRangeList.some(({ range }): boolean => range.contains(startPosOfGlobal))
                    && !GValMapOldVal.refRangeList.some(({ range }): boolean => range.contains(startPosOfGlobal))
                ) {
                    GValMapOldVal.refRangeList.push({
                        rawName: keyRawName,
                        range: new vscode.Range(
                            startPosOfGlobal,
                            new vscode.Position(line, character + wordUp.length),
                        ),
                        by: EGlobalDefBy.byRef,
                    });
                }
                continue;
            }

            if (
                !textMap.has(wordUp) && (
                    CommandMDMap.has(wordUp)
                    || AVariablesMDMap.has(wordUp) || StatementMDMap.has(wordUp)
                    || Bi_VarMDMap.has(wordUp)
                    || (/^_+$/u).test(wordUp) // str
                    || (/^\d+$/u).test(wordUp) // just number
                    || (/^0X[\dA-F]+$/u).test(wordUp) // NumHexConst = 0 x [0-9a-fA-F]+
                    || otherKeyword2MD.has(wordUp)
                    || WinTitleMDMap.has(wordUp)
                    /*
                     * let decLiteral: number = 6;
                     * let hexLiteral: number = 0xf00d;
                     * let binaryLiteral: number = 0b1010; // diag this
                     * let octalLiteral: number = 0o744; // diag this
                     */
                )
            ) {
                continue;
            }

            const startPos: vscode.Position = new vscode.Position(line, character);
            const range: vscode.Range = new vscode.Range(
                startPos,
                new vscode.Position(line, character + wordUp.length),
            );
            //
            const need: TTextMetaIn = {
                keyRawName,
                refRangeList: [...textMap.get(wordUp)?.refRangeList ?? [], range],
            };

            textMap.set(wordUp, need);
        }
    }

    return textMap;
}
