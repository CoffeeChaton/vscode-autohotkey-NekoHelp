import type * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import type { TFocExMeta, TFocExParser } from '../../../tools/Built-in/3_foc/focEx.tools';
import {
    focExDefMap,
    focExMapOut,
    getFocExIfData,
    getFocExLoopData,
} from '../../../tools/Built-in/3_foc/focEx.tools';

function FocEx2Md(focExParser: TFocExParser | null, character: number): TFocExMeta | null {
    if (focExParser === null) return null;

    const { lPos, exUpName, FocUpName } = focExParser;
    if (character >= lPos && character <= lPos + exUpName.length) {
        const md: TFocExMeta | undefined = focExMapOut.get(`${FocUpName}${exUpName}`);
        if (md !== undefined) return md;
    }

    return null;
}

function PosGetFocExMeta(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): TFocExMeta | null {
    const { character } = position;
    const {
        fistWordUp,
        fistWordUpCol,
        lStr,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    if (fistWordUp === '') return null;
    if (fistWordUp === 'LOOP') return FocEx2Md(getFocExLoopData(lStr, fistWordUpCol), character);
    if (SecondWordUp === 'LOOP') return FocEx2Md(getFocExLoopData(lStr, SecondWordUpCol), character);

    if (fistWordUp === 'IF') return FocEx2Md(getFocExIfData(lStr, fistWordUpCol), character);
    if (SecondWordUp === 'IF') return FocEx2Md(getFocExIfData(lStr, SecondWordUpCol), character);

    return null;
}

/**
 * ```ahk
 *  if between
 *  if contains
 *  if in
 *  if is
 *  ;--
 *  Loop, Files
 *  Loop, Parse
 *  Loop, Read
 *  Loop, Reg
 *  ```
 */
export function hoverFocEx(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): vscode.MarkdownString | null {
    return PosGetFocExMeta(AhkTokenLine, position)?.md ?? null;
}

export function gotoFocExDef(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): [vscode.Location] | undefined {
    const id: string | undefined = PosGetFocExMeta(AhkTokenLine, position)?.ID;
    if (id === undefined) return undefined;
    return focExDefMap.get(id);
}
