import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { getUserDefTopClassSymbol } from '../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { searchAllClassRef } from './searchAllClassRef';

export function getClassDef(
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const classDef: CAhkClass | null = getUserDefTopClassSymbol(wordUp);
    if (classDef === null) {
        return null;
    }

    return listAllUsing
        ? [...searchAllClassRef(classDef)]
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
