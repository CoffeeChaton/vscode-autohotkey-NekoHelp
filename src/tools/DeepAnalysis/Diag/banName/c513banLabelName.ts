// import { findLabel, findAllLabelMap } from "../../../labels";
import type { CAhkFunc } from '../../../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../../../AhkSymbol/TAhkSymbolIn';
import { getDiagConfig } from '../../../../configUI';
import type { CDiagFn } from '../../../../provider/Diagnostic/tools/CDiagFn';
import { C513Class } from '../../../../provider/Diagnostic/tools/CDiagFnLib/C513Class';
import type { TFullFuncMap } from '../../../Func/getAllFunc';
import { getAllFunc } from '../../../Func/getAllFunc';
import { findAllLabelMap } from '../../../labels';

export function c513banLabelName(
    AST: TAstRoot,
    displayFnErrList: readonly boolean[],
): readonly CDiagFn[] {
    const { code513Max } = getDiagConfig();
    if (code513Max === 0) return [];

    /**
     * It is related to the whole pm, be careful not to use weakmap memory
     */
    const fnMap: TFullFuncMap = getAllFunc();

    const diag513List: C513Class[] = [];
    let len = 0;
    for (const [k, v] of findAllLabelMap.up(AST)) {
        const ahkFn: CAhkFunc | undefined = fnMap.get(k);
        if (ahkFn !== undefined && displayFnErrList[v.selectionRange.start.line]) {
            diag513List.push(new C513Class(v, ahkFn));
            len++;
            if (len >= code513Max) break;
        }
    }
    return diag513List;
}
