/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import type {
    ECommandOption,
    EFileRenameEvent,
    ErmFirstCommaCommand,
    TConfigKey,
    TConfigs,
    TMethod,
    TShowReturnBlock,
    TTryParserIncludeLog,
} from './configUI.data';
import { EDiagMasterSwitch } from './configUI.data';
import { log } from './provider/vscWindows/log';
import { statusBarItem } from './provider/vscWindows/statusBarItem';
import { CConfigError } from './tools/DevClass/CConfigError';
import { enumLog } from './tools/enumErr';
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

let oldCustomizeHoverFunctionDocStyle: 1 | 2 | null = null;
let oldSignInsertType: boolean | null = null;
let oldFilesTryParserIncludeOpt: 'auto' | 'close' | 'open' | null = null;

function getConfig(Configs: vscode.WorkspaceConfiguration): TConfigs {
    const ed: TConfigs = {
        CodeLens: {
            showClassReference: getConfigs<boolean>(Configs, 'AhkNekoHelp.CodeLens.showClassReference'),
            showFuncReference: getConfigs<boolean>(Configs, 'AhkNekoHelp.CodeLens.showFuncReference'),
            showLabelReference: getConfigs<boolean>(Configs, 'AhkNekoHelp.CodeLens.showLabelReference'),
            showComObjConnectRegisterStrReference: getConfigs<boolean>(
                Configs,
                'AhkNekoHelp.CodeLens.showComObjConnectRegisterStrReference',
            ),
            showDevTool: getConfigs<boolean>(Configs, 'AhkNekoHelp.CodeLens.showDevTool'),
            showFileReport: getConfigs<boolean>(Configs, 'AhkNekoHelp.CodeLens.showFileReport'),
        },
        event: getConfigs<EFileRenameEvent>(Configs, 'AhkNekoHelp.event.FileRenameEvent'),
        method: getConfigs<TMethod>(Configs, 'AhkNekoHelp.method'),
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
            removeFirstCommaCommand: getConfigs<ErmFirstCommaCommand>(
                Configs,
                'AhkNekoHelp.format.removeFirstCommaCommand',
            ),

            useTopLabelIndent: getConfigs<boolean>(Configs, 'AhkNekoHelp.format.useTopLabelIndent'),
            useParenthesesIndent: getConfigs<boolean>(Configs, 'AhkNekoHelp.format.useParenthesesIndent'),
            useSquareBracketsIndent: getConfigs<boolean>(Configs, 'AhkNekoHelp.format.useSquareBracketsIndent'),
        },
        files: {
            exclude: getConfigs<readonly string[]>(Configs, 'AhkNekoHelp.files.exclude'),
            tryParserIncludeOpt: getConfigs<'auto' | 'close' | 'open'>(
                Configs,
                'AhkNekoHelp.files.tryParserIncludeOpt',
            ),
            tryParserIncludeLog: getConfigs<TTryParserIncludeLog>(
                Configs,
                'AhkNekoHelp.files.tryParserIncludeLog',
            ),
        },
        snippets: {
            blockFilesList: getConfigs<readonly string[]>(Configs, 'AhkNekoHelp.snippets.exclude'),
            CommandOption: getConfigs<ECommandOption>(Configs, 'AhkNekoHelp.snippets.CommandOption'),
            fromOtherFile: getConfigs<0 | 1 | 2>(Configs, 'AhkNekoHelp.snippets.fromOtherFile'),
            subCmdPlus: getConfigs<TConfigs['snippets']['subCmdPlus']>(Configs, 'AhkNekoHelp.snippets.subCmdPlus'),
        },
        SymbolProvider: {
            useSymbolProvider: getConfigs<boolean>(Configs, 'AhkNekoHelp.useSymbolProvider'),
            showInclude: getConfigs<boolean>(Configs, 'AhkNekoHelp.SymbolProvider.showInclude'),
        },
        customize: {
            statusBarDisplayColor: getConfigs<string>(Configs, 'AhkNekoHelp.customize.statusBarDisplayColor'),
            CodeAction2GotoDefRef: getConfigs<boolean>(Configs, 'AhkNekoHelp.customize.CodeAction2GotoDefRef'),
            HoverFunctionDocStyle: getConfigs<1 | 2>(Configs, 'AhkNekoHelp.customize.HoverFunctionDocStyle'),
            displayLogMessage: getConfigs<string>(Configs, 'AhkNekoHelp.customize.displayLogMessage'),
        },
        signatureHelp: {
            insertType: getConfigs<boolean>(Configs, 'AhkNekoHelp.signatureHelp.insertType'),
            showParamInfo: getConfigs<boolean>(Configs, 'AhkNekoHelp.signatureHelp.showParamInfo'),
            showOtherDoc: getConfigs<boolean>(Configs, 'AhkNekoHelp.signatureHelp.showOtherDoc'),
            showReturnInfo: getConfigs<boolean>(Configs, 'AhkNekoHelp.signatureHelp.showReturnInfo'),
            showReturnBlock: getConfigs<TShowReturnBlock>(Configs, 'AhkNekoHelp.signatureHelp.showReturnBlock'),

            CmdShowParamInfo: getConfigs<boolean>(Configs, 'AhkNekoHelp.signatureHelp.CmdShowParamInfo'),
        },
        RenameFunctionInStr: getConfigs<boolean>(Configs, 'AhkNekoHelp.Rename.functionInStr'),
    } as const;

    statusBarItem.color = ed.customize.statusBarDisplayColor;
    void str2RegexListCheck(ed.files.exclude);
    void str2RegexListCheck(ed.snippets.blockFilesList);

    if (oldCustomizeHoverFunctionDocStyle === null) {
        oldCustomizeHoverFunctionDocStyle = ed.customize.HoverFunctionDocStyle;
    } else if (oldCustomizeHoverFunctionDocStyle !== ed.customize.HoverFunctionDocStyle) {
        oldCustomizeHoverFunctionDocStyle = ed.customize.HoverFunctionDocStyle;
        void vscode.window.showWarningMessage(
            'Configs change: please restart vscode!\n\n ("AhkNekoHelp.customize.HoverFunctionDocStyle")',
        );
    }

    if (oldSignInsertType === null) {
        oldSignInsertType = ed.signatureHelp.insertType;
    } else if (oldSignInsertType !== ed.signatureHelp.insertType) {
        oldSignInsertType = ed.signatureHelp.insertType;
        void vscode.window.showWarningMessage(
            'Configs change: please restart vscode!\n\n ("AhkNekoHelp.signatureHelp.insertType")',
        );
    }

    if (oldFilesTryParserIncludeOpt === null) {
        oldFilesTryParserIncludeOpt = ed.files.tryParserIncludeOpt;
    } else if (ed.files.tryParserIncludeOpt !== 'close' && oldFilesTryParserIncludeOpt === 'close') {
        oldFilesTryParserIncludeOpt = ed.files.tryParserIncludeOpt;
        void vscode.window.showWarningMessage(
            '[Privacy Statement 3](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp#privacy-statement) is break!\n\n ("AhkNekoHelp.files.tryParserInclude")',
        );
    } else {
        oldFilesTryParserIncludeOpt = ed.files.tryParserIncludeOpt;
    }

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

