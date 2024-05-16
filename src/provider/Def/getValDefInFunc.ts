import * as vscode from 'vscode';
import type {
    CAhkFunc,
    TParamMetaOut,
    TValMapOut,
    TValMetaIn,
    TValMetaOut,
    TVarData,
} from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFucDefWordUpFix } from './getFucDefWordUpFix';
import { searchAllGlobalVarDef } from './searchAllGlobalVarDef';
import { searchAllGlobalVarRef } from './searchAllVarRef';

function rangeList2LocList(rangeList: TVarData[], uri: vscode.Uri): vscode.Location[] {
    return rangeList.map(({ range }: TVarData): vscode.Location => new vscode.Location(uri, range));
}

function metaRangeList(
    defRangeList: TVarData[],
    refRangeList: TVarData[],
    listAllUsing: boolean,
    position: vscode.Position,
    uri: vscode.Uri,
): vscode.Location[] {
    if (listAllUsing) {
        return rangeList2LocList([...defRangeList, ...refRangeList], uri);
    }

    return defRangeList[0].range.contains(position)
        ? [new vscode.Location(uri, position)]
        : rangeList2LocList(defRangeList, uri);
}

function getStringSplitDef(
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
    uri: vscode.Uri,
    Map: TValMapOut,
): vscode.Location[] | null {
    // #11 StringSplit https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/11
    if ((/\d+$/u).test(wordUp)) {
        //
        const chUpNameFa: string = wordUp.replace(/\d+$/u, '');
        const oldValStringSplit: TValMetaIn | undefined = Map.get(chUpNameFa);
        if (oldValStringSplit !== undefined) {
            const { defRangeList, refRangeList } = oldValStringSplit;
            for (const { range } of refRangeList) {
                if (range.contains(position)) {
                    return metaRangeList(defRangeList, refRangeList, listAllUsing, position, uri);
                }
            }
        }
    }
    return null;
}

function getModuleVarDef(
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
    uri: vscode.Uri,
    AhkFileData: TAhkFileData,
): vscode.Location[] | null {
    const { ModuleVar, DocStrMap } = AhkFileData;

    const wordUpFix: string = getFucDefWordUpFix(DocStrMap[position.line], wordUp, position.character);

    const valMeta: TValMetaOut | undefined = ModuleVar.ModuleValMap.get(wordUpFix);
    if (valMeta !== undefined) {
        if (listAllUsing) {
            return searchAllGlobalVarRef(wordUpFix);
        }
        const Locations: vscode.Location[] = searchAllGlobalVarDef(wordUp);

        return Locations.length === 0
            ? rangeList2LocList(valMeta.defRangeList, uri)
            : Locations;
    }

    return getStringSplitDef(
        position,
        wordUp,
        listAllUsing,
        uri,
        ModuleVar.ModuleValMap,
    );
}

export function getValDefInFunc(
    AhkFileData: TAhkFileData,
    uri: vscode.Uri,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const { AST } = AhkFileData;

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    if (DA === null) return getModuleVarDef(position, wordUp, listAllUsing, uri, AhkFileData);

    if (DA.nameRange.contains(position)) return null; // fnName === val

    const { paramMap, valMap } = DA;
    const argMeta: TParamMetaOut | TValMetaOut | undefined = paramMap.get(wordUp) ?? valMap.get(wordUp);
    if (argMeta !== undefined) {
        const { defRangeList, refRangeList } = argMeta;
        return metaRangeList(defRangeList, refRangeList, listAllUsing, position, uri);
    }

    return getStringSplitDef(position, wordUp, listAllUsing, uri, valMap)
        ?? getModuleVarDef(position, wordUp, listAllUsing, uri, AhkFileData);
}
