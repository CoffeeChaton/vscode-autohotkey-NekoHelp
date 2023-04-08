import * as vscode from 'vscode';
import type { TParamMetaIn, TValMetaIn } from '../../AhkSymbol/CAhkFunc';
import { newC502 } from './FnVar/def/c502';

export function pushRef(
    oldDef: TParamMetaIn | TValMetaIn,
    keyRawName: string,
    line: number,
    character: number,
): null {
    const startPos: vscode.Position = new vscode.Position(line, character);
    if (oldDef.defRangeList.some((defRange: vscode.Range): boolean => defRange.contains(startPos))) {
        return null;
    }

    const range: vscode.Range = new vscode.Range(
        startPos,
        new vscode.Position(line, character + keyRawName.length),
    );

    oldDef.refRangeList.push(range);
    oldDef.c502Array.push(newC502(oldDef.keyRawName, keyRawName));
    return null;
}
