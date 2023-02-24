import * as vscode from 'vscode';
import type { AnalyzeFuncMain } from '../../command/AnalyzeFunc/AnalyzeThisFunc';
import type { CmdFindFuncRef } from '../../command/CmdFindFuncRef';
import { ECommand } from '../../command/ECommand';
import type { getFileReport } from '../../command/getFileReport/getFileReport';
import { getCodeLenConfig } from '../../configUI';
import type { TConfigs } from '../../configUI.data';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import { getFuncRef } from '../Def/getFnRef';
import type { showUnknownAnalyze } from './showUnknownAnalyze';

const enum ECodeLensStr {
    tooltip = 'by neko-help dev tools',
}

function CodeLensCore(
    document: vscode.TextDocument,
    { showFuncReference, showDevTool, showFileReport }: TConfigs['CodeLens'],
): vscode.CodeLens[] {
    const { fsPath } = document.uri;
    const AhkFileData: TAhkFileData | undefined = pm.getDocMap(fsPath);
    if (AhkFileData === undefined) return [];

    const { AST, DocStrMap, uri } = AhkFileData;

    const need: vscode.CodeLens[] = showFileReport
        ? [
            new vscode.CodeLens(new vscode.Range(0, 0, 1, 0), {
                title: 'Analyze this ahk file',
                command: ECommand.showFileReport,
                tooltip: ECodeLensStr.tooltip,
                arguments: [document] satisfies Parameters<typeof getFileReport>,
            }),
        ]
        : [];

    if (!showFuncReference && !showDevTool) return need;

    for (const fnSymbol of getDAListTop(AST)) {
        if (showDevTool) {
            const cmd0: vscode.Command = {
                title: 'Analyze',
                command: ECommand.showFuncAnalyze,
                tooltip: ECodeLensStr.tooltip,
                arguments: [
                    fnSymbol,
                    DocStrMap.slice(fnSymbol.selectionRange.start.line + 1, fnSymbol.range.end.line + 1),
                ] satisfies Parameters<typeof AnalyzeFuncMain>,
            };
            need.push(new vscode.CodeLens(fnSymbol.range, cmd0));

            if (fnSymbol.textMap.size > 0) {
                const cmd1: vscode.Command = {
                    title: 'unknownText',
                    command: ECommand.showUnknownAnalyze,
                    tooltip: ECodeLensStr.tooltip,
                    arguments: [fnSymbol] satisfies Parameters<typeof showUnknownAnalyze>,
                };
                need.push(new vscode.CodeLens(fnSymbol.range, cmd1));
            }
        }

        if (showFuncReference && fnSymbol.kind === vscode.SymbolKind.Function) {
            const cmd2: vscode.Command = {
                title: `Reference ${getFuncRef(fnSymbol).length - 1}`,
                command: ECommand.CmdFindFuncRef,
                tooltip: ECodeLensStr.tooltip,
                arguments: [
                    uri,
                    fnSymbol.range.start,
                    fnSymbol,
                ] satisfies Parameters<typeof CmdFindFuncRef>,
            };
            need.push(new vscode.CodeLens(fnSymbol.range, cmd2));
        }
    }

    return need;
}

export const CodeLensProvider: vscode.CodeLensProvider = {
    // onDidChangeCodeLenses?: Event<void> | undefined;
    provideCodeLenses(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.CodeLens[]> {
        return CodeLensCore(document, getCodeLenConfig());
    },
};
