import * as vscode from 'vscode';
import { AIncludePathKnownList, EInclude } from '../../AhkSymbol/CAhkInclude';
import { collectInclude } from '../../command/tools/collectInclude';
import { pm, type TAhkFileData } from '../../core/ProjectManager';
import { EDetail } from '../../globalEnum';

let ignoreGotoIncludeDef = false;
function gotoIncludeDefShowInfo(): void {
    if (!ignoreGotoIncludeDef) {
        void vscode.window.showInformationMessage<'Do not remind again'>(
            '`#include` goto def support list [at issues #16](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/16)',
            'Do not remind again',
        ).then((v): 0 => {
            if (v !== undefined) {
                ignoreGotoIncludeDef = true;
            }
            return 0;
        });
    }
}

function gotoIncludeDefWithTry(mayPath: string, lStr: string, line: number): vscode.LocationLink | null {
    const pathListUp: string[] = [...pm.DocMap.keys()];
    // eslint-disable-next-line no-magic-numbers
    if (Math.random() > 0.3) {
        pathListUp.reverse();
    }
    for (const pathUp of pathListUp) {
        if (pathUp.toUpperCase().endsWith(mayPath.toUpperCase())) {
            const col0: number = lStr.length - lStr
                .replace(/^\s*#Include(?:Again)?\s+/iu, '')
                .replace(/\*i\s+/iu, '')
                .length;
            return {
                originSelectionRange: new vscode.Range(
                    new vscode.Position(line, col0),
                    new vscode.Position(line, lStr.length),
                ),
                targetUri: vscode.Uri.file(pathUp),
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
    }

    return null;
}

export function gotoIncludeDef(AhkFileData: TAhkFileData, position: vscode.Position): vscode.LocationLink | null {
    const { DocStrMap, AST } = AhkFileData;
    const { line } = position;
    const { detail, lStr } = DocStrMap[line];

    if (detail.includes(EDetail.isDirectivesLine) && (/^\s*#Include(?:Again)?\s/iu).test(lStr)) {
        for (const ahkInclude of collectInclude(AST)) {
            if (ahkInclude.range.contains(position)) {
                const { rawData } = ahkInclude;
                const { type, mayPath } = rawData;
                if (AIncludePathKnownList.includes(type)) {
                    const col0: number = lStr.length - lStr
                        .replace(/^\s*#Include(?:Again)?\s+/iu, '')
                        .replace(/\*i\s+/iu, '')
                        .length;
                    return {
                        originSelectionRange: new vscode.Range(
                            new vscode.Position(line, col0),
                            new vscode.Position(line, lStr.length),
                        ),
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
                if (type === EInclude.isUnknown) {
                    return gotoIncludeDefWithTry(mayPath, lStr, line);
                }
                gotoIncludeDefShowInfo();
                break;
            }
        }
    }
    return null;
}
