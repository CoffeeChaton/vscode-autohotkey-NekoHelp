/* eslint-disable dot-notation */
import * as os from 'node:os';
import * as path from 'node:path';
import {
    isAbsolute,
    normalize,
    resolve,
} from 'node:path';
import type * as vscode from 'vscode';
import { EInclude } from '../../../AhkSymbol/CAhkInclude';
import { type TAhkTokenLine } from '../../../globalEnum';
import { CompletionAbsolutePath } from './IncludeFsPath';

const osHomedir: string = os.homedir();

const SystemDriveStr: string = process.env['SystemDrive'] ?? 'C:'; // SystemDrive:'C:'

type TIncludeOsMap = {
    reg: Readonly<RegExp>,
    type: EInclude,
    name: `%A_${string}%`,
    mayPathReplaceValue: string,
};

const IncludeOsMap: readonly TIncludeOsMap[] = [
    {
        reg: /%A_Desktop%/iu,
        type: EInclude.A_Desktop,
        name: '%A_Desktop%',
        mayPathReplaceValue: `${osHomedir}/Desktop`,
    },
    {
        reg: /%A_MyDocuments%/iu,
        type: EInclude.A_MyDocuments,
        name: '%A_MyDocuments%',
        mayPathReplaceValue: `${osHomedir}/Documents`,
    },
    {
        reg: /%A_AppData%/iu,
        type: EInclude.A_AppData,
        name: '%A_AppData%',
        mayPathReplaceValue: `${osHomedir}/AppData/Roaming`,
    },
    {
        reg: /%A_AppDataCommon%/iu,
        type: EInclude.A_AppDataCommon,
        name: '%A_AppDataCommon%',
        mayPathReplaceValue: process.env['ALLUSERSPROFILE'] ?? 'C:/ProgramData',
    },
    {
        reg: /%A_DesktopCommon%/iu,
        type: EInclude.A_DesktopCommon,
        name: '%A_DesktopCommon%',
        mayPathReplaceValue: `${process.env['PUBLIC'] ?? 'C:/Users/Public'}/Desktop`, // C:\\Users\\Public
    },
    {
        reg: /%A_WinDir%/iu,
        type: EInclude.A_WinDir,
        name: '%A_WinDir%',
        mayPathReplaceValue: process.env['windir'] ?? 'C:/Windows',
    },
    {
        reg: /%A_Temp%/iu,
        type: EInclude.A_Temp,
        name: '%A_Temp%',
        mayPathReplaceValue: `${osHomedir}/AppData/Local/Temp`,
    },
    {
        reg: /%A_StartupCommon%/iu,
        type: EInclude.A_StartupCommon,
        name: '%A_StartupCommon%',
        mayPathReplaceValue: `${SystemDriveStr}/ProgramData/Microsoft/Windows/Start Menu/Programs/Startup`,
    },
    {
        reg: /%A_Startup%/iu,
        type: EInclude.A_Startup,
        name: '%A_Startup%',
        mayPathReplaceValue: `${osHomedir}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup`,
    },
    {
        reg: /%A_StartMenuCommon%/iu,
        type: EInclude.A_StartMenuCommon,
        name: '%A_StartMenuCommon%',
        mayPathReplaceValue: `${SystemDriveStr}/ProgramData/Microsoft/Windows/Start Menu`,
    },
    {
        reg: /%A_StartMenu%/iu,
        type: EInclude.A_StartMenu,
        name: '%A_StartMenu%',
        mayPathReplaceValue: `${osHomedir}/AppData/Roaming/Microsoft/Windows/Start Menu`,
    },
    {
        reg: /%A_ProgramsCommon%/iu,
        type: EInclude.A_ProgramsCommon,
        name: '%A_ProgramsCommon%',
        mayPathReplaceValue: `${SystemDriveStr}/ProgramData/Microsoft/Windows/Start Menu/Programs`,
    },
    {
        reg: /%A_Programs%/iu,
        type: EInclude.A_Programs,
        name: '%A_Programs%',
        mayPathReplaceValue: `${osHomedir}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs`,
    },
    {
        reg: /%A_ComSpec%/iu,
        type: EInclude.A_ComSpec,
        name: '%A_ComSpec%',
        mayPathReplaceValue: process.env['ComSpec'] ?? 'C:/Windows/system32/cmd.exe',
    },
    // A_WorkingDir
    // A_ProgramFiles
];

