import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { EDetail } from '../../globalEnum';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';

type TClassFileRefNewMapRW = Map<string, readonly vscode.Location[]>;

function searchAllClassRefCoreNew(wordUp: string, AhkFileData: TAhkFileData): readonly vscode.Location[] {
    const reg = new RegExp(
        `(?<=(?:[%!"/&'()*+,\\-:;<=>?[\\\\^\\]{|}~ \\t]|^)(?:new[ \\t]+))(${wordUp})(?=[(.%!"/&')*+,\\-:;<=>?[\\\\^\\]{|}~ \\t]|$)`,
        //        ^ without .` and #$@                                       ^ // without ` and #$@
        'giu',
    );

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

const wmClassNewRef = new WeakMap<TAhkFileData, TClassFileRefNewMapRW>();

export function searchAllClassRefNew(wordUp: string, listRaw: vscode.Location[]): vscode.Location[] {
    const allList: vscode.Location[] = [...listRaw];
    for (const AhkFileData of pm.getDocMapValue()) {
        const catchMap: TClassFileRefNewMapRW = wmClassNewRef.get(AhkFileData) ?? new Map<string, vscode.Location[]>();

        const refList: readonly vscode.Location[] | undefined = catchMap.get(wordUp);
        if (refList !== undefined) {
            allList.push(...refList);
            continue; // of this file !
        }

        const fileRefList: readonly vscode.Location[] = searchAllClassRefCoreNew(wordUp, AhkFileData);
        catchMap.set(wordUp, fileRefList);
        wmClassNewRef.set(AhkFileData, catchMap);
        allList.push(...fileRefList);
    }

    return allList;
}
