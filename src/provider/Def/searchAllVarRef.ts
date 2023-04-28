import * as vscode from 'vscode';
import type { TTextMetaOut, TValMetaOut } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';

type TFileGVarRefMap = Map<string, readonly vscode.Location[]>;
const fileGVarRefMap = new WeakMap<TAhkFileData, TFileGVarRefMap>();

function LocListPush(
    uri: vscode.Uri,
    fileList: vscode.Location[],
    rangeList1: readonly vscode.Range[],
    rangeList2: readonly vscode.Range[],
): void {
    for (const range of rangeList1) {
        fileList.push(
            new vscode.Location(
                uri,
                range,
            ),
        );
    }
    for (const range of rangeList2) {
        fileList.push(
            new vscode.Location(
                uri,
                range,
            ),
        );
    }
}

function searchAllGlobalVarRefCore(AhkFileData: TAhkFileData, wordUp: string): readonly vscode.Location[] {
    const fileList: vscode.Location[] = [];

    const {
        AST,
        ModuleVar,
        uri,
    } = AhkFileData;
    const v: TValMetaOut | undefined = ModuleVar.ModuleValMap.get(wordUp);
    if (v === undefined) {
        const text: TTextMetaOut | undefined = ModuleVar.ModuleTextMap.get(wordUp);
        if (text !== undefined) {
            LocListPush(uri, fileList, [], text.refRangeList);
        }
    } else {
        LocListPush(uri, fileList, v.defRangeList, v.refRangeList);
    }

    for (const DA of getDAListTop(AST)) {
        const v2: TValMetaOut | undefined = DA.valMap.get(wordUp);
        if (v2 === undefined) {
            const text: TTextMetaOut | undefined = DA.textMap.get(wordUp);
            if (text !== undefined) {
                LocListPush(uri, fileList, [], text.refRangeList);
            }
        } else {
            LocListPush(uri, fileList, v2.defRangeList, v2.refRangeList);
        }
    }

    return fileList;
}

export function searchAllGlobalVarRef(wordUp: string): vscode.Location[] {
    const List: vscode.Location[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const map: TFileGVarRefMap = fileGVarRefMap.get(AhkFileData) ?? new Map<string, readonly vscode.Location[]>();
        const cache: readonly vscode.Location[] | undefined = map.get(wordUp);
        if (cache !== undefined) {
            List.push(...cache);
            continue;
        }
        const fileList: readonly vscode.Location[] = searchAllGlobalVarRefCore(AhkFileData, wordUp);
        map.set(wordUp, fileList);
        fileGVarRefMap.set(AhkFileData, map);
        List.push(...fileList);
    }

    return List; // ssd -> 9~11ms (if not gc)
}