type TIncludeOsMap2 = {
    reg: Readonly<RegExp>,
    type: EInclude,
    name: `%A_${string}%`,
    getMayPath: (path1: string, fsPath: string) => string,
};

const IncludeOsMap2: readonly TIncludeOsMap2[] = [
    {
        reg: /%A_LineFile%/iu,
        type: EInclude.A_LineFile,
        name: '%A_LineFile%',
        getMayPath: (path1: string, fsPath: string): string => normalize(path1.replace(/%A_LineFile%/iu, fsPath)),
    },
    {
        reg: /%A_ScriptDir%/iu,
        type: EInclude.A_ScriptDir,
        name: '%A_ScriptDir%',
        // dprint-ignore
        getMayPath: (path1: string, fsPath: string): string => normalize(path1.replace(/%A_ScriptDir%/iu, `${fsPath}/../`)),
    },
    {
        reg: /%A_WorkingDir%/iu,
        type: EInclude.A_WorkingDir,
        name: '%A_WorkingDir%',
        // dprint-ignore
        getMayPath: (path1: string, fsPath: string): string => normalize(path1.replace(/%A_WorkingDir%/iu, `${fsPath}/../`)),
    },
];

type TMayPathData = {
    readonly type: EInclude,
    readonly mayPath: string,
    readonly col: number,
};

/**
 * ```ahk
 * Run, % "ReadMe.docx", %A_Desktop%\document , % "Max Min Hide UseErrorLevel", OutputVarPID
 * ;                     ^^^^^^^^^^^^^^^^^^^
 * ```
 *
 * Try to match possible values from a long list of random strings
 */
export function getRawData2(path1: string, fsPath: string): TMayPathData {
    // const tryRemoveComment: string = path1.replace(/[ \t];.*$/u, '')
    //     .trim()
    //     .replaceAll(/%A_Tab%/giu, '\t')
    //     .replaceAll(/%A_Space%/giu, ' ');

    // %A_
    const c1 = path1.search(/%A_/iu);
    if (c1 > -1) {
        const path2 = path1.slice(c1, path1.length);
        for (const { reg, type, getMayPath } of IncludeOsMap2) {
            if (reg.test(path2)) {
                return {
                    type,
                    mayPath: getMayPath(path2, fsPath),
                    col: c1,
                };
            }
        }
        //
        for (const { reg, type, mayPathReplaceValue } of IncludeOsMap) {
            if (reg.test(path2)) {
                return {
                    type,
                    mayPath: normalize(path2.replace(reg, mayPathReplaceValue)),
                    col: c1,
                };
            }
        }
    }

    // %A_
    const c2: number = path1.search(/[a-z]:\\/iu);
    if (c2 > -1) {
        const path2 = path1.slice(c2, path1.length);
        if (isAbsolute(path2)) {
            return {
                type: EInclude.Absolute,
                mayPath: path2,
                col: c2,
            };
        }
    }

    // %A_
    const c3: number = path1.search(/\.[/\\]/u);
    if (c3 > -1) {
        const path2 = path1.slice(c3, path1.length);
        if (resolve(path2) === normalize(path2)) {
            return {
                type: EInclude.Relative,
                mayPath: normalize(path2),
                col: c3,
            };
        }
    }

    return {
        type: EInclude.isUnknown,
        mayPath: path1,
        col: -1,
    };
}

export function getNormalPathCompletion(
    uri: vscode.Uri,
    position: vscode.Position,
    AhkTokenLine: TAhkTokenLine,
    context: vscode.CompletionContext,
): vscode.CompletionItem[] {
    if (!(context.triggerCharacter === '\\' || context.triggerCharacter === '/')) {
        return [];
    }
    const { textRaw } = AhkTokenLine;

    const path1: string = textRaw
        .slice(0, position.character) // hover mode not need this line
        .replace(/[ \t]+;.*$/u, '')
        .trim()
        .replaceAll(/%A_Tab%/giu, '\t')
        .replaceAll(/%A_Space%/giu, ' ');

    const { type, mayPath } = getRawData2(path1, uri.fsPath);

    if (type === EInclude.isUnknown) {
        return [];
    }

    // if (type === EInclude.Absolute || type === EInclude.A_LineFile) {
    return CompletionAbsolutePath(path.normalize(mayPath), false);
}
