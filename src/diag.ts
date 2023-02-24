/* eslint-disable no-magic-numbers */
import type { DeepReadonly } from './globalEnum';

type TLink =
    | `https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/master/note/ahk/diag${number}.ahk`
    | `https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/master/note/code${number}.md`
    | `https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#${string}`
    | `https://www.autohotkey.com/docs/v1/${string}`;

// ScriptError(_T("Global variables must not be declared in this function."), aLineText);
// ScriptError(_T("Local variables must not be declared in this function."), aLineText);

export const enum EDiagCodeDA {
    // 501~599 Analysis Func or Method
    code500 = 500, // var is assigned but never used.
    code501 = 501, // param is assigned but never used.
    code502 = 502, // var case sensitivity
    // code503 = 503, param case sensitivity
    code504 = 504, // Variadic param * >1
    code505 = 505, // param parsed Error -> unknown style
    code506 = 506, // base8 base2 diag of not support number formats
    // ban name
    code511 = 511, // ban var/param name same function-name.
    code512 = 512, // ban global-var name same function-name.
    code513 = 513, // ban label-var name same function-name.
    // TODO ban name with cache
    // code521 = 521, // ban name look like `new not and or`
}

export type TDiagsDA = {
    [k in EDiagCodeDA]: {
        msg: string,
        path: TLink,
    };
};

export const DiagsDA: DeepReadonly<TDiagsDA> = {
    500: {
        msg: 'var is assigned but never used.',
        path: 'https://www.autohotkey.com/docs/v1/Variables.htm',
    },
    501: {
        msg: 'param is assigned but never used.',
        path: 'https://www.autohotkey.com/docs/v1/Functions.htm#optional',
    },
    502: {
        msg: 'case sensitivity',
        path: 'https://www.autohotkey.com/docs/v1/Concepts.htm#names',
    },
    504: {
        msg: 'Note: The "variadic" parameter can only appear at the end of the formal parameter list.',
        path: 'https://www.autohotkey.com/docs/v1/Functions.htm#Variadic',
    },
    505: {
        msg: 'param parsed Error -> unknown style',
        path: 'https://www.autohotkey.com/docs/v1/Functions.htm#param',
    },
    506: {
        msg: 'not support of this number formats',
        path: 'https://www.autohotkey.com/docs/v1/Concepts.htm#numbers',
    },
    511: {
        msg: 'var/param name same func-Name',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/master/note/ahk/diag511.ahk',
    },
    512: {
        msg: 'global-var name same func-Name',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/master/note/ahk/diag511.ahk',
    },
    513: {
        msg: 'label-var name same func-Name',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/master/note/ahk/diag513.ahk',
    },
};

export const enum EDiagCode {
    code107 = 107, // :=
    code111 = 111, // 111~114 is switch err
    code113 = 113,

    // 120~130 is Multiline-Diag
    code120 = 120, // unknown-flag
    code121 = 121, // join > 15
    code122 = 122, // 'ahk-neko-help is not work of "," "`" flag now.',
    // code123 ?
    code124 = 124, // `"` is not closed
    code125 = 125, // `%` miss to closed
    code126 = 126, // `%` variable name contains an illegal character
    code127 = 127, // 'Multiline just allow like `" VarName "` style, `"` need Need whitespace inside.',

    code201 = 201, // 200~299 is not expression // need use %
    // 300~399 is func err
    code301 = 301, // user-config function size

    code304 = 304, // avoid def-func-name look like foc (FlowOfControl)

    // code600~699 warn user

    /**
     * Avoid defining function names like `On()` , `Off()`
     *
     * On, Off, Toggle, AltTab, ShiftAltTab, AltTabAndMenu and AltTabMenuDismiss.
     */
    code601 = 601,
    /**
     * Label name of `On:` , `Off:`
     *
     * On, Off, Toggle, AltTab, ShiftAltTab, AltTabAndMenu and AltTabMenuDismiss.
     */
    code602 = 602,

    /**
     * Unknown #Directives
     */
    code603 = 603,

    // code701 = 701, // 701~799 is Command error
    // 800~899 is Deprecated / Old Syntax
    code801 = 801,
    code802 = 802,
    code803 = 803,
    code804 = 804,
    code806 = 806,
    code811 = 811,
    code812 = 812,
    code813 = 813,
    code814 = 814,
    code815 = 815,
    code816 = 816,
    code824 = 824,
    code825 = 825,
    /**
     * - TODO: move 899 -> 8xx
     * - 899 is Command -> func
     * - https://www.autohotkey.com/docs/v1/Language.htm#commands-vs-functions
     */
    code899 = 899, // 899 is Command -> func

    // 901~999 is not recommended
    code901 = 901,
    code902 = 902,
    code903 = 903,
}

export type TDiags = {
    [k in EDiagCode]: {
        msg: string,
        path: TLink,
    };
};

