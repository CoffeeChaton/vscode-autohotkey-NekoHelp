import * as vscode from 'vscode';
import type { TParamMetaIn, TValMetaIn, TVarData } from '../../AhkSymbol/CAhkFunc';
import { newC502 } from './FnVar/def/c502';

export function pushDef(
    oldDef: TParamMetaIn | TValMetaIn,
    keyRawName: string,
    line: number,
    character: number,
): null {
    const startPos: vscode.Position = new vscode.Position(line, character);
    if (oldDef.defRangeList.some((varData: TVarData): boolean => varData.range.contains(startPos))) {
        return null;
    }

    const range: vscode.Range = new vscode.Range(
        startPos,
        new vscode.Position(line, character + keyRawName.length),
    );

    oldDef.defRangeList.push({
        range,
        c502: newC502(oldDef.keyRawName, keyRawName),
    });
    return null;
}
