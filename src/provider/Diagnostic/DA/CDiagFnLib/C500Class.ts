import * as vscode from 'vscode';
import type { TValMapOut, TValMetaOut, TVarData } from '../../../../AhkSymbol/CAhkFunc';
import { EPseudoArray } from '../../../../AhkSymbol/CAhkFunc';
import { EDiagCodeDA } from '../../../../diag';
import { AVar_MDMap } from '../../../../tools/Built-in/1_built_in_var/A_Variables.tools';
import { BiVar_MDMap } from '../../../../tools/Built-in/1_built_in_var/BiVariables.tools';
import { ToUpCase } from '../../../../tools/str/ToUpCase';
import { CDiagFn } from '../../tools/CDiagFn';

export class C500Class extends CDiagFn {
    //
    declare public readonly value: EDiagCodeDA.code500;

    public constructor(defRangeList: readonly TVarData[], rawName: string) {
        super({
            value: EDiagCodeDA.code500,
            range: defRangeList[0].range,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Unnecessary],
            message: `var "${rawName}" is assigned but never used.`,
        });
    }
}

function isPseudoArrayCh(AssociatedList: TValMetaOut['AssociatedList']): boolean {
    for (const { by } of AssociatedList) {
        if (
            [
                //
                EPseudoArray.byGuiControlGet_Cmd_PosX,
                EPseudoArray.byGuiControlGet_Cmd_PosY,
                EPseudoArray.byGuiControlGet_Cmd_PosH,
                EPseudoArray.byGuiControlGet_Cmd_PosW,
                //
                EPseudoArray.bySysGet_CMD_Bottom,
                EPseudoArray.bySysGet_CMD_Left,
                EPseudoArray.bySysGet_CMD_Right,
                EPseudoArray.bySysGet_CMD_Top,
                //

                EPseudoArray.byWinGet_CMD_listCh,
                EPseudoArray.byStringSplitCh,
            ].includes(by)
        ) {
            return true;
        }
    }
    return false;
}

function hasRefPseudoArrayCh(AssociatedList: TValMetaOut['AssociatedList'], valMap: TValMapOut): boolean {
    for (const { chList } of AssociatedList) {
        for (const { chName } of chList) {
            const v: TValMetaOut | undefined = valMap.get(ToUpCase(chName));
            if (v !== undefined && v.refRangeList.length > 0) {
                return true;
            }
        }
    }
    return false;
}

export function NeverUsedVar(
    valMap: TValMapOut,
    code500List: C500Class[],
    code500Max: number,
    displayErrList: readonly boolean[],
): void {
    if (code500List.length >= code500Max) return;

    for (const [key, v] of valMap) {
        const {
            refRangeList,
            defRangeList,
            AssociatedList,
            keyRawName,
        } = v;
        if (refRangeList.length > 0) continue;

        // if (v.defRangeList.length > 1) return; // don't open this with out debug
        if (
            AVar_MDMap.has(key)
            || key.startsWith('_')
            || BiVar_MDMap.has(key)
            || !displayErrList[defRangeList[0].range.start.line]
            || key === 'PCRE_CALLOUT'
        ) {
            continue;
        }

        if (AssociatedList.length > 0) {
            if (isPseudoArrayCh(AssociatedList)) continue;
            if (hasRefPseudoArrayCh(AssociatedList, valMap)) continue;
        }

        code500List.push(new C500Class(defRangeList, keyRawName));
        if (code500List.length >= code500Max) return;
    }
}
