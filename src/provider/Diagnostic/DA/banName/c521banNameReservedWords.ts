import type * as vscode from 'vscode';
import type { CAhkFunc, TParamMapOut, TValMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { getDiagConfig } from '../../../../configUI';
import type { TAhkFileData } from '../../../../core/ProjectManager';
import type { DeepReadonly } from '../../../../globalEnum';
import { getDAListTop } from '../../../../tools/DeepAnalysis/getDAList';
import type { TFnMap } from '../../../../tools/visitor/getFileAllFuncMap';
import { getFileAllFuncMap } from '../../../../tools/visitor/getFileAllFuncMap';
import type { CDiagFn } from '../../tools/CDiagFn';
import { C521Class } from '../CDiagFnLib/C521Class';

function c521DisplayErr(
    range: DeepReadonly<vscode.Range> | vscode.Range,
    displayFnErrList: readonly boolean[],
): boolean {
    const { line } = range.start;
    return displayFnErrList[line];
}

function c521banVarName(
    map: TParamMapOut | TValMapOut,
    kUp: string,
    displayFnErrList: readonly boolean[],
    diag521List: C521Class[],
): void {
    const data = map.get(kUp);
    if (data !== undefined) {
        const range: DeepReadonly<vscode.Range> = data.defRangeList[0];
        if (c521DisplayErr(range, displayFnErrList)) {
            diag521List.push(new C521Class(range, false));
        }
    }
}

type TC521MemoMap = Map<string, readonly CDiagFn[]>;
const c521Memo = new WeakMap<TAhkFileData, TC521MemoMap>();

export function c521banNameReservedWords(
    AhkFileData: TAhkFileData,
    displayFnErrList: readonly boolean[],
): readonly CDiagFn[] {
    const { AST, ModuleVar } = AhkFileData;
    const { ModuleValMap } = ModuleVar;
    const fnMap: TFnMap = getFileAllFuncMap(AST);

    const { code521 } = getDiagConfig(); // MEMO ? js -> json -> string -> weakMap<AhkFileData,Map<json,readonly CDiagFn[]>>
    const arr: string[] = [...Object.entries(code521)]
        .filter((a: [string, boolean]): boolean => a[1])
        .map((a: [string, boolean]): string => a[0])
        .sort();
    const arrStr: string = arr.join(',');

    const map: TC521MemoMap = c521Memo.get(AhkFileData) ?? new Map<string, readonly CDiagFn[]>();

    const cacheDiag: readonly CDiagFn[] | undefined = map.get(arrStr);
    if (cacheDiag !== undefined) {
        return cacheDiag;
    }

    const diag521List: C521Class[] = [];
    // max loop 20
    for (const k of arr) {
        const kUp: string = k.toUpperCase();
        const ahkFunc: CAhkFunc | undefined = fnMap.get(kUp); // O(1)
        if (ahkFunc !== undefined) {
            const range: vscode.Range = ahkFunc.nameRange;
            if (c521DisplayErr(range, displayFnErrList)) {
                diag521List.push(new C521Class(range, true));
            }
        }

        for (const { paramMap, valMap } of getDAListTop(AST)) { // O(n)
            c521banVarName(paramMap, kUp, displayFnErrList, diag521List);
            c521banVarName(valMap, kUp, displayFnErrList, diag521List);
        }

        c521banVarName(ModuleValMap, kUp, displayFnErrList, diag521List); // O(1)
    }

    //
    map.set(arrStr, diag521List);
    c521Memo.set(AhkFileData, map);
    //
    return diag521List;
}
