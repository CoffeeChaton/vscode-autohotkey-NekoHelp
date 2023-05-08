import * as vscode from 'vscode';
import { AnalyzeFuncMain } from './command/AnalyzeFunc/AnalyzeThisFunc';
import { CmdFindClassRef } from './command/CmdFindClassRef';
import { CmdFindComObjConnectRegister } from './command/CmdFindComObjConnectRegister';
import { CmdFindFuncRef } from './command/CmdFindFuncRef';
import { CmdFindLabelRef } from './command/CmdFindLabelRef';
import { CmdFindMethodRef } from './command/CmdFindMethodRef';
import { CmdFnAddAhkDoc } from './command/CmdFnAddAhkDoc';
import { CmdGotoFuncDef } from './command/CmdGotoFuncDef';
import { statusBarClick } from './command/Command';
import { displayLogMessageFn } from './command/displayLogMessageFn';
import { ECommand } from './command/ECommand';
import { getFileReport } from './command/getFileReport/getFileReport';
import { ListAllFuncMain } from './command/ListAllFunc';
import { ListAllInclude } from './command/ListAllInclude';
import { ListIncludeTree } from './command/ListIncludeTree';
import { UpdateCacheAsync, UpdateCacheUi } from './command/UpdateCache';
import { configChangEvent } from './configUI';
import { diagColl, rmAllDiag } from './core/diagColl';
import { pm } from './core/ProjectManager';
import { CodeActionProvider } from './provider/CodeActionProvider/CodeActionProvider';
import { CodeLensProvider } from './provider/CodeLens/CodeLensProvider';
import { showUnknownAnalyze } from './provider/CodeLens/showUnknownAnalyze';
import { CompletionItemProvider } from './provider/CompletionItem/CompletionItemProvider';
import { DefProvider } from './provider/Def/DefProvider';
import { onDidChangeActiveTab, onDidChangeTabs } from './provider/event/onDidChangeTabs';
import { FormatProvider } from './provider/Format/FormatProvider';
import { RangeFormatProvider } from './provider/FormatRange/RangeFormatProvider';
import { OnTypeFormattingEditProvider } from './provider/FormattingEditOnType/OnTypeFormattingEditProvider';
import { HoverProvider } from './provider/Hover/HoverProvider';
import { ReferenceProvider } from './provider/Ref/ReferenceProvider';
import { RenameProvider } from './provider/Rename/RenameProvider';
import { AhkFullSemanticHighlight, legend } from './provider/SemanticTokensProvider/SemanticTokensProvider';
import { SignatureHelpProvider } from './provider/SignatureHelpProvider/SignatureHelpProvider';
import { SymbolProvider } from './provider/SymbolProvider/SymbolProvider';
import { log } from './provider/vscWindows/log';
import { statusBarItem } from './provider/vscWindows/statusBarItem';
import { WorkspaceSymbolProvider } from './provider/WorkspaceSymbolProvider/WorkspaceSymbolProvider';

