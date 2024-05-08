/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import type { AnalyzeFuncMain } from '../../command/AnalyzeFunc/AnalyzeThisFunc';
import type { CmdFindFuncRef } from '../../command/CmdFindFuncRef';
import type { CmdFindMethodRef } from '../../command/CmdFindMethodRef';
import { ECommand } from '../../command/ECommand';
import type { getFileReport } from '../../command/getFileReport/getFileReport';
import { getConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import { getFuncRef } from '../Def/getFnRef';
import { getMethodRef } from '../Def/getMethodRef';
import { addClassReference } from './addClassReference';
import { addComObjConnectRegisterStrReference } from './addComObjConnectRegisterStrReference';
import { addGVarReference } from './addGVarReference';
import { addLabelReference } from './addLabelReference';
import { ECodeLensStr } from './ECodeLensStr';
import type { showUnknownAnalyze } from './showUnknownAnalyze';

function CodeLensCore(document: vscode.TextDocument): vscode.CodeLens[] {
    const { fsPath } = document.uri;
    const AhkFileData: TAhkFileData | undefined = pm.getDocMap(fsPath);
    if (AhkFileData === undefined) return [];

    const {
        showClassReference,
        showDevTool,
        showFileReport,
        showFuncReference,
        showLabelReference,
        showComObjConnectRegisterStrReference,
        showGlobalVarReference,
    } = getConfig().CodeLens;

    const { CodeLens } = getConfig().method;

    const { AST, DocStrMap, uri } = AhkFileData;

    const need: vscode.CodeLens[] = showFileReport
        ? [
            new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), {
                title: 'Analyze this ahk file',
                command: ECommand.showFileReport,
                tooltip: ECodeLensStr.tooltip,
                arguments: [document] satisfies Parameters<typeof getFileReport>,
            }),
        ]
        : [];

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

        if (fnSymbol.kind === vscode.SymbolKind.Method && CodeLens !== 'none') {
            const MethodRef: vscode.Location[] | null = getMethodRef(fnSymbol);
            if (MethodRef !== null) {
                const cmd: vscode.Command = {
                    title: `Reference ${MethodRef.length - 1}`,
                    command: ECommand.CmdFindMethodRef,
                    tooltip: ECodeLensStr.tooltip,
                    arguments: [
                        uri,
                        fnSymbol.range.start,
                        fnSymbol,
                        MethodRef,
                    ] satisfies Parameters<typeof CmdFindMethodRef>,
                };
                need.push(new vscode.CodeLens(fnSymbol.range, cmd));
            }
        }
    }

    if (showClassReference) addClassReference(need, AST);
    if (showLabelReference) addLabelReference(need, AST);
    if (showComObjConnectRegisterStrReference) addComObjConnectRegisterStrReference(need, AhkFileData);
    if (showGlobalVarReference) addGVarReference(need, AhkFileData);

    return need;
}

export const CodeLensProvider: vscode.CodeLensProvider = {
    // onDidChangeCodeLenses?: Event<void> | undefined;
    provideCodeLenses(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.CodeLens[]> {
        return CodeLensCore(document);
    },
};
