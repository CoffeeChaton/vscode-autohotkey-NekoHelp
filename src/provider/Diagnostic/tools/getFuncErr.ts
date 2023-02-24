import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAhkSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../diag';
import type { TTokenStream } from '../../../globalEnum';
import { EMultiline } from '../../../globalEnum';
import { CDiagBase } from './CDiagBase';

function fnErrCheck(DocStrMap: TTokenStream, func: TAhkSymbol, maxFnSize: number): boolean {
    const st = func.selectionRange.end.line;
    const ed = func.range.end.line;
    if (ed - st < maxFnSize) return false;

    let fnSize = 0;
    for (let line = st; line < ed; line++) {
        const { lStr, multiline } = DocStrMap[line];
        if (lStr === '' || multiline === EMultiline.mid) continue;

        fnSize++;
        if (fnSize >= maxFnSize) return true;
    }
    return false;
}

type TFuncMaxSizeLint = {
    cacheDiag: readonly CDiagBase[],
    maxFnSize: number,
};
const wm = new WeakMap<TTokenStream, TFuncMaxSizeLint>();

export function getFuncSizeErr(
    CAhkFuncList: readonly CAhkFunc[],
    DocStrMap: TTokenStream,
    maxFnSize: number,
): readonly CDiagBase[] {
    const cache: TFuncMaxSizeLint | undefined = wm.get(DocStrMap);
    if (cache !== undefined && cache.maxFnSize === maxFnSize) {
        return cache.cacheDiag;
    }

    const diagS: CDiagBase[] = [];
    for (const func of CAhkFuncList) {
        if (DocStrMap[func.range.start.line].displayErr && fnErrCheck(DocStrMap, func, maxFnSize)) {
            diagS.push(
                new CDiagBase({
                    value: EDiagCode.code301,
                    range: func.selectionRange,
                    severity: vscode.DiagnosticSeverity.Warning,
                    tags: [],
                }),
            );
        }
    }

    wm.set(DocStrMap, {
        cacheDiag: diagS,
        maxFnSize,
    });

    return diagS;
}
