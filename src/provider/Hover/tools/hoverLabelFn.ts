/* eslint-disable max-depth */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { CAhkLabel } from '../../../AhkSymbol/CAhkLine';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { getFuncWithName } from '../../../tools/DeepAnalysis/getFuncWithName';
import { findLabelAll } from '../../../tools/labelsAll';
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
    const refMap: ReadonlyMap<string, readonly TFuncRef[]> = fileFuncRef.up(AhkFileData);
    const { character, line } = position;
    const wordUpFix: string = getFucDefWordUpFix(AhkTokenLine, wordUp, character);

    const locList: readonly TFuncRef[] | undefined = refMap.get(wordUpFix);
    if (locList === undefined) return null;

    for (const { line: refLine, col, by } of locList) {
        if (
            (refLine === line)
            && (col <= character && (col + wordUpFix.length) >= character)
        ) {
            if (mayBeIsLabel(by)) {
                const labelList: CAhkLabel[] = findLabelAll(wordUpFix);
                if (labelList.length > 0) {
                    const allMd = new vscode.MarkdownString('');
                    for (const label of labelList) {
                        allMd
                            .appendMarkdown(label.md.value)
                            .appendMarkdown('\n***\n');
                    }

                    return allMd;
                }
            }

            const fn: CAhkFunc | null = getFuncWithName(wordUpFix);
            if (fn !== null) return fn.md;

            return null;
        }
    }
    return null;
}
