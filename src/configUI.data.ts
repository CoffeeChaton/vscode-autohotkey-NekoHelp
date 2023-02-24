import type { contributes } from '../package.json';
import type { DeepReadonly } from './globalEnum';

export const enum ECommandOption {
    All = 0, // "Don't filter Command, Provides all entered commands.",
    Recommended = 1, // "filter not recommended Command. (Referral rules from AhkNekoHelp.)",
    noSameFunc = 2, // "filter Command with the pack has same name function. exp: of ",
    // eslint-disable-next-line no-magic-numbers
    notProvided = 3, // "not provided any Command."
}

export const enum EDiagMasterSwitch {
    never = 'never',
    auto = 'auto',
    alway = 'alway',
}

type TempConfigs = {
    CodeLens: {
        showFuncReference: boolean,
        showDevTool: boolean,
        showFileReport: boolean,
    },
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
        code304: boolean,
        code500Max: number, // NeverUsedVar
        code502Max: number, // of var
        code503Max: number, // of param
        code511Max: number, // ban param/var-name same fn-name
        code512Max: number, // ban global-var name same fn-name
        code513Max: number, // ban label-var name same fn-name
        code800Deprecated: boolean,
        //  useDiagGlobalVarUnused: boolean, // of global-var
        useModuleValDiag: boolean,
    },
    format: {
        AMasterSwitchUseFormatProvider: boolean,
        formatTextReplace: boolean,
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
    baseScanIgnoredList: readonly string[],
    snippets: {
        blockFilesList: readonly string[],
        CommandOption: ECommandOption,
    },
    statusBarDisplayColor: string,
    useSymbolProvider: boolean,
    customize: {
        CodeAction2GotoDefRef: boolean,
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
