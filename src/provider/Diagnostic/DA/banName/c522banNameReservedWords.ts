import type * as vscode from 'vscode';
import type { CAhkFunc, TParamMapOut, TValMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { getConfig } from '../../../../configUI';
import type { TAhkFileData } from '../../../../core/ProjectManager';
import type { DeepReadonly } from '../../../../globalEnum';
import { getDAListTop } from '../../../../tools/DeepAnalysis/getDAList';
import type { TFnMap } from '../../../../tools/visitor/getFileAllFuncMap';
import { getFileAllFuncMap } from '../../../../tools/visitor/getFileAllFuncMap';
import type { CDiagFn } from '../../tools/CDiagFn';
import { C522Class } from '../CDiagFnLib/C522Class';

function c522DisplayErr(
    range: DeepReadonly<vscode.Range> | vscode.Range,
    displayFnErrList: readonly boolean[],
): boolean {
    const { line } = range.start;
    return displayFnErrList[line];
}

function c522banVarName(
    map: TParamMapOut | TValMapOut,
    kUp: string,
    displayFnErrList: readonly boolean[],
    diag522List: C522Class[],
): void {
    const data = map.get(kUp);
    if (data !== undefined) {
        const { range } = data.defRangeList[0];
        if (c522DisplayErr(range, displayFnErrList)) {
            diag522List.push(new C522Class(range, false));
        }
    }
}

type TC522MemoMap = Map<string, readonly CDiagFn[]>;
const c522Memo = new WeakMap<TAhkFileData, TC522MemoMap>();

export function c522banNameReservedWords(
    AhkFileData: TAhkFileData,
    displayFnErrList: readonly boolean[],
): readonly CDiagFn[] {
    const { AST, ModuleVar } = AhkFileData;
    const { ModuleValMap } = ModuleVar;
    const fnMap: TFnMap = getFileAllFuncMap(AST);

    const { code522 } = getConfig().Diag; // MEMO ? js -> json -> string -> weakMap<AhkFileData,Map<json,readonly CDiagFn[]>>
    const arr: string[] = code522
        .toUpperCase()
        .split(',')
        .sort();
    const code522Format: string = arr.join(',');

    const map: TC522MemoMap = c522Memo.get(AhkFileData) ?? new Map<string, readonly CDiagFn[]>();

    const cacheDiag: readonly CDiagFn[] | undefined = map.get(code522Format);
    if (cacheDiag !== undefined) {
        return cacheDiag;
    }

    const diag522List: C522Class[] = [];
    // max loop 20
    for (const k of arr) {
        const kUp: string = k.toUpperCase();
        const ahkFunc: CAhkFunc | undefined = fnMap.get(kUp); // O(1)
        if (ahkFunc !== undefined) {
            const range: vscode.Range = ahkFunc.nameRange;
            if (c522DisplayErr(range, displayFnErrList)) {
                diag522List.push(new C522Class(range, true));
            }
        }

        for (const { paramMap, valMap } of getDAListTop(AST)) { // O(n)
            c522banVarName(paramMap, kUp, displayFnErrList, diag522List);
            c522banVarName(valMap, kUp, displayFnErrList, diag522List);
        }

        c522banVarName(ModuleValMap, kUp, displayFnErrList, diag522List); // O(1)
    }

    //
    map.set(code522Format, diag522List);
    c522Memo.set(AhkFileData, map);
    //
    return diag522List;
}
