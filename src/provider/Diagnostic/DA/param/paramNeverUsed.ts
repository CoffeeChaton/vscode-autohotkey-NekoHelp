import type { TParamMapOut, TValMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { AVariablesMDMap } from '../../../../tools/Built-in/A_Variables.tools';
import { Bi_VarMDMap } from '../../../../tools/Built-in/BiVariables.tools';
import { C500Class } from '../CDiagFnLib/C500Class';
import { C501Class } from '../CDiagFnLib/C501Class';

export function NeverUsedParam(
    paramMap: TParamMapOut,
    code501List: C501Class[],
    displayErrList: readonly boolean[],
): void {
    for (const v of paramMap.values()) {
        if (v.refRangeList.length > 0) continue;
        if (v.keyRawName.startsWith('_')) continue;
        if (!displayErrList[v.defRangeList[0].start.line]) continue;

        code501List.push(new C501Class(v.defRangeList));
    }
}

export function NeverUsedVar(
    valMap: TValMapOut,
    code500List: C500Class[],
    code500Max: number,
    displayErrList: readonly boolean[],
): void {
    if (code500List.length >= code500Max) return;

    for (const [key, v] of valMap) {
        if (v.refRangeList.length > 0) continue;

        // if (v.defRangeList.length > 1) return; // don't open this with out debug
        if (
            AVariablesMDMap.has(key)
            || key.startsWith('_')
            || Bi_VarMDMap.has(key)
            || !displayErrList[v.defRangeList[0].start.line]
            || key === 'PCRE_CALLOUT'
        ) {
            continue;
        }

        code500List.push(new C500Class(v.defRangeList));
        if (code500List.length >= code500Max) return;
    }
}
