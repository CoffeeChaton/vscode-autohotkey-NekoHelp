/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import type { TAssociated, TParamMetaIn, TValMetaIn } from '../../../../../AhkSymbol/CAhkFunc';
import type { TGlobalVal } from '../../../../../core/ParserTools/ahkGlobalDef';
import { EGlobalDefBy } from '../../../../../core/ParserTools/ahkGlobalDef';
import { ToUpCase } from '../../../../str/ToUpCase';
import { pushDef } from '../../../pushDef';
import type { TGetFnDefNeed } from '../../TFnVarDef';
import { getValMeta } from '../getValMeta';

export function pseudoArrayPushDef(
    need: TGetFnDefNeed,
    Associated: TAssociated,
): null {
    const {
        line,
        paramMap,
        GValMap,
        valMap,
        lineComment,
        fnMode,
    } = need;

    const { chList, col, faRawName } = Associated;

    for (const { chName, by } of chList) {
        const chUpName: string = ToUpCase(chName);
        const oldParam: TParamMetaIn | undefined = paramMap.get(chUpName);
        if (oldParam !== undefined) {
            pushDef(oldParam, chName, line, col);
            continue;
        }

        const oldVal: TValMetaIn | undefined = valMap.get(chUpName);
        if (oldVal !== undefined) {
            pushDef(oldVal, chName, line, col);
            continue;
        }

        const GValMapOldVal: TGlobalVal | undefined = GValMap.get(chUpName);
        if (GValMapOldVal !== undefined) {
            const startPosOfGlobal: vscode.Position = new vscode.Position(line, col);
            if (
                !GValMapOldVal.defRangeList.some(({ range }): boolean => range.contains(startPosOfGlobal))
                && !GValMapOldVal.refRangeList.some(({ range }): boolean => range.contains(startPosOfGlobal))
            ) {
                GValMapOldVal.defRangeList.push({
                    rawName: chName,
                    range: new vscode.Range(
                        startPosOfGlobal,
                        new vscode.Position(line, col + chName.length),
                    ),
                    by: EGlobalDefBy.byRef,
                });
            }
            continue;
        }

        const value: TValMetaIn = getValMeta({
            line,
            character: col,
            RawName: chName,
            valMap,
            lineComment,
            fnMode,
            Associated: {
                faRawName,
                chList: [],
                line,
                col,
                by,
            },
        });
        valMap.set(chUpName, value);
    }

    return null;
}
