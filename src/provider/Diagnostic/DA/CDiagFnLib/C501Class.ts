import * as vscode from 'vscode';
import type { TParamMapOut, TVarData } from '../../../../AhkSymbol/CAhkFunc';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../../tools/CDiagFn';

export class C501Class extends CDiagFn {
    //
    declare public readonly value: EDiagCodeDA.code501;

    public constructor(defRangeList: readonly TVarData[]) {
        super({
            value: EDiagCodeDA.code501,
            range: defRangeList[0].range,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Unnecessary],
            message: DiagsDA[EDiagCodeDA.code501].msg,
        });
    }
}

export function NeverUsedParam(
    paramMap: TParamMapOut,
    code501List: C501Class[],
    displayErrList: readonly boolean[],
): void {
    for (const v of paramMap.values()) {
        const {
            isByRef,
            refRangeList,
            keyRawName,
            defRangeList,
        } = v;

        if (
            isByRef
            || refRangeList.length > 0
            || keyRawName.startsWith('_')
            || !displayErrList[defRangeList[0].range.start.line]
        ) {
            continue;
        }

        code501List.push(new C501Class(defRangeList));
    }
}
