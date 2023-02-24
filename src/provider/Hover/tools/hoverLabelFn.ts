import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { CAhkLabel } from '../../../AhkSymbol/CAhkLine';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { getFuncWithName } from '../../../tools/DeepAnalysis/getFuncWithName';
import { findLabel } from '../../../tools/labels';
import type { TFuncRef } from '../../Def/getFnRef';
import { fileFuncRef, mayBeIsLabel } from '../../Def/getFnRef';
import { getFucDefWordUpFix } from '../../Def/getFucDefWordUpFix';

/**
 * ```ahk
 * c
 * ```
 */
export function hoverLabelOrFunc(
    AhkFileData: TAhkFileData,
    AhkTokenLine: TAhkTokenLine,
    wordUp: string,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const refMap: ReadonlyMap<string, TFuncRef[]> = fileFuncRef.up(AhkFileData);
    const { character, line } = position;
    const wordUpFix: string = getFucDefWordUpFix(AhkTokenLine, wordUp, character);

    const locList: TFuncRef[] | undefined = refMap.get(wordUpFix);
    if (locList === undefined) return null;

    for (const { line: refLine, col, by } of locList) {
        if (
            (refLine === line)
            && (col <= character && (col + wordUpFix.length) >= character)
        ) {
            if (mayBeIsLabel(by)) {
                const label: CAhkLabel | null = findLabel(wordUpFix);
                if (label !== null) return label.md;
            }

            const fn: CAhkFunc | null = getFuncWithName(wordUpFix);
            if (fn !== null) return fn.md;

            return null;
        }
    }
    return null;
}
