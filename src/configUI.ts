/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import { ECommand } from './command/ECommand';
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
import { arrDeepEQ } from './tools/arrDeepEQ';
import { CMemo } from './tools/CMemo';
import { CConfigError } from './tools/DevClass/CConfigError';
import { enumLog } from './tools/enumErr';
import { getWorkspaceRoot } from './tools/fsTools/getWorkspaceRoot';
import { toNormalize } from './tools/fsTools/toNormalize';
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

let oldFnDocStyle: 1 | 2 | null = null;
let oldSignInsertType: boolean | null = null;
let oldTryParserIncludeOpt: 'auto' | 'close' | 'open' | null = null;
let oldIncludeFolder: readonly string[] | null = null;

function configEffectUp(ed: TConfigs): void {
    // --------------------- oldFnDocStyle ---------------------
    if (oldFnDocStyle !== null && oldFnDocStyle !== ed.customize.HoverFunctionDocStyle) {
        void vscode.window.showWarningMessage(
            'Configs change: please restart vscode!\n\n ("AhkNekoHelp.customize.HoverFunctionDocStyle")',
        );
    }
    oldFnDocStyle = ed.customize.HoverFunctionDocStyle;

    // --------------------- oldSignInsertType ---------------------
    if (oldSignInsertType !== null && oldSignInsertType !== ed.signatureHelp.insertType) {
        void vscode.window.showWarningMessage(
            'Configs change: please restart vscode!\n\n ("AhkNekoHelp.signatureHelp.insertType")',
        );
    }
    oldSignInsertType = ed.signatureHelp.insertType;

    // --------------------- tryParserIncludeOpt ---------------------
    if (
        oldTryParserIncludeOpt !== null && ed.files.tryParserIncludeOpt !== 'close'
        && oldTryParserIncludeOpt === 'close'
    ) {
        void vscode.window.showWarningMessage(
            '[Privacy Statement 3](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp#privacy-statement) is break!\n\n ("AhkNekoHelp.files.tryParserInclude")',
        );
    }
    oldTryParserIncludeOpt = ed.files.tryParserIncludeOpt;

    // --------------------- oldIncludeFolder ---------------------
    if (oldIncludeFolder === null || oldIncludeFolder.length > 0) {
        // nothing
    } else if (oldIncludeFolder.length === 0 && ed.files.alwaysIncludeFolder.length > 0) {
        void vscode.window.showWarningMessage(
            '[Privacy Statement 3](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp#privacy-statement) is break!\n\n ("AhkNekoHelp.files.alwaysIncludeFolder")',
        );
    }
    if (oldIncludeFolder !== null && arrDeepEQ(oldIncludeFolder, ed.files.alwaysIncludeFolder)) {
        void vscode.commands.executeCommand(ECommand.UpdateCacheAsync, false);
    }
    oldIncludeFolder = ed.files.alwaysIncludeFolder;
}

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
            code500Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code500'), // NeverUsedVar
            code502Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code502'), // of var
            code503Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code503'), // of param
            code511Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code511'), // ban var/parma name same fn-Name
            code512Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code512'), // ban global-var name same fn-name
            code513Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code513'), // ban label-name same fn-name
            code521: getConfigs<string>(Configs, 'AhkNekoHelp.Diag.code521'), // ban name like https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/28
            code522: getConfigs<string>(Configs, 'AhkNekoHelp.Diag.code522'), // ban name like https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/28
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
            alwaysIncludeFolder: getConfigs<readonly string[]>(Configs, 'AhkNekoHelp.files.alwaysIncludeFolder'),
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
            HoverFuncShowReturnBlock: getConfigs<TShowReturnBlock>(
                Configs,
                'AhkNekoHelp.customize.HoverFuncShowReturnBlock',
            ),
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

    configEffectUp(ed);

    void str2RegexListCheck(ed.files.exclude);
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

const memoAlwaysIncludeFolder = new CMemo<readonly string[], readonly string[]>(
    (alwaysIncludeFolder: readonly string[]): readonly string[] => {
        const pathList: string[] = [];
        for (const p of alwaysIncludeFolder) {
            pathList.push(vscode.Uri.file(p).fsPath);
        }

        return pathList;
    },
);
export function getAlwaysIncludeFolder(): readonly string[] {
    return memoAlwaysIncludeFolder.up(config.files.alwaysIncludeFolder);
}

export function setStatusBarText(showText: string, pmSize: number): void {
    statusBarItem.text = `$(heart) ${showText}`;
    // Workspace
    //
    const WorkspaceList: readonly string[] = [...getWorkspaceRoot(), ...getAlwaysIncludeFolder()]
        .map((p: string): string => toNormalize(p));

    const tooltip: string = WorkspaceList.length === 1
        ? `Workspace : ${WorkspaceList[0]}`
        : WorkspaceList.map((v: string, i: number): string => `Workspace${i} : ${WorkspaceList[i]}`).join('\n');

    statusBarItem.tooltip = `${tooltip}\nCached files: ${pmSize}`;
    statusBarItem.show();
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