export const Diags: DeepReadonly<TDiags> = {
    107: {
        msg: '(legacy assignment), try to use `:=` replace',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag107',
    },
    111: {
        msg: '`Default:` Too much ',
        path: 'https://www.autohotkey.com/docs/v1/lib/Switch.htm',
    },
    113: {
        msg: '`Case :` not find ',
        path: 'https://www.autohotkey.com/docs/v1/lib/Switch.htm',
    },
    120: {
        msg: 'unknown options of Multiline',
        path: 'https://www.autohotkey.com/docs/v1/Scripts.htm#Join',
    },
    121: {
        msg: 'Multiline:join > 15 characters',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag121',
    },
    122: {
        msg: 'ahk-neko-help is not work of (, `) flag now.',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag122',
    },
    124: {
        msg: '`"` is not closed',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag124',
    },
    125: {
        msg: '`%` is miss to closed',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag125',
    },
    126: {
        msg: 'Multiline just allow like `%VarName%` of style1.',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag126',
    },
    127: {
        msg: 'Multiline just allow like `" VarName "` of style2, `"` need to use whitespace pack varName.',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag127',
    },
    201: {
        msg: 'If Count is a variable reference such as `%varName%` or `% expression`',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag201',
    },
    301: {
        msg: 'function or Method is so big',
        path: 'https://www.autohotkey.com/docs/v1/Functions.htm',
        // is user setting.
    },
    304: {
        msg: 'avoid def-func-name look like Flow Of Control',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/master/note/code304.md',
    },
    601: {
        msg: 'Avoid defining function names like On, Off, Toggle, AltTab, ShiftAltTab, AltTabAndMenu and AltTabMenuDismiss.',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/master/note/code601.md',
    },
    602: {
        msg: 'recommended that the following names not be used: On, Off, Toggle, AltTab, ShiftAltTab, AltTabAndMenu and AltTabMenuDismiss.',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/master/note/code601.md',
    },
    603: {
        msg: 'unknown #Directives in ahk-v1',
        path: 'https://www.autohotkey.com/docs/v1/lib/index.htm',
    },
    801: {
        msg: 'Deprecated: Use `Loop, Reg, KeyName` instead.',
        path: 'https://www.autohotkey.com/docs/v1/lib/LoopReg.htm#old',
    },
    802: {
        msg: 'Deprecated: Use `Loop, Files, FilePattern` instead.',
        path: 'https://www.autohotkey.com/docs/v1/lib/LoopFile.htm#old',
    },
    803: {
        msg: 'Deprecated: Use `Var := Var / Value` or `Var /= Value` instead.',
        path: 'https://www.autohotkey.com/docs/v1/lib/EnvDiv.htm',
    },
    804: {
        msg: 'Deprecated: Use `Var := Var * Value` or `Var *= Value` instead.',
        path: 'https://www.autohotkey.com/docs/v1/lib/EnvMult.htm',
    },
    806: {
        msg: 'Deprecated: Use `If (expression)` instead.',
        path: 'https://www.autohotkey.com/docs/v1/lib/IfEqual.htm',
    },
    811: {
        msg: 'Deprecated: Use the `OnClipboardChange()` function instead.',
        path: 'https://www.autohotkey.com/docs/v1/lib/OnClipboardChange.htm#label',
    },
    812: {
        msg: 'Deprecated: Use the `OnExit()` function instead.',
        path: 'https://www.autohotkey.com/docs/v1/lib/OnExit.htm#command',
    },
    813: {
        msg: 'Deprecated: Use the `Gui,` command instead.',
        path: 'https://www.autohotkey.com/docs/v1/lib/Progress.htm',
    },
    814: {
        msg: 'Deprecated: Use expression assignments like `Var := Value` instead.',
        path: 'https://www.autohotkey.com/docs/v1/lib/SetEnv.htm',
    },
    815: {
        msg: 'Deprecated: Use the `Format()` function instead.',
        path: 'https://www.autohotkey.com/docs/v1/lib/SetFormat.htm',
    },
    816: {
        msg: 'Deprecated: Use the `Gui` command instead.',
        path: 'https://www.autohotkey.com/docs/v1/lib/SplashTextOn.htm',
    },
    824: {
        msg: 'Deprecated: This command is not recommended for use in new scripts.',
        path: 'https://www.autohotkey.com/docs/v1/lib/Transform.htm',
        // TODO search SubCommand and suggest of new func https://www.autohotkey.com/docs/v1/lib/Transform.htm
    },
    825: {
        msg: 'Deprecated: #AllowSameLineComments was removed.',
        path: 'https://www.autohotkey.com/docs/v1/lib/_AllowSameLineComments.htm',
    },
    899: {
        msg: 'Deprecated: try to use function replace Command(obsolete code)',
        path: 'https://www.autohotkey.com/docs/v1/Language.htm#commands-vs-functions',
        // TODO -> move more 899 -> 8xx code
    },
    901: {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        msg: 'ahk-doc not recommended and ahk-neko-help is not work of this Directives.',
        path: 'https://www.autohotkey.com/docs/v1/lib/_EscapeChar.htm',
    },
    902: {
        msg: 'ahk-doc not recommended and ahk-neko-help is not work of this Directives.',
        path: 'https://www.autohotkey.com/docs/v1/lib/_CommentFlag.htm',
    },
    903: {
        msg: 'ahk-doc not recommended and ahk-neko-help is not work of this Directives.',
        path: 'https://www.autohotkey.com/docs/v1/lib/_EscapeChar.htm#Related',
    },
};
