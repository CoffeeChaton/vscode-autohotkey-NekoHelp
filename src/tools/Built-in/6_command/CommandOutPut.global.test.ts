/* cSpell:disable */

import { inPutVarMap, OutputCommandBaseMap, OutputCommandPlusMap } from './Command.tools';

const outBase = [
    'ControlGet, OutputVar, SubCommand, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText',
    'ControlGetFocus, OutputVar, WinTitle, WinText, ExcludeTitle, ExcludeText',
    'ControlGetText, OutputVar, Control, WinTitle, WinText, ExcludeTitle, ExcludeText',
    'DriveGet, OutputVar, SubCommand, Value',
    'DriveSpaceFree, OutputVar, Path',
    'EnvAdd, OutVar, Value, TimeUnits',
    'EnvDiv, OutVar, Value',
    'EnvGet, OutputVar, EnvVarName',
    'EnvMult, OutVar, Value',
    'EnvSub, OutVar, Value',
    'FileGetAttrib, OutputVar, Filename',
    'FileGetSize, OutputVar, Filename, Units',
    'FileGetTime, OutputVar, Filename, WhichTime',
    'FileGetVersion, OutputVar, Filename',
    'FileRead, OutputVar, Filename',
    'FileReadLine, OutputVar, Filename, LineNum',
    'FileSelectFile, OutputVar, Options, RootDir_or_Filename, Title, Filter',
    'FileSelectFolder, OutputVar, StartingFolder, Options, Prompt',
    'FormatTime, OutputVar, YYYYMMDDHH24MISS, Format',
    'GetKeyState, OutputVar, KeyName, Mode',
    'GuiControlGet, OutputVar, SubCommand, ControlID, Value',
    'IniRead, OutputVar, Filename, Section, Key, Default',
    'Input, OutputVar, Options, EndKeys, MatchList',
    'InputBox, OutputVar, Title, Prompt, HIDE, Width, Height, X, Y, Locale, Timeout, Default',
    'PixelGetColor, OutputVar, X, Y, Mode',
    'Random, OutputVar, Min, Max',
    'RegRead, OutputVar, KeyName, ValueName',
    'SetEnv, OutVar, Value',
    'SoundGet, OutputVar, ComponentType, ControlType, DeviceNumber',
    'SoundGetWaveVolume, OutputVar, DeviceNumber',
    'StatusBarGetText, OutputVar, Part#, WinTitle, WinText, ExcludeTitle, ExcludeText',
    'StringGetPos, OutputVar, InputVar, SearchText, Occurrence, Offset',
    'StringLeft, OutputVar, InputVar, Count',
    'StringLen, OutputVar, InputVar',
    'StringLower, OutputVar, InputVar, T',
    'StringMid, OutputVar, InputVar, StartChar, Count, L',
    'StringReplace, OutputVar, InputVar, SearchText, ReplaceText, ReplaceAll',
    'StringRight, OutputVar, InputVar, Count',
    'StringTrimLeft, OutputVar, InputVar, Count',
    'StringTrimRight, OutputVar, InputVar, Count',
    'StringUpper, OutputVar, InputVar, T',
    'SysGet, OutputVar, SubCommand, Value',
    'Transform, OutputVar, SubCommand, Value1, Value2',
    'WinGet, OutputVar, SubCommand, WinTitle, WinText, ExcludeTitle, ExcludeText',
    'WinGetActiveTitle, OutputVar',
    'WinGetClass, OutputVar, WinTitle, WinText, ExcludeTitle, ExcludeText',
    'WinGetText, OutputVar, WinTitle, WinText, ExcludeTitle, ExcludeText',
    'WinGetTitle, OutputVar, WinTitle, WinText, ExcludeTitle, ExcludeText',
] as const;

const outPlus = [
    'ControlGetPos, OutX, OutY, OutWidth, OutHeight, Control, WinTitle, WinText, ExcludeTitle, ExcludeText',
    'FileGetShortcut, LinkFile, OutTarget, OutDir, OutArgs, OutDescription, OutIcon, OutIconNum, OutRunState',
    'ImageSearch, OutputVarX, OutputVarY',
    'MouseGetPos, OutputVarX, OutputVarY, OutputVarWin, OutputVarControl',
    'PixelSearch, OutputVarX, OutputVarY',
    'Run, Target, WorkingDir, Options, OutputVarPID',
    'RunWait, Target, WorkingDir, Options, OutputVarPID',
    'SplitPath, InputVar, OutFileName, OutDir, OutExtension, OutNameNoExt, OutDrive',
    'WinGetActiveStats, OutTitle, OutWidth, OutHeight, OutX, OutY',
    'WinGetPos, OutX, OutY, OutWidth, OutHeight, WinTitle, WinText, ExcludeTitle, ExcludeText',
] as const;

const inputList = [
    'Sort, InputVar, Options',
    'SplitPath, InputVar, OutFileName, OutDir, OutExtension, OutNameNoExt, OutDrive',
    'StringGetPos, OutputVar, InputVar, SearchText, Occurrence, Offset',
    'StringLeft, OutputVar, InputVar, Count',
    'StringLen, OutputVar, InputVar',
    'StringLower, OutputVar, InputVar, T',
    'StringMid, OutputVar, InputVar, StartChar, Count, L',
    'StringReplace, OutputVar, InputVar, SearchText, ReplaceText, ReplaceAll',
    'StringRight, OutputVar, InputVar, Count',
    'StringSplit, OutputArray, InputVar, Delimiters, OmitChars',
    'StringTrimLeft, OutputVar, InputVar, Count',
    'StringTrimRight, OutputVar, InputVar, Count',
    'StringUpper, OutputVar, InputVar, T',
] as const;

function getCmdHead(lineStr: string): string {
    return lineStr
        .slice(0, lineStr.indexOf(','))
        .trim()
        .toUpperCase();
}

function DataCheck(testList: readonly string[], map: ReadonlyMap<string, unknown>): string[] {
    expect(testList.length === map.size).toBeTruthy();

    const errList: string[] = [];
    for (const lineStr of testList) {
        if (!map.has(getCmdHead(lineStr))) {
            errList.push(lineStr);
        }
    }
    return errList;
}

describe('check outList Command cover', () => {
    it('check: OutPutB OutPutP InPut', (): void => {
        expect.hasAssertions();

        const errList0: string[] = DataCheck(outBase, OutputCommandBaseMap);
        const errList1: string[] = DataCheck(outPlus, OutputCommandPlusMap);
        const errList2: string[] = DataCheck(inputList, inPutVarMap);

        expect(errList0).toHaveLength(0);
        expect(errList1).toHaveLength(0);
        expect(errList2).toHaveLength(0);
    });
});
