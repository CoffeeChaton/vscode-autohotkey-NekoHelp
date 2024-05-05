import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';

type TFileGVarDefMap = Map<string, readonly vscode.Location[]>;
const fileGVarDefMap = new WeakMap<TAhkFileData, TFileGVarDefMap>();

function searchGlobalSetVarCore(AhkFileData: TAhkFileData, wordUp: string): readonly vscode.Location[] {
    const fileList: vscode.Location[] = [];

    const { DocStrMap, uri } = AhkFileData;
    const searchReg = new RegExp(`(?<=\\s|,|^)${wordUp}\\s*:=`, 'giu');

    const wordLen: number = wordUp.length;

    const { length } = DocStrMap;
    for (let i = 0; i < length; i++) {
        const { fistWordUp, lStr, line } = DocStrMap[i];

        if (fistWordUp === 'LOCAL' || fistWordUp === 'STATIC') {
            for (let j = i + 1; j < length; j++) {
                const element: TAhkTokenLine = DocStrMap[j];
                if (element.cll === 0) break;
                i = j;
            }
            continue;
        }

        //
        for (const ma of lStr.matchAll(searchReg)) {
            fileList.push(
                new vscode.Location(
                    uri,
                    new vscode.Range(
                        new vscode.Position(line, ma.index),
                        new vscode.Position(line, ma.index + wordLen),
                    ),
                ),
            );
        }
    }

    return fileList;
}

export function searchAllGlobalVarDef(wordUp: string): vscode.Location[] {
    const List: vscode.Location[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const map: TFileGVarDefMap = fileGVarDefMap.get(AhkFileData) ?? new Map<string, readonly vscode.Location[]>();
        const cache: readonly vscode.Location[] | undefined = map.get(wordUp);
        if (cache !== undefined) {
            List.push(...cache);
            continue;
        }
        const fileList: readonly vscode.Location[] = searchGlobalSetVarCore(AhkFileData, wordUp);
        map.set(wordUp, fileList);
        fileGVarDefMap.set(AhkFileData, map);
        List.push(...fileList);
    }

    return List;
}
