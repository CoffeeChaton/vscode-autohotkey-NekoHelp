/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4,5] }] */
import * as os from 'node:os';
import {
    isAbsolute,
    join,
    normalize,
    resolve,
} from 'node:path';
import * as vscode from 'vscode';
import { ToUpCase } from '../tools/str/ToUpCase';
import type { TBaseLineParam } from './CAhkLine';

export const enum EInclude {
    A_LineFile = 0, // happy
    Absolute = 1, // happy

    // bad
    Relative = 2,
    isUnknown = 3,
    Lib = 4,

    A_Desktop = 5,
}

export type TRawData = {
    readonly type: EInclude,
    readonly mayPath: string,
    readonly warnMsg: string,
};
const setWarnMsgList = [
    // 'A_LineFile',
    'A_WinDir',
    'A_UserName',
    'A_Temp',
    'A_StartupCommon',
    'A_Startup',
    'A_StartMenuCommon',
    'A_StartMenu', // keep sort line reverse
    'A_ScriptName',
    'A_ScriptFullPath',
    'A_ScriptDir', // WTF ? Changes the working directory for subsequent #Includes and FileInstalls. #Include %A_ScriptDir%
    'A_ProgramsCommon',
    'A_Programs', // keep sort line reverse
    'A_ProgramFiles',
    'A_MyDocuments',
    'A_IsCompiled',
    'A_DesktopCommon',
    //    'A_Desktop', // keep sort line reverse
    'A_ComSpec',
    'A_ComputerName',
    'A_AppDataCommon',
    'A_AppData',
    'A_AhkPath',
] as const;

function setWarnMsg(path1: string): string {
    const pathUp: string = ToUpCase(path1);

    const find: string | undefined = setWarnMsgList.find((v: string): boolean => pathUp.includes(v.toUpperCase()));
    return find === undefined
        ? ''
        : `not yet support of "${find}"`;
}

function getRawData(path1: string, fsPath: string): TRawData {
    const warnMsg: string = setWarnMsg(path1);
    if ((/^%A_LineFile%/iu).test(path1)) {
        // [v1.1.11+]: Use %A_LineFile%\.. to refer to the directory which contains the current file
        //    , even if it is not the main script file. For example, #Include %A_LineFile%\..\other.ahk.
        return {
            type: EInclude.A_LineFile,
            mayPath: join(fsPath, `../${normalize(path1.replace(/^%A_LineFile%/iu, ''))}`),
            warnMsg,
        };
    }

    if ((/^%A_Desktop%/iu).test(path1)) {
        return {
            type: EInclude.A_Desktop,
            mayPath: normalize(path1
                .replace(/^%A_Desktop%/iu, `${os.homedir()}/Desktop`)),
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

    return {
        type: EInclude.isUnknown,
        mayPath: path1,
        warnMsg,
    };
}

export class CAhkInclude extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/v1/lib/_Include.htm

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
        this.rawData = getRawData(tryRemoveComment, uri.fsPath);
    }
}
