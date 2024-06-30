/* eslint-disable max-depth */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import {
    EPseudoArray,
    type TParamMapIn,
    type TParamMetaIn,
    type TTextMapIn,
    type TTextMetaIn,
    type TValMapIn,
    type TValMetaIn,
} from '../../AhkSymbol/CAhkFunc';
import type { TGlobalVal, TGValMap } from '../../core/ParserTools/ahkGlobalDef';
import { EGlobalDefBy } from '../../core/ParserTools/ahkGlobalDef';
import type { TTokenStream } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import { WinTitle_MDMap } from '../Built-in/100_other/WinTitle/WinTitleParameter.tools';
import { AVar_MDMap } from '../Built-in/1_built_in_var/A_Variables.tools';
import { BiVar_MDMap } from '../Built-in/1_built_in_var/BiVariables.tools';
import { foc_MDMap } from '../Built-in/3_foc/foc.tools';
import { operator_MDMap } from '../Built-in/4_operator/operator.tools';
import { Cmd_MDMap } from '../Built-in/6_command/Command.tools';
import { ToUpCase } from '../str/ToUpCase';
import { pushDef } from './pushDef';
import { pushRef } from './pushRef';

// eslint-disable-next-line max-params
export function getUnknownTextMap(
    allowList: readonly boolean[],
    AhkTokenList: TTokenStream,
    paramMap: TParamMapIn,
    valMap: TValMapIn,
    GValMap: TGValMap,
    _name: string,
): TTextMapIn {
    const textMap: TTextMapIn = new Map<string, TTextMetaIn>();
    for (const AhkTokenLine of AhkTokenList) {
        const {
            lStr,
            line,
            fistWordUp,
            fistWordUpCol,
            SecondWordUpCol,
            detail,
        } = AhkTokenLine;

        if (line > allowList.length) break;

        if (!allowList[line] || detail.includes(EDetail.isLabelLine)) {
            continue;
        }

        if (detail.includes(EDetail.isDirectivesLine) && !(/^#if\b/iu).test(lStr.trimStart())) {
            continue;
        }

        for (
            const v of lStr.matchAll(
                /(?<=[%!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)([#$@\w\u{A1}-\u{FFFF}]+)(?=[.`%!"/&')*+,\-:;<=>?[\\^\]{|}~ \t]|$)/gu,
            ) //          ^ A   without .` and #$@                                                          ^ B without ( and #$@
        ) {
            const keyRawName: string = v[1];
            const wordUp: string = ToUpCase(keyRawName);

            const character: number = v.index;
            const { input } = v;

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

            const strObjCase: string = input
                .slice(character + keyRawName.length)
                .trim();

            if (
                strObjCase.startsWith(':') //
                && !strObjCase.startsWith(':=')
                && (/[,{]$/u).test(input.slice(0, character).trimEnd())
            ) {
                // a:= {a:b,c:d}
                // ^var
                //      ^ not var

                /**
                 * b:=0
                 * a:={b:10}
                 * ;   ^ b is key, not var
                 */
                // a:= b ? b : 10
                //         ^var

                if (fistWordUp === 'CASE' && lStr.indexOf(':') === strObjCase.padStart(lStr.length).indexOf(':')) {
                    // nothing
                } else {
                    continue;
                }
            }

            if (
                ((/^0X[\dA-F]+$/u).test(wordUp) || (/^\d+$/u).test(wordUp)) // NumHexConst = 0 x [0-9a-fA-F]+
                && !(L === '%' && R === '%') // code507.md exp2, some-case is legal, but unreasonable
            ) {
                continue;
            }

            const strF = lStr.slice(character + keyRawName.length).trimStart();

            const oldParam: TParamMetaIn | undefined = paramMap.get(wordUp);
            if (oldParam !== undefined) {
                // dprint-ignore
                const _void0: null = [':=', '+=', '-=', '*=', '/=', '//=', '.=', '|=', '&=', '^=', '>>=', '<<=', '>>>='].some((vvv: string): boolean => strF.startsWith(vvv))
                    ? pushDef(oldParam, keyRawName, line, character)
                    : pushRef(oldParam, keyRawName, line, character);

                continue;
            }

            const oldVal: TValMetaIn | undefined = valMap.get(wordUp);
            if (oldVal !== undefined) {
                // dprint-ignore
                const _void0: null = [':=', '+=', '-=', '*=', '/=', '//=', '.=', '|=', '&=', '^=', '>>=', '<<=', '>>>='].some((vvv: string): boolean => strF.startsWith(vvv))
                    ? pushDef(oldVal, keyRawName, line, character)
                    : pushRef(oldVal, keyRawName, line, character);
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
                    Cmd_MDMap.has(wordUp)
                    || AVar_MDMap.has(wordUp)
                    || foc_MDMap.has(wordUp)
                    || BiVar_MDMap.has(wordUp)
                    || operator_MDMap.has(wordUp) // and or
                    || WinTitle_MDMap.has(wordUp) // ahk_class
                    // || (/^_+$/u).test(wordUp) // str
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
            // fix EPseudoArray.byStringSplitEtc https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/11#issuecomment-1574741836
            if ((/\d+$/u).test(wordUp)) {
                const chUpNameFa: string = wordUp.replace(/\d+$/u, '');
                const oldValStringSplit: TValMetaIn | undefined = valMap.get(chUpNameFa);
                if (oldValStringSplit !== undefined) {
                    const { AssociatedList, refRangeList } = oldValStringSplit;

                    for (const { by, chList } of AssociatedList) {
                        if (by === EPseudoArray.byWinGet_CMD_listFa || by === EPseudoArray.byStringSplitFa) {
                            const byCh = by === EPseudoArray.byWinGet_CMD_listFa
                                ? EPseudoArray.byWinGet_CMD_listCh
                                : EPseudoArray.byStringSplitCh;
                            if (
                                by === EPseudoArray.byWinGet_CMD_listFa
                                && (/\D0$/u).test(wordUp)
                            ) {
                                break;
                            }

                            refRangeList.push({ range, c502: 0 });
                            chList.push({ chName: keyRawName, by: byCh });
                            break;
                        }
                    }

                    continue;
                }
            }

            //
            const need: TTextMetaIn = {
                keyRawName,
                refRangeList: [...textMap.get(wordUp)?.refRangeList ?? [], { range, c502: 0 }],
            };

            textMap.set(wordUp, need);
        }
    }

    return textMap;
}
