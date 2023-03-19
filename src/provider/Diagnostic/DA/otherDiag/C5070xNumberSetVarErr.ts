import type { TParamMapOut, TValMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { C507Class } from '../CDiagFnLib/C507Class';

export function C507SetVarErr0xNumber(paramOrValMap: TParamMapOut | TValMapOut, code507List: C507Class[]): void {
    for (const [keyUpName, v] of paramOrValMap) {
        if ((/^0X[\dA-F]+$/u).test(keyUpName)) {
            code507List.push(
                new C507Class(v.defRangeList),
            );
        }
    }
}
