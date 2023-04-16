import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { EDetail } from '../../globalEnum';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';

type TClassFileRefMapRW = Map<string, readonly vscode.Location[]>;

function searchAllClassRefCore(wordUp: string, AhkFileData: TAhkFileData): readonly vscode.Location[] {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const reg = new RegExp(
        `(?<=[%!"/&'()*+,\\-:;<=>?[\\\\^\\]{|}~ \\t]|^)(${wordUp})(?=[(.%!"/&')*+,\\-:;<=>?[\\\\^\\]{|}~ \\t]|$)`,
        //        ^ without .` and #$@                                       ^ // without ` and #$@
        'giu',
    );
    // /(?<=[%!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)\w+/u
    const { DocStrMap, uri, AST } = AhkFileData;

    const DAList: readonly CAhkFunc[] = getDAListTop(AST);

    const fileRefList: vscode.Location[] = [];
    for (const { line, lStr, detail } of DocStrMap) {
        // avoid Label-name same class-name
        if (detail.includes(EDetail.isLabelLine)) continue;

        if (detail.includes(EDetail.isDirectivesLine) && !(/^\s*#if\b/iu).test(lStr)) {
            continue;
        }

        for (const ma of lStr.matchAll(reg)) {
            const col: number | undefined = ma.index;
            if (col === undefined) continue;

            const start: vscode.Position = new vscode.Position(line, col);

            if (DAList.some((ahkFunc: CAhkFunc): boolean => ahkFunc.selectionRange.contains(start))) {
                // avoid class_name === func_name
                //                  === method_name
                //                  === param_name
                continue;
            }

            fileRefList.push(
                new vscode.Location(
                    uri,
                    new vscode.Range(
                        start,
                        new vscode.Position(line, col + wordUp.length),
                    ),
                ),
            );
        }
    }

    return fileRefList;
}

const wmClassRef = new WeakMap<TAhkFileData, TClassFileRefMapRW>();

export function searchAllClassRef(classDef: CAhkClass): readonly vscode.Location[] {
    const wordUp: string = classDef.upName;
    const allList: vscode.Location[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const catchMap: TClassFileRefMapRW = wmClassRef.get(AhkFileData) ?? new Map<string, vscode.Location[]>();

        const refList: readonly vscode.Location[] | undefined = catchMap.get(wordUp);
        if (refList !== undefined) {
            allList.push(...refList);
            continue; // of this file !
        }

        const fileRefList: readonly vscode.Location[] = searchAllClassRefCore(wordUp, AhkFileData);
        catchMap.set(wordUp, fileRefList);
        wmClassRef.set(AhkFileData, catchMap);
        allList.push(...fileRefList);
    }

    // 110-file with out cache need 10ms
    // but has cache just need 0~1ms

    return allList;
}
