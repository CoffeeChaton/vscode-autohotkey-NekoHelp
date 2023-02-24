import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { getUserDefTopClassSymbol } from '../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { searchAllVarRef } from './searchAllVarRef';

export function getClassDef(
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const classDef: CAhkClass | null = getUserDefTopClassSymbol(wordUp);
    if (classDef === null) {
        return null;
    }

    return listAllUsing
        ? searchAllVarRef(wordUp)
        : [new vscode.Location(classDef.uri, classDef.selectionRange)]; // ssd -> 0~1 ms
}

// new CoI.__Tabs(tabs)
// class Coi {
//     class __Tabs {
//
//          __New(p){
//              this.p := p
//         }
//     }
// }
