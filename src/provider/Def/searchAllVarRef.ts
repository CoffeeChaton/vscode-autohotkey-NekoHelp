import * as vscode from 'vscode';
import type { TValMetaOut } from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';
import { EDetail } from '../../globalEnum';

export function searchAllVarRef(wordUp: string): vscode.Location[] {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const reg = new RegExp(`\\b(${wordUp})\\b`, 'giu');

    const List: vscode.Location[] = [];
    for (const { DocStrMap, uri } of pm.getDocMapValue()) {
        //
        for (const { line, lStr, detail } of DocStrMap) {
            if (detail.includes(EDetail.isLabelLine)) continue; // avoid Label-name same as global-variable-name

            for (const ma of lStr.matchAll(reg)) {
                const col: number | undefined = ma.index;
                if (col === undefined) continue;

                List.push(
                    new vscode.Location(
                        uri,
                        new vscode.Range(
                            new vscode.Position(line, col),
                            new vscode.Position(line, col + wordUp.length),
                        ),
                    ),
                );
            }
        }
    }

    return List; // ssd -> 9~11ms (if not gc)
}

export function searchAllGlobalVarRef(wordUp: string): vscode.Location[] {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const reg = new RegExp(`\\b(${wordUp})\\b(?!\\(|\\s*:[^=])`, 'giu');

    const List: vscode.Location[] = [];
    for (const { DocStrMap, uri, ModuleVar } of pm.getDocMapValue()) {
        const v: TValMetaOut | undefined = ModuleVar.ModuleValMap.get(wordUp);
        if (v !== undefined) {
            for (const range of [...v.defRangeList, ...v.refRangeList]) {
                List.push(
                    new vscode.Location(
                        uri,
                        range,
                    ),
                );
            }
        }

        //
        for (const { line, lStr, detail } of DocStrMap) {
            if (detail.includes(EDetail.isLabelLine)) continue; // avoid Label-name same as global-variable-name

            for (const ma of lStr.matchAll(reg)) {
                const col: number | undefined = ma.index;
                if (col === undefined) continue;

                List.push(
                    new vscode.Location(
                        uri,
                        new vscode.Range(
                            new vscode.Position(line, col),
                            new vscode.Position(line, col + wordUp.length),
                        ),
                    ),
                );
            }
        }
    }

    return List; // ssd -> 9~11ms (if not gc)
}