// main
export function activate(context: vscode.ExtensionContext): void {
    const selector: vscode.DocumentSelector = { language: 'ahk' }; // scheme: 'file'
    const triggerCharacters: readonly string[] = [
        '_',
        '.',
        '',
        '{',
        '@',
        '#',
        '$',
        ':',
    ];
    const metadata: vscode.SignatureHelpProviderMetadata = {
        triggerCharacters: ['(', ','],
        retriggerCharacters: ['(', ',', ')'],
    };
    context.subscriptions.push(
        // languages-------------------
        // languages.registerFoldingRangeProvider
        vscode.languages.registerCodeActionsProvider(selector, CodeActionProvider),
        vscode.languages.registerCodeLensProvider(selector, CodeLensProvider),
        vscode.languages.registerCompletionItemProvider(selector, CompletionItemProvider, ...triggerCharacters),
        vscode.languages.registerDefinitionProvider(selector, DefProvider),
        vscode.languages.registerDocumentFormattingEditProvider(selector, FormatProvider),
        vscode.languages.registerDocumentRangeFormattingEditProvider(selector, RangeFormatProvider),
        vscode.languages.registerDocumentSemanticTokensProvider(selector, AhkFullSemanticHighlight, legend),
        vscode.languages.registerDocumentSymbolProvider(selector, SymbolProvider),
        vscode.languages.registerHoverProvider(selector, HoverProvider),
        vscode.languages.registerOnTypeFormattingEditProvider(selector, OnTypeFormattingEditProvider, '\n', '\r\n'),
        vscode.languages.registerReferenceProvider(selector, ReferenceProvider),
        vscode.languages.registerRenameProvider(selector, RenameProvider),
        vscode.languages.registerWorkspaceSymbolProvider(WorkspaceSymbolProvider),
        vscode.languages.registerSignatureHelpProvider(selector, SignatureHelpProvider, metadata),
        // workspace-------------------
        // workspace.onDidOpenTextDocument(pm.OpenFile),
        // workspace.onDidSaveTextDocument(pm.OnDidSaveTextDocument),
        // workspace.registerTextDocumentContentProvider(selector, e),
        vscode.workspace.onDidChangeConfiguration(configChangEvent),
        vscode.workspace.onDidChangeTextDocument(pm.changeDoc),
        vscode.workspace.onDidCreateFiles(pm.createMap),
        vscode.workspace.onDidDeleteFiles(pm.delMap),
        vscode.workspace.onDidRenameFiles(pm.renameFiles),
        // window----------------------
        // window.onDidChangeVisibleTextEditors(onChangeVisibleTabs),
        // window.tabGroups.onDidChangeTabGroups(onDidChangeTabGroups),
        vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTab),
        vscode.window.tabGroups.onDidChangeTabs(onDidChangeTabs),
        // commands--------------------
        // commands.registerCommand(ECommand.CompletionMsgBox, CompletionMsgBox),
        // "ahk.nekoHelp.displayLogMessage"
        vscode.commands.registerCommand('ahk.nekoHelp.bar', statusBarClick),
        vscode.commands.registerCommand('ahk.nekoHelp.refreshResource', UpdateCacheUi),
        vscode.commands.registerCommand('ahk.nekoHelp.displayLogMessage', displayLogMessageFn),
        vscode.commands.registerCommand(ECommand.CmdFindClassRef, CmdFindClassRef),
        vscode.commands.registerCommand(ECommand.CmdFindComObjConnectRegister, CmdFindComObjConnectRegister),
        vscode.commands.registerCommand(ECommand.CmdFindMethodRef, CmdFindMethodRef),
        vscode.commands.registerCommand(ECommand.CmdFindFuncRef, CmdFindFuncRef),
        vscode.commands.registerCommand(ECommand.CmdFindLabelRef, CmdFindLabelRef),
        vscode.commands.registerCommand(ECommand.CmdFnAddAhkDoc, CmdFnAddAhkDoc),
        vscode.commands.registerCommand(ECommand.CmdGotoFuncDef, CmdGotoFuncDef),
        vscode.commands.registerCommand(ECommand.ListAllFunc, ListAllFuncMain),
        vscode.commands.registerCommand(ECommand.ListAllInclude, ListAllInclude),
        vscode.commands.registerCommand(ECommand.ListIncludeTree, ListIncludeTree),
        vscode.commands.registerCommand(ECommand.showFileReport, getFileReport),
        vscode.commands.registerCommand(ECommand.showFuncAnalyze, AnalyzeFuncMain),
        vscode.commands.registerCommand(ECommand.showUnknownAnalyze, showUnknownAnalyze),
        // root dispose
        log,
        statusBarItem,
        diagColl,
    );

    void vscode.commands.executeCommand('setContext', 'AhkNekoHelpExtension.showMyCommand', true);
    void UpdateCacheAsync(true); // not await
}

// this method is called when your extension is deactivated
export function deactive(): void {
    rmAllDiag();
    statusBarItem.hide(); // just .hide() not .dispose()
}

/*
nls -> l10n https://code.visualstudio.com/updates/v1_72#_localization-as-part-of-the-api
i18n https://github.com/microsoft/vscode-extension-samples/tree/main/i18n-sample
*/
