/* eslint-disable @typescript-eslint/indent */
/* eslint-disable dot-notation */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import * as os from 'node:os';
import {
    dirname,
    isAbsolute,
    join,
    normalize,
    resolve,
} from 'node:path';
import * as vscode from 'vscode';
import type { TBaseLineParam } from './CAhkLine';

const osHomedir: string = os.homedir();

const SystemDriveStr: string = process.env['SystemDrive'] ?? 'C:'; // SystemDrive:'C:'

export const enum EInclude {
    A_LineFile = 0, // happy
    Absolute = 1, // happy

    // bad
    Relative = 2,
    isUnknown = 3,
    Lib = 4,

    A_Desktop = 5,
    A_MyDocuments = 6,
    A_AppData = 7,
    A_AppDataCommon = 8,
    A_DesktopCommon = 9,
    A_WinDir = 10,
    A_Temp = 11,
    A_StartupCommon = 12,
    A_Startup = 13,
    A_StartMenuCommon = 14,
    A_StartMenu = 15,
    A_ProgramsCommon = 16,
    A_Programs = 17,
    A_ComSpec = 18,
}

export const AIncludePathKnownList: readonly EInclude[] = [
    EInclude.Absolute,
    EInclude.A_LineFile,
    EInclude.A_Desktop,
    //
    EInclude.A_AppData,
    EInclude.A_WinDir,
    EInclude.A_AppDataCommon,
    EInclude.A_DesktopCommon,
    EInclude.A_MyDocuments,
    EInclude.A_Temp,
    EInclude.A_StartupCommon,
    EInclude.A_Startup,
    EInclude.A_StartMenuCommon,
    EInclude.A_StartMenu,
    EInclude.A_ProgramsCommon,
    EInclude.A_Programs,
    EInclude.A_ComSpec,
];

export type TRawData = {
    readonly type: EInclude,
    readonly mayPath: string,
    readonly warnMsg: string,
};
const setWarnMsgList: readonly Readonly<RegExp>[] = [
    /%A_AhkPath%/iu,
    /%A_ComputerName%/iu,
    /%A_IsCompiled%/iu,
    /%A_IsUnicode%/iu,
    /%A_ProgramFiles%/iu,
    /%A_ScriptDir%/iu, // WTF ? Changes the working directory for subsequent #Includes and FileInstalls. #Include %A_ScriptDir%
    /%A_ScriptFullPath%/iu,
    /%A_ScriptName%/iu,
    /%A_UserName%/iu,
];

function setWarnMsg(path1: string): string {
    const find: Readonly<RegExp> | undefined = setWarnMsgList.find((reg: Readonly<RegExp>): boolean => reg.test(path1));
    return find === undefined
        ? ''
        : `not plan support of "${find.source}"`;
}

type TIncludeOsMap = {
    reg: Readonly<RegExp>,
    type: EInclude,
    name: `%A_${string}%`,
    mayPathReplaceValue: string,
};

export const IncludeOsMap: readonly TIncludeOsMap[] = [
    {
        reg: /^%A_Desktop%/iu,
        type: EInclude.A_Desktop,
        name: '%A_Desktop%',
        mayPathReplaceValue: `${osHomedir}/Desktop`,
    },
    {
        reg: /^%A_MyDocuments%/iu,
        type: EInclude.A_MyDocuments,
        name: '%A_MyDocuments%',
        mayPathReplaceValue: `${osHomedir}/Documents`,
    },
    {
        reg: /^%A_AppData%/iu,
        type: EInclude.A_AppData,
        name: '%A_AppData%',
        mayPathReplaceValue: `${osHomedir}/AppData/Roaming`,
    },
    {
        reg: /^%A_AppDataCommon%/iu,
        type: EInclude.A_AppDataCommon,
        name: '%A_AppDataCommon%',
        mayPathReplaceValue: process.env['ALLUSERSPROFILE'] ?? 'C:/ProgramData',
    },
    {
        reg: /^%A_DesktopCommon%/iu,
        type: EInclude.A_DesktopCommon,
        name: '%A_DesktopCommon%',
        mayPathReplaceValue: `${process.env['PUBLIC'] ?? 'C:/Users/Public'}/Desktop`, // C:\\Users\\Public
    },
    {
        reg: /^%A_WinDir%/iu,
        type: EInclude.A_WinDir,
        name: '%A_WinDir%',
        mayPathReplaceValue: process.env['windir'] ?? 'C:/Windows',
    },
    {
        reg: /^%A_Temp%/iu,
        type: EInclude.A_Temp,
        name: '%A_Temp%',
        mayPathReplaceValue: `${osHomedir}/AppData/Local/Temp`,
    },
    {
        reg: /^%A_StartupCommon%/iu,
        type: EInclude.A_StartupCommon,
        name: '%A_StartupCommon%',
        mayPathReplaceValue: `${SystemDriveStr}/ProgramData/Microsoft/Windows/Start Menu/Programs/Startup`,
    },
    {
        reg: /^%A_Startup%/iu,
        type: EInclude.A_Startup,
        name: '%A_Startup%',
        mayPathReplaceValue: `${osHomedir}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup`,
    },
    {
        reg: /^%A_StartMenuCommon%/iu,
        type: EInclude.A_StartMenuCommon,
        name: '%A_StartMenuCommon%',
        mayPathReplaceValue: `${SystemDriveStr}/ProgramData/Microsoft/Windows/Start Menu`,
    },
    {
        reg: /^%A_StartMenu%/iu,
        type: EInclude.A_StartMenu,
        name: '%A_StartMenu%',
        mayPathReplaceValue: `${osHomedir}/AppData/Roaming/Microsoft/Windows/Start Menu`,
    },
    {
        reg: /^%A_ProgramsCommon%/iu,
        type: EInclude.A_ProgramsCommon,
        name: '%A_ProgramsCommon%',
        mayPathReplaceValue: `${SystemDriveStr}/ProgramData/Microsoft/Windows/Start Menu/Programs`,
    },
    {
        reg: /^%A_Programs%/iu,
        type: EInclude.A_Programs,
        name: '%A_Programs%',
        mayPathReplaceValue: `${osHomedir}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs`,
    },
    {
        reg: /^%A_ComSpec%/iu,
        type: EInclude.A_ComSpec,
        name: '%A_ComSpec%',
        mayPathReplaceValue: process.env['ComSpec'] ?? 'C:/Windows/system32/cmd.exe',
    },
    // A_ProgramFiles
];

