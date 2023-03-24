import * as vscode from 'vscode';
import type {
    ECommandOption,
    EFileRenameEvent,
    TConfigKey,
    TConfigs,
} from './configUI.data';
import { EDiagMasterSwitch } from './configUI.data';
import { statusBarItem } from './provider/vscWindows/statusBarItem';
import { CConfigError } from './tools/DevClass/CConfigError';
import { str2RegexListCheck } from './tools/str2RegexListCheck';

/*
    ---set start---
*/
const enum EStrConfig {
    Config = 'AhkNekoHelp',
}

function getConfigs<T>(Configs: vscode.WorkspaceConfiguration, section: TConfigKey): T {
    const ed: T | undefined = Configs.get<T>(section.replace('AhkNekoHelp.', ''));
    if (ed === undefined) throw new CConfigError(section);
    return ed;
}

function getConfig(Configs: vscode.WorkspaceConfiguration): TConfigs {
    const ed: TConfigs = {
        CodeLens: {
            showFuncReference: getConfigs<boolean>(Configs, 'AhkNekoHelp.CodeLens.showFuncReference'),
            showDevTool: getConfigs<boolean>(Configs, 'AhkNekoHelp.CodeLens.showDevTool'),
            showFileReport: getConfigs<boolean>(Configs, 'AhkNekoHelp.CodeLens.showFileReport'),
        },
        event: getConfigs<EFileRenameEvent>(Configs, 'AhkNekoHelp.event.FileRenameEvent'),
        Diag: {
            AMasterSwitch: getConfigs<EDiagMasterSwitch>(Configs, 'AhkNekoHelp.Diag.AMasterSwitch'),
            code107: getConfigs<boolean>(Configs, 'AhkNekoHelp.Diag.code107LegacyAssignment'),
            code300fnSize: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code300FuncSize'),
            code304: getConfigs<boolean>(Configs, 'AhkNekoHelp.Diag.code304AvoidConfusingFuncNames'),
            code500Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code500'), // NeverUsedVar
            code502Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code502'), // of var
            code503Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code503'), // of param
            code511Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code511'), // ban var/parma name same fn-Name
            code512Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code512'), // ban global-var name same fn-name
            code513Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code513'), // ban label-name same fn-name
            code800Deprecated: getConfigs<boolean>(Configs, 'AhkNekoHelp.Diag.code800Deprecated'),
            useModuleValDiag: getConfigs<boolean>(Configs, 'AhkNekoHelp.Diag.useModuleValDiag'),
        },
        format: {
            AMasterSwitchUseFormatProvider: getConfigs<boolean>(
                Configs,
                'AhkNekoHelp.format.AMasterSwitchUseFormatProvider',
            ),
            formatTextReplace: getConfigs<boolean>(Configs, 'AhkNekoHelp.format.textReplace'),
            removeFirstCommaDirective: getConfigs<boolean>(Configs, 'AhkNekoHelp.format.removeFirstCommaDirective'),
            useTopLabelIndent: getConfigs<boolean>(Configs, 'AhkNekoHelp.format.useTopLabelIndent'),
            useParenthesesIndent: getConfigs<boolean>(Configs, 'AhkNekoHelp.format.useParenthesesIndent'),
            useSquareBracketsIndent: getConfigs<boolean>(Configs, 'AhkNekoHelp.format.useSquareBracketsIndent'),
        },
        baseScanIgnoredList: getConfigs<readonly string[]>(Configs, 'AhkNekoHelp.baseScan.IgnoredList'),
        snippets: {
            blockFilesList: getConfigs<readonly string[]>(Configs, 'AhkNekoHelp.snippets.blockFilesList'),
            CommandOption: getConfigs<ECommandOption>(Configs, 'AhkNekoHelp.snippets.CommandOption'),
            expandSubCommand: getConfigs<boolean>(Configs, 'AhkNekoHelp.snippets.expandSubCommand'),
        },
        statusBarDisplayColor: getConfigs<string>(Configs, 'AhkNekoHelp.statusBar.displayColor'),
        useSymbolProvider: getConfigs<boolean>(Configs, 'AhkNekoHelp.useSymbolProvider'),
        customize: {
            CodeAction2GotoDefRef: getConfigs<boolean>(Configs, 'AhkNekoHelp.customize.CodeAction2GotoDefRef'),
        },
        RenameFunctionInStr: getConfigs<boolean>(Configs, 'AhkNekoHelp.Rename.functionInStr'),
    } as const;

    statusBarItem.color = ed.statusBarDisplayColor;
    void str2RegexListCheck(ed.baseScanIgnoredList);
    void str2RegexListCheck(ed.snippets.blockFilesList);
    return ed;
}

let config: TConfigs = getConfig(vscode.workspace.getConfiguration(EStrConfig.Config));

export function configChangEvent(): void {
    config = getConfig(vscode.workspace.getConfiguration(EStrConfig.Config));
}

/*
    ---set end---
*/
export function showTimeSpend(showText: string): void {
    statusBarItem.text = `$(heart) ${showText}`;
    statusBarItem.show();
}

export function getCodeLenConfig(): TConfigs['CodeLens'] {
    return config.CodeLens;
}

export function getFormatConfig(): TConfigs['format'] {
    return config.format;
}

export function useSymbolProvider(): boolean {
    return config.useSymbolProvider;
}

export function getIgnoredList(): readonly RegExp[] {
    return str2RegexListCheck(config.baseScanIgnoredList);
}

export function getSnippetBlockFilesList(): readonly RegExp[] {
    return str2RegexListCheck(config.snippets.blockFilesList);
}

export function getCommandOptions(): TConfigs['snippets'] {
    return config.snippets;
}

export function getDiagConfig(): TConfigs['Diag'] {
    return config.Diag;
}

export function getCustomize(): TConfigs['customize'] {
    return config.customize;
}

export function geRenameConfig(): TConfigs['RenameFunctionInStr'] {
    return config.RenameFunctionInStr;
}

export function needDiag(): boolean {
    const { AMasterSwitch } = config.Diag;
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (
        AMasterSwitch === EDiagMasterSwitch.never
        || (AMasterSwitch === EDiagMasterSwitch.auto && vscode.workspace.workspaceFolders === undefined)
    ) {
        return false;
    }
    return true;
}

export function getEventConfig(): TConfigs['event'] {
    return config.event;
}
// vscode.window.setStatusBarMessage(timeSpend);
// vscode.window.showErrorMessage()
// vscode.window.showInformationMessage()
// ❤♡
