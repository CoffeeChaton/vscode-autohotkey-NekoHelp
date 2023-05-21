import * as vscode from 'vscode';
import { EInclude } from '../../AhkSymbol/CAhkInclude';
import { collectInclude } from '../../command/tools/collectInclude';
import type { TAhkFileData } from '../../core/ProjectManager';
import { EDetail } from '../../globalEnum';

export function gotoIncludeDef(AhkFileData: TAhkFileData, position: vscode.Position): vscode.LocationLink | null {
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
                    const col0: number = lStr.length - lStr
                        .replace(/^\s*#Include(?:Again)?\s+/iu, '')
                        .replace(/\*i\s+/iu, '')
                        .length;
                    const originSelectionRange: vscode.Range = new vscode.Range(
                        new vscode.Position(line, col0),
                        new vscode.Position(line, lStr.length),
                    );
                    return {
                        originSelectionRange,
                        targetUri: vscode.Uri.file(mayPath),
                        targetRange: new vscode.Range(
                            new vscode.Position(0, 0),
                            new vscode.Position(0, 0),
                        ),
                        /**
                         * The span of this link.
                         */
                        // targetSelectionRange?: Range,
                    };
                }
                void vscode.window.showInformationMessage(
                    '`#include` goto def just support `Absolute path` or `A_LineFile style`',
                );
                break;
            }
        }
    }
    return null;
}
