import * as vscode from 'vscode';
import type { TAhkFileData } from '../../../../core/ProjectManager';
import { EDiagCodeDA } from '../../../../diag';
import type { TGVarRefMeta } from '../../../CodeLens/addGVarReference';
import { GVarRefCore } from '../../../CodeLens/addGVarReference';
import { CDiagFn } from '../../tools/CDiagFn';

export class C508Class extends CDiagFn {
    //
    declare public readonly value: EDiagCodeDA.code508;

    public constructor(range: vscode.Range, rawName: string) {
        super({
            value: EDiagCodeDA.code508,
            range,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Unnecessary],
            message: `global-var "${rawName}" is assigned but never used.`,
        });
    }
}

export function NeverUsedGVar(
    code508Max: number,
    displayFnErrList: readonly boolean[],
    AhkFileData: TAhkFileData,
): C508Class[] {
    const code508List: C508Class[] = [];
    const GVarRefMeta: readonly TGVarRefMeta[] = GVarRefCore(AhkFileData);

    for (const v of GVarRefMeta) {
        const {
            rawName,
            refList,
            range,
            position,
        } = v;

        if (refList.length > 1 || !displayFnErrList[position.line]) continue;

        code508List.push(new C508Class(range, rawName));
        if (code508List.length >= code508Max) break;
    }
    return code508List;
}
