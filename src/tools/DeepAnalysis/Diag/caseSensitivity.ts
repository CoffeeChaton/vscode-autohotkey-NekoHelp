import type * as vscode from 'vscode';
import type { TC502New, TParamMapOut, TValMapOut } from '../../../AhkSymbol/CAhkFunc';
import type { EPrefixC502 } from '../../../provider/Diagnostic/tools/CDiagFnLib/C502Class';
import { C502Class } from '../../../provider/Diagnostic/tools/CDiagFnLib/C502Class';

function getRangeOfC502(
    defRangeList: readonly vscode.Range[],
    refRangeList: readonly vscode.Range[],
    i: number,
): vscode.Range {
    const defRangeListLen: number = defRangeList.length;
    if (defRangeListLen > i) {
        return defRangeList[i];
    }
    return refRangeList[i - defRangeListLen];
}

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
            c502Array,
            defRangeList,
            refRangeList,
            keyRawName,
        } = ValAnalysis;

        const c502ArrayLen: number = c502Array.length;
        for (let i = 0; i < c502ArrayLen; i++) {
            /**
             * refStr: TC502New : string | 0
             * 0 is mean OK
             */
            const refStr: TC502New = c502Array[i]; // string | 0
            if (refStr === 0) continue;

            const refRange: vscode.Range = getRangeOfC502(defRangeList, refRangeList, i);
            if (!displayErrList[refRange.start.line]) continue;

            const diagFn: C502Class = new C502Class(
                {
                    defRange: defRangeList[0],
                    defStr: keyRawName,
                    prefix,
                    refRange,
                    refStr,
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