export function getRawData(path1: string, fsPath: string): TRawData {
    const warnMsg: string = setWarnMsg(path1);
    if ((/^%A_LineFile%/iu).test(path1)) {
        // [v1.1.11+]: Use %A_LineFile%\.. to refer to the directory which contains the current file
        //    , even if it is not the main script file. For example, #Include %A_LineFile%\..\other.ahk.

        return {
            type: EInclude.A_LineFile,
            mayPath: normalize(path1.replace(/^%A_LineFile%/iu, fsPath)),
            warnMsg,
        };
    }

    if (isAbsolute(path1)) {
        return {
            type: EInclude.Absolute,
            mayPath: path1,
            warnMsg,
        };
    }

    if (path1.startsWith('<') && path1.endsWith('>')) {
        return {
            type: EInclude.Lib,
            mayPath: path1.slice(1, -1),
            warnMsg,
        };
    }

    if (resolve(path1) === normalize(path1)) {
        return {
            type: EInclude.Relative,
            mayPath: normalize(path1),
            warnMsg,
        };
    }

    if (path1.startsWith('%')) { // %A_
        for (const { reg, type, mayPathReplaceValue } of IncludeOsMap) {
            if (reg.test(path1)) {
                return {
                    type,
                    mayPath: normalize(path1
                        .replace(reg, mayPathReplaceValue)),
                    warnMsg,
                };
            }
        }
    }

    return {
        type: EInclude.isUnknown,
        mayPath: path1,
        warnMsg,
    };
}

export class CAhkInclude extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/v1/lib/_Include.htm
    // https://github.com/AutoHotkey/AutoHotkeyUX/commit/a8f202ff241df2fb8f7d5a654c39e2be1ad44126

    // #Include Compiler.ahk
    // #include *i __debug.ahk
    // #Include <VersionRes>
    // #Include %A_ScriptDir% ;Changes the working directory for subsequent #Includes and FileInstalls.
    // #Include %A_LineFile%\..\other.ahk.

    public readonly hashtag = 'INCLUDE'; //

    public readonly IgnoreErrors: boolean;

    public readonly uri: vscode.Uri;

    public readonly path1: string;

    public readonly rawData: TRawData;

    declare public readonly kind: vscode.SymbolKind.Module;

    declare public readonly detail: '';

    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
            textRaw,
        }: TBaseLineParam & { textRaw: string },
    ) {
        super(name, '', vscode.SymbolKind.Module, range, selectionRange);
        this.uri = uri;

        const path0: string = name.replace(/^\s*#include(?:Again)?\s/iu, '').trim();
        this.IgnoreErrors = (/^\*i\s/iu).test(path0); //  For example: #Include *i SpecialOptions.ahk
        const path1: string = textRaw
            .replace(/^\s*#include(?:Again)?\s+/iu, '')
            .replace(/^\*i\s+/iu, '')
            .trim();
        this.path1 = path1;
        const tryRemoveComment: string = path1.replace(/[ \t];.*$/u, '')
            .trim()
            .replaceAll(/%A_Tab%/giu, '\t')
            .replaceAll(/%A_Space%/giu, ' ');

        const { type, mayPath, warnMsg } = getRawData(tryRemoveComment, uri.fsPath);

        this.rawData = {
            type,
            mayPath: mayPath.replaceAll('/', '\\'),
            warnMsg,
        };
    }
}

export function pathJoinMagic(rawData: TRawData, rootPath: string): string {
    const { type, mayPath, warnMsg } = rawData;

    if (warnMsg !== '') return '';

    if (EInclude.isUnknown === type) {
        return join(dirname(rootPath), mayPath);
    }

    if (type === EInclude.Lib) {
        return join(
            dirname(rootPath),
            mayPath
                .replace(/^</u, '')
                .replace(/>$/u, ''),
        );
    }

    return mayPath;
}
