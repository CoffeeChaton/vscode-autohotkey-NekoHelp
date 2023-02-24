import type { TParamMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { C505Class } from '../../../../provider/Diagnostic/tools/CDiagFnLib/C505Class';

export function c505ErrParamParsedError(paramMap: TParamMapOut, code505List: C505Class[]): void {
    for (const { parsedErrRange } of paramMap.values()) {
        if (parsedErrRange !== null) {
            code505List.push(new C505Class(parsedErrRange));
        }
    }
}
