import * as path from 'node:path';
import * as vscode from 'vscode';
import type { CAhkInclude } from '../../../AhkSymbol/CAhkInclude';
import { AIncludePathKnownList, EInclude, IncludeOsMap } from '../../../AhkSymbol/CAhkInclude';
import type { CmdCodeActionRenameInclude } from '../../../command/CmdCodeActionRenameInclude';
import { ECommand } from '../../../command/ECommand';
import { collectInclude } from '../../../command/tools/collectInclude';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { toNormalize } from '../../../tools/fsTools/toNormalize';

function CodeActionTryRenameIncludePathCore(ahkInclude: CAhkInclude): string[] {
    const { uri, rawData } = ahkInclude;
    const { type, mayPath } = rawData;

    if (
        type === EInclude.isUnknown
        || type === EInclude.Relative // WTH ?
        || type === EInclude.Lib // #Include <xx.ahk>
    ) {
        return []; // unknown
    }

    if (type === EInclude.A_LineFile) {
        return [toNormalize(mayPath)];
    }

    if (type === EInclude.Absolute) {
        const normalize: string = toNormalize(mayPath);
        for (const { mayPathReplaceValue, name } of IncludeOsMap) {
            const may: string = toNormalize(mayPathReplaceValue);

            // C:\\
            // c:\\
            if (normalize.startsWith(may)) {
                return [
                    // to %A_Desktop%
                    // to %A_LineFile%
                    normalize.replace(may, name),
                    `%A_LineFile%\\${path.relative(uri.fsPath, normalize)}`,
                ];
            }
        }
        return [
            `%A_LineFile%\\${path.relative(uri.fsPath, normalize)}`,
        ];
    }

    if (AIncludePathKnownList.includes(type)) {
        const normalize: string = toNormalize(mayPath);

        return [
            // to Absolute
            // to %A_LineFile%
            normalize,
            `%A_LineFile%\\${path.relative(uri.fsPath, normalize)}`,
        ];
    }
    // type: EInclude.A_LineFile,
    return [];
}

export function CodeActionTryRenameIncludePath(
    AhkFileData: TAhkFileData,
    active: vscode.Position,
    AhkTokenLine: TAhkTokenLine,
): vscode.CodeAction[] {
    const { AST, uri } = AhkFileData;
    for (const ahkInclude of collectInclude(AST)) {
        if (!ahkInclude.range.contains(active)) continue;

        const newPathList: string[] = CodeActionTryRenameIncludePathCore(ahkInclude);

        if (newPathList.length === 0) return [];

        //
        const { lStr } = AhkTokenLine;
        const col0: number = lStr.length - lStr
            .replace(/^\s*#Include(?:Again)?\s+/iu, '')
            .replace(/\*i\s+/iu, '')
            .length;
        const range: vscode.Range = new vscode.Range(
            new vscode.Position(active.line, col0),
            new vscode.Position(active.line, lStr.length),
        );
        //
        const arr: vscode.CodeAction[] = [];
        for (const newPath of newPathList) {
            const CA = new vscode.CodeAction(`rename as ${newPath}`);
            CA.command = {
                title: `rename as ${newPath}`,
                command: ECommand.CmdCodeActionRenameInclude,
                tooltip: 'by neko-help',
                arguments: [
                    uri,
                    range,
                    newPath,
                ] satisfies Parameters<typeof CmdCodeActionRenameInclude>,
            };
            arr.push(CA);
        }
        return arr;
    }

    return [];
}
