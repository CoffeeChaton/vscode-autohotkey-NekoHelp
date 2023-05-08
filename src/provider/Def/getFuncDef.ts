import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { getAllFunc } from '../../tools/Func/getAllFunc';
import type { TLineFnCall } from './getFnRef';
import { fixComObjConnect, RefLike2Location } from './getFnRef';
import { getFucDefWordUpFix } from './getFucDefWordUpFix';
import { getMethodRef } from './getMethodRef';
import { isPosAtMethodName } from './isPosAtMethodName';
import { posAtFnRef } from './posAtFnRef';

function fixComObjConnectDef(
    AhkFileData: TAhkFileData,
    wordUp: string,
    position: vscode.Position,
): TLineFnCall | undefined {
    const arr: readonly TLineFnCall[] = fixComObjConnect.up(AhkFileData);
    if (arr.length === 0) return undefined;
    const { line } = position;

    return arr.find((v: TLineFnCall): boolean => v.line === line && v.upName === wordUp);
}

function ComObjConnectRegisterFindAllFuncLoc(ComObjConnectRegister: TLineFnCall): vscode.Location[] {
    const locList: vscode.Location[] = [];
    const { upName } = ComObjConnectRegister;

    for (const [k, v] of getAllFunc()) {
        if (k.startsWith(upName)) {
            locList.push(new vscode.Location(v.uri, v.selectionRange));
        }
    }
    return locList;
}

export function getFuncDef(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const { AST, DocStrMap } = AhkFileData;

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    if (DA !== null && isPosAtMethodName(DA, position)) {
        return listAllUsing
            ? getMethodRef(DA)
            : [new vscode.Location(DA.uri, DA.nameRange)];
    }

    const { line, character } = position;
    const AhkTokenLine: TAhkTokenLine = DocStrMap[line];

    // dprint-ignore
    const wordUpFix: string = getFucDefWordUpFix(AhkTokenLine, wordUp, character);
    const funcSymbol: CAhkFunc | null = getFuncWithName(wordUpFix);
    if (funcSymbol === null) {
        const ComObjConnectRegister: TLineFnCall | undefined = fixComObjConnectDef(AhkFileData, wordUp, position);
        return ComObjConnectRegister === undefined
            ? null
            : ComObjConnectRegisterFindAllFuncLoc(ComObjConnectRegister);
    }

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
