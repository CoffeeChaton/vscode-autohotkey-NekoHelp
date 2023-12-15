/* eslint-disable no-magic-numbers */
import type { contributes } from '../package.json';
import type { DeepReadonly } from './globalEnum';

export const enum ECommandOption {
    All = 0, // "Don't filter Command, Provides all entered commands.",
    Recommended = 1, // "filter not recommended Command. (Referral rules from AhkNekoHelp.)",
    noSameFunc = 2, // "filter Command with the pack has same name function. exp: of ",
    notProvided = 3, // "not provided any Command."
}

export const enum EFileRenameEvent {
    AJustLog = 0,
    BLogAndShow = 1,
    CTryRename = 2,
}

export const enum EDiagMasterSwitch {
    never = 'never',
    auto = 'auto',
    alway = 'alway',
}

export const enum ErmFirstCommaCommand {
    notFmt = 0,
    to1 = 1,
    to2 = 2,
}

export type TShowReturnBlock = 'always' | 'auto' | 'never';

export type TMethodModeOpt = 'loose_mode' | 'precision_mode' | 'precision_or_loose_mode';
export type TMethod = {
    gotoDef: TMethodModeOpt,
    hover: TMethodModeOpt,
    findAllRef: 'loose_mode' | 'precision_mode',
    CodeLens: 'loose_mode' | 'none' | 'precision_mode',
};

export type TTryParserIncludeLog = DeepReadonly<{
    'file_not_exists'?: boolean,
    'parser_OK'?: boolean,
    'parser_err'?: boolean,
    'parser_duplicate'?: boolean,
    'not_support_this_style'?: boolean,
}>;

type TempConfigs = {
    CodeLens: {
        showClassReference: boolean,
        showFuncReference: boolean,
        showLabelReference: boolean,
        showComObjConnectRegisterStrReference: boolean,
        showDevTool: boolean,
        showFileReport: boolean,
    },
    method: TMethod,
    Diag: {
        AMasterSwitch: EDiagMasterSwitch,

        /**
         * code107LegacyAssignment
         *
         * ```ahk
         * a = this line is string ; diag of "="
         * a := "this line is string"
         * ```
         */
        code107: boolean,
        code300fnSize: number,
        code500Max: number, // NeverUsedVar
        code502Max: number, // of var
        code503Max: number, // of param
        code511Max: number, // ban param/var-name same fn-name
        code512Max: number, // ban global-var name same fn-name
        code513Max: number, // ban label-var name same fn-name
        code521: string,
        code522: string,
        code800Deprecated: boolean,
        //  useDiagGlobalVarUnused: boolean, // of global-var
        useModuleValDiag: boolean,
    },
    event: EFileRenameEvent,
    format: {
        AMasterSwitchUseFormatProvider: boolean,
        formatTextReplace: boolean,

        /**
         * ```ahk
         * #Warn, All, MsgBox
         * ; to
         * #Warn All, MsgBox
         * ;    ^rm first ,`
         * ```
         */
        removeFirstCommaDirective: boolean,
        removeFirstCommaCommand: ErmFirstCommaCommand,
        useTopLabelIndent: boolean,

        /**
         * "Indent the wih `(` and `)` not close"
         */
        useParenthesesIndent: boolean,

        /**
         * "Indent the wih `[` and `]` not close"
         */
        useSquareBracketsIndent: boolean,
    },
    files: {
        alwaysIncludeFolder: readonly string[],
        exclude: readonly string[],
        tryParserIncludeOpt: 'auto' | 'close' | 'open',
        tryParserIncludeLog: TTryParserIncludeLog,
    },

    snippets: {
        blockFilesList: readonly string[],
        CommandOption: ECommandOption,
        fromOtherFile: 0 | 1 | 2,
        subCmdPlus: {
            Menu: boolean,
            Gui: boolean,
            GuiControl: boolean,
            SysGet: boolean,
            WinSet?: boolean, // api-change
            WinGet?: boolean, // api-change
            Control?: boolean, // api-change
            ControlGet?: boolean, // api-change
        },
    },
    SymbolProvider: {
        useSymbolProvider: boolean,
        showInclude: boolean,
    },
    customize: {
        HoverFuncShowReturnBlock: TShowReturnBlock,
        statusBarDisplayColor: string,
        CodeAction2GotoDefRef: boolean,
        HoverFunctionDocStyle: 1 | 2,
        displayLogMessage: string,
    },
    signatureHelp: {
        insertType: boolean,
        showParamInfo: boolean,
        showOtherDoc: boolean,
        showReturnInfo: boolean,
        showReturnBlock: TShowReturnBlock,

        CmdShowParamInfo: boolean,
    },
    inlayHints: {
        AMainSwitch: boolean,
        /**
         * "typescript.inlayHints.parameterNames.suppressWhenArgumentMatchesName": true
         * Suppress parameter name hints on arguments whose text is identical to the parameter name.
         */
        parameterNamesSuppressWhenArgumentMatchesName: boolean,

        /**
         * "typescript.inlayHints.parameterNames.enabled": "literals"
         * "typescript.inlayHints.parameterNames.enabled": "all"
         */
        //
        parameterNamesEnabled: 'none' | 'literals' | 'all',
        HideSingleParameters: boolean,
    },
    RenameFunctionInStr: boolean,
};

/**
 * [Configuration example](https://code.visualstudio.com/api/references/contribution-points%5C#Configuration-example)
 */
export type TConfigs = DeepReadonly<TempConfigs>;

type TConfigJson = typeof contributes.configuration[number]['properties'];
export type TConfigKey = keyof TConfigJson;

// export type TCheckKey<T extends string> = `AhkNekoHelp.${T}` extends TConfigKey ? T : never;
