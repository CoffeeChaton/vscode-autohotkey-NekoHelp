import type { CAhkFunc } from '../../../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../../../AhkSymbol/TAhkSymbolIn';
import { getDiagConfig } from '../../../../configUI';
import type { CDiagFn } from '../../../../provider/Diagnostic/tools/CDiagFn';
import { C511Class } from '../../../../provider/Diagnostic/tools/CDiagFnLib/C511Class';
import type { TFullFuncMap } from '../../../Func/getAllFunc';
import { getAllFunc } from '../../../Func/getAllFunc';
import { getDAListTop } from '../../getDAList';

export function c511banVarNam(
    AST: TAstRoot,
    displayFnErrList: readonly boolean[],
): readonly CDiagFn[] {
    const { code511Max } = getDiagConfig();
    // default size 20
    if (code511Max === 0) return [];

    /**
     * It is related to the whole pm, be careful not to use weakmap memory
     */
    const fnMap: TFullFuncMap = getAllFunc();

    const diag511List: C511Class[] = [];
    let len = 0;
    for (const { paramMap, valMap } of getDAListTop(AST)) {
        for (const [k, v] of [...paramMap, ...valMap]) {
            const ahkFn: CAhkFunc | undefined = fnMap.get(k);
            if (ahkFn !== undefined && displayFnErrList[v.defRangeList[0].start.line]) {
                diag511List.push(new C511Class(v, ahkFn));
                len++;
                if (len >= code511Max) break;
            }
        }
    }

    return diag511List;
}
