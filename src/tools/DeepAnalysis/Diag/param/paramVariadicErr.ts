import type { TParamMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { C504Class } from '../../../../provider/Diagnostic/tools/CDiagFnLib/C504Class';

export function paramVariadicErr(paramMap: TParamMapOut, code504List: C504Class[]): void {
    const rightIndex: number = paramMap.size - 1;
    let i = 0;
    for (const { isVariadic, defRangeList } of paramMap.values()) {
        if (isVariadic && (i !== rightIndex)) {
            code504List.push(new C504Class(defRangeList));
        }
        i++;
    }
}
