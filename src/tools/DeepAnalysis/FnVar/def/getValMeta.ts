import * as vscode from 'vscode';
import type { TAssociated, TValMapIn, TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import type { EFnMode } from '../EFnMode';
import { wrapFnValDef } from './wrapFnValDef';

type TValMeta = {
    line: number,
    character: number,
    RawName: string,
    valMap: TValMapIn,
    lineComment: string,
    fnMode: EFnMode,
    Associated: TAssociated | null,
};

export function getValMeta(
    {
        line,
        character,
        RawName,
        valMap,
        lineComment,
        fnMode,
        Associated,
    }: TValMeta,
): TValMetaIn {
    const defRange: vscode.Range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + RawName.length),
    );

    return wrapFnValDef({
        RawNameNew: RawName,
        valMap,
        defRange,
        lineComment,
        fnMode,
        Associated,
    });
}
