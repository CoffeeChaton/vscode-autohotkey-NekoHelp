import * as vscode from 'vscode';
import { EInclude } from '../../AhkSymbol/CAhkInclude';
import { collectInclude } from '../../command/tools/collectInclude';
import type { TAhkFileData } from '../../core/ProjectManager';
import { EDetail } from '../../globalEnum';

export function gotoIncludeDef(AhkFileData: TAhkFileData, position: vscode.Position): vscode.Location | null {
    //
    const { DocStrMap, AST } = AhkFileData;
    const { line } = position;
    const { detail, lStr } = DocStrMap[line];

    if (detail.includes(EDetail.isDirectivesLine) && (/^\s*#Include(?:Again)?\s/iu).test(lStr)) {
        //
        for (const ahkInclude of collectInclude(AST)) {
            if (ahkInclude.range.contains(position)) {
                const { rawData } = ahkInclude;
                const { type, mayPath } = rawData;
                if ([EInclude.Absolute, EInclude.A_LineFile].includes(type)) {
                    return new vscode.Location(vscode.Uri.file(mayPath), new vscode.Position(0, 0));
                }
                void vscode.window.showInformationMessage(
                    '`#include` goto def just support `Absolute path` or `A_LineFile style`',
                );
            }
        }
    }
    return null;
}
