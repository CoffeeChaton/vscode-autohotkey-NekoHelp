import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { getConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { enumLog } from '../../tools/enumErr';
import type { TMethodRef } from '../../tools/Method/fileMethodRef';
import { fileMethodRef } from '../../tools/Method/fileMethodRef';
import { getMethodPrecisionMode } from '../../tools/Method/Method';
import { searchAllClassRefNew } from './searchAllClassRefNew';

function MethodRef2Location(
    uri: vscode.Uri,
    refList: readonly TMethodRef[],
): vscode.Location[] {
    const list: vscode.Location[] = [];
    for (const ref of refList) {
        list.push(new vscode.Location(uri, ref.range));
    }
    return list;
}

function MethodRef2LocationPrecision(
    uri: vscode.Uri,
    refList: readonly TMethodRef[],
    AhkFileData: TAhkFileData,
    DA: CAhkFunc,
): vscode.Location[] {
    const list: vscode.Location[] = [];
    for (const ref of refList) {
        const DAList: readonly CAhkFunc[] | null = getMethodPrecisionMode(ref, AhkFileData);
        if (DAList === null) continue;
        if (DAList.includes(DA)) {
            list.push(new vscode.Location(uri, ref.range));
        }
    }
    return list;
}

export function getMethodRef(DA: CAhkFunc): vscode.Location[] | null {
    const { findAllRef } = getConfig().method;

    const list: vscode.Location[] = [new vscode.Location(DA.uri, DA.selectionRange)];

    const wordUp: string = DA.upName;
    if (wordUp === '__NEW') {
        const className: string = DA.defStack[0];
        return searchAllClassRefNew(className, list);
        //
    }

    for (const AhkFileData of pm.getDocMapValue()) {
        const refList: readonly TMethodRef[] | undefined = fileMethodRef.up(AhkFileData).get(wordUp);
        if (refList === undefined) continue;

        const { uri } = AhkFileData;

        switch (findAllRef) {
            case 'loose_mode':
                list.push(...MethodRef2Location(uri, refList));
                break;

            case 'precision_mode':
                list.push(...MethodRef2LocationPrecision(uri, refList, AhkFileData, DA));
                break;
            default:
                enumLog(findAllRef, 'getMethodRef');
                break;
        }
    }
    return list;
}
