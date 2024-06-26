// import { findLabel, findAllLabelMap } from "../../../labels";
import type { CAhkFunc } from '../../../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../../../AhkSymbol/TAhkSymbolIn';
import { getConfig } from '../../../../configUI';
import type { TFullFuncMap } from '../../../../tools/Func/getAllFunc';
import { getAllFunc } from '../../../../tools/Func/getAllFunc';
import { findAllLabelMap } from '../../../../tools/labels';
import type { CDiagFn } from '../../tools/CDiagFn';
import { C513Class } from '../CDiagFnLib/C513Class';

export function c513banLabelName(
    AST: TAstRoot,
    displayFnErrList: readonly boolean[],
): readonly CDiagFn[] {
    const { code513Max } = getConfig().Diag;
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