export function getMethodConfig(): TConfigs['method'] {
    return config.method;
}

export function getFormatConfig(): TConfigs['format'] {
    return config.format;
}

export function getSymbolProviderConfig(): TConfigs['SymbolProvider'] {
    return config.SymbolProvider;
}

export function getIgnoredList(): readonly RegExp[] {
    return str2RegexListCheck(config.files.exclude);
}

export function getTryParserInclude(): 'auto' | 'close' | 'open' {
    return config.files.tryParserIncludeOpt;
}

export function LogParserInclude(byRefLogList: { type: keyof TTryParserIncludeLog, msg: string }[]): void {
    const logOpt: TTryParserIncludeLog = config.files.tryParserIncludeLog;
    for (const { type, msg } of byRefLogList) {
        const msgF = `${type} , ${msg}`;
        switch (type) {
            case 'file_not_exists':
                if (logOpt.file_not_exists === true) log.warn(msgF);
                break;

            case 'parser_OK':
                if (logOpt.parser_OK === true) log.info(msgF);
                break;

            case 'parser_err':
                if (logOpt.parser_err === true) log.error(msgF);
                break;

            case 'parser_duplicate':
                if (logOpt.parser_duplicate === true) log.warn(msgF);
                break;

            case 'not_support_include_directory':
                if (logOpt.not_support_include_directory === true) log.warn(msgF);
                break;

            case 'not_support_this_style':
                if (logOpt.not_support_this_style === true) log.warn(msgF);
                break;

            default:
                enumLog(type, 'tryParserInclude, UpdateCacheAsync');
        }
    }
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

export function getSignatureHelp(): TConfigs['signatureHelp'] {
    return config.signatureHelp;
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
