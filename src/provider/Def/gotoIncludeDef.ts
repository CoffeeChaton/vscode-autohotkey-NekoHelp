import * as vscode from 'vscode';
import { AIncludePathKnownList } from '../../AhkSymbol/CAhkInclude';
import { collectInclude } from '../../command/tools/collectInclude';
import type { TAhkFileData } from '../../core/ProjectManager';
import { EDetail } from '../../globalEnum';

let ignoreGotoIncludeDef = false;
function gotoIncludeDefShowInfo(): void {
    if (!ignoreGotoIncludeDef) {
        void vscode.window.showInformationMessage<'Do not remind again'>(
            '`#include` goto def just support `Absolute path` or `A_LineFile style` or `A_Desktop` \nhttps://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/16',
            'Do not remind again',
        ).then((v): 0 => {
            if (v !== undefined) {
                ignoreGotoIncludeDef = true;
            }
            return 0;
        });
    }
}

export function gotoIncludeDef(AhkFileData: TAhkFileData, position: vscode.Position): vscode.LocationLink | null {
    const { DocStrMap, AST } = AhkFileData;
    const { line } = position;
    const { detail, lStr } = DocStrMap[line];

    if (detail.includes(EDetail.isDirectivesLine) && (/^\s*#Include(?:Again)?\s/iu).test(lStr)) {
        //
        for (const ahkInclude of collectInclude(AST)) {
            if (ahkInclude.range.contains(position)) {
                const { rawData } = ahkInclude;
                const { type, mayPath } = rawData;
                if (AIncludePathKnownList.includes(type)) {
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
                gotoIncludeDefShowInfo();
                break;
            }
        }
    }
    return null;
}
