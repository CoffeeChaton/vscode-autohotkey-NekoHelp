import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { RefLike2Location } from './getFnRef';
import { getFucDefWordUpFix } from './getFucDefWordUpFix';
import { isPosAtMethodName } from './isPosAtMethodName';
import { posAtFnRef } from './posAtFnRef';

export function getFuncDef(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const { AST, DocStrMap } = AhkFileData;

    if (isPosAtMethodName(getDAWithPos(AST, position), position)) return null;

    const { line, character } = position;
    const AhkTokenLine: TAhkTokenLine = DocStrMap[line];

    // dprint-ignore
    const wordUpFix: string = getFucDefWordUpFix(AhkTokenLine, wordUp, character);
    const funcSymbol: CAhkFunc | null = getFuncWithName(wordUpFix);
    if (funcSymbol === null) return null;

    if (
        !posAtFnRef({
            AhkTokenLine,
            position,
            wordUpFix,
        })
    ) {
        // c := c();
        // No   Yes check pos at like func()
        return null;
    }

    if (listAllUsing) {
        //   log.info(`list Ref of ${funcSymbol.name}() , use ${Date.now() - timeStart} ms`);
        return RefLike2Location(funcSymbol);
    }

    const { uri } = AhkFileData;
    if (
        (funcSymbol.uri.fsPath === uri.fsPath
            && funcSymbol.nameRange.contains(position))
    ) {
        // OK..i know who to go to References...
        // keep uri as old uri && return old pos/range
        // don't new vscode.Uri.file()
        return [new vscode.Location(uri, funcSymbol.nameRange)]; // let auto use getReference
    }

    //  log.info(`goto def of ${funcSymbol.name}() , use ${Date.now() - timeStart} ms`); // ssd -> 0~1ms
    return [new vscode.Location(funcSymbol.uri, funcSymbol.selectionRange)];
}
