// It is related to the whole pm, be careful not to use weakmap memory
import type { CAhkFunc, TValMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { getDiagConfig } from '../../../../configUI';
import type { CDiagFn } from '../../../../provider/Diagnostic/tools/CDiagFn';
import { C512Class } from '../../../../provider/Diagnostic/tools/CDiagFnLib/C512Class';
import type { TFullFuncMap } from '../../../Func/getAllFunc';
import { getAllFunc } from '../../../Func/getAllFunc';

export function c512banGlobalVarName(
    ModuleValMap: TValMapOut,
    displayFnErrList: readonly boolean[],
): readonly CDiagFn[] {
    const { code512Max } = getDiagConfig();
    if (code512Max === 0) return [];

    const fnMap: TFullFuncMap = getAllFunc();

    const diag512List: CDiagFn[] = [];
    let len = 0;
    for (const [k, v] of ModuleValMap) {
        const ahkFn: CAhkFunc | undefined = fnMap.get(k);
        if (ahkFn !== undefined && displayFnErrList[v.defRangeList[0].start.line]) {
            diag512List.push(new C512Class(v, ahkFn));
            len++;
            if (len >= code512Max) break;
        }
    }

    return diag512List;
}
