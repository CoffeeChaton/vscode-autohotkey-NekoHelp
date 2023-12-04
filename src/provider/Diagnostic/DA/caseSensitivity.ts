import type {
    TParamMapOut,
    TValMapOut,
    TVarData,
} from '../../../AhkSymbol/CAhkFunc';
import type { EPrefixC502 } from './CDiagFnLib/C502Class';
import { C502Class } from './CDiagFnLib/C502Class';

export function caseSensitivityVar(
    prefix: EPrefixC502,
    paramOrValMap: TParamMapOut | TValMapOut,
    diagList: C502Class[],
    maxDiag: number,
    displayErrList: readonly boolean[],
): void {
    if (diagList.length >= maxDiag) {
        return;
    }

    for (const ValAnalysis of paramOrValMap.values()) {
        const {
            defRangeList,
            refRangeList,
            keyRawName,
        } = ValAnalysis;

        const arrMain: readonly TVarData[] = [...defRangeList, ...refRangeList];
        for (const { c502, range } of arrMain) {
            if (c502 === 0) continue;

            if (!displayErrList[range.start.line]) continue;

            const diagFn: C502Class = new C502Class(
                {
                    defRange: defRangeList[0].range,
                    defStr: keyRawName,
                    prefix,
                    refRange: range,
                    refStr: c502,
                },
            );

            diagList.push(diagFn);
            if (diagList.length >= maxDiag) {
                return;
            }
            break; // of  for (let i
        }
    }
}
