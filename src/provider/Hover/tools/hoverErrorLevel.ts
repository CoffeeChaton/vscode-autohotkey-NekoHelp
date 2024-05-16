/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { Bi_VarMDMap } from '../../../tools/Built-in/1_built_in_var/BiVariables.tools';
import type { TCmdMsg } from '../../../tools/Built-in/6_command/Command.tools';
import { CommandMDMap } from '../../../tools/Built-in/6_command/Command.tools';

export const ErrorLevelMap = new Map<string, string>(
    [
        // ['Language element', 'ErrorLevel values'],
        // ['DllCall()', '0, -1, -2, -3, -4, n, An'],
        // ['RegExMatch()', '0, string, -n'],
        // ['RegExReplace()', '0, string, -n'],
        // //
        // ['Gui: GuiSize event', '0, 1, 2'],
        // ['Gui: GuiDropFiles event', '0, n'],

        // //
        // ['Gui control: Link click event', 'string'],
        // ['Gui control: Custom event', '0, n'],
        // ['Gui control: ListView item change event', 'subset of "SsFfCc"'],

        // //
        // ['WinSet Style/ExStyle/Region', '0, 1'], // ?

        //
        ['ClipWait', '0, 1'],
        ['Control', '0, 1'],
        ['ControlClick', '0, 1'],
        ['ControlFocus', '0, 1'],
        ['ControlGet', '0, 1'],
        ['ControlGetFocus', '0, 1'],
        ['ControlGetText', '0, 1'],
        ['ControlMove', '0, 1'],
        ['ControlSend', '0, 1'],
        ['ControlSendRaw', '0, 1'],
        ['ControlSetText', '0, 1'],
        ['Drive', '0, 1'],
        ['DriveGet', '0, 1'],
        ['EnvSet', '0, 1'],
        ['EnvUpdate', '0, 1'],
        ['FileAppend', '0, 1'],
        ['FileCopy', '0, n'],
        ['FileCopyDir', '0, 1'],
        ['FileCreateDir', '0, 1'],
        ['FileCreateShortcut', '0, 1'],
        ['FileDelete', '0, n'],
        ['FileGetAttrib', '0, 1'],
        ['FileGetShortcut', '0, 1'],
        ['FileGetSize', '0, 1'],
        ['FileGetTime', '0, 1'],
        ['FileGetVersion', '0, 1'],
        ['FileInstall', '0, 1'],
        ['FileMove', '0, n'],
        ['FileMoveDir', '0, 1'],
        ['FileRead', '0, 1'],
        ['FileReadLine', '0, 1'],
        ['FileRecycle', '0, 1'],
        ['FileRecycleEmpty', '0, 1'],
        ['FileRemoveDir', '0, 1'],
        ['FileSelectFile', '0, 1'],
        ['FileSelectFolder', '0, 1'],
        ['FileSetAttrib', '0, n'],
        ['FileSetTime', '0, 1'],
        ['GroupActivate', '0, 1'],

        ['GuiControl', '0, 1'],
        ['GuiControlGet', '0, 1'],

        ['Hotkey', '0, 1, 2, 3, 4, 5, 6, 98, 99'],
        ['ImageSearch', '0, 1, 2'],
        ['IniDelete', '0, 1'],
        ['IniWrite', '0, 1'],
        ['Input', '0, 1, NewInput, Max, Timeout, Match, EndKey:Name'],
        ['InputBox', '0, 1, 2'],
        ['KeyWait', '0, 1'],
        ['Menu', '0, 1'],
        ['PixelGetColor', '0, 1'],
        ['PixelSearch', '0, 1, 2'],
        ['PostMessage', '0, 1'],
        ['Process', '0, PID'],
        ['RegDelete', '0, 1'],
        ['RegRead', '0, 1'],
        ['RegWrite', '0, 1'],
        ['Run', '0, ERROR'],
        ['RunWait', 'n, ERROR'],
        ['SendMessage', 'FAIL, n'],
        ['SetWorkingDir', '0, 1'],
        ['Sort', '0, n'], // '(U option)'
        ['SoundGet', '0, string'],
        ['SoundGetWaveVolume', '0, 1'],
        ['SoundPlay', '0, 1'],
        ['SoundSet', '0, string'],
        ['SoundSetWaveVolume', '0, 1'],
        ['StatusBarGetText', '0, 1'],
        ['StatusBarWait', '0, 1, 2'],
        ['StringGetPos', '0, 1'],
        ['StringReplace', '0, 1, n'],
        ['UrlDownloadToFile', '0, 1'],
        ['WinGetText', '0, 1'],
        ['WinMenuSelectItem', '0, 1'],
        ['WinWait', '0, 1'],
        ['WinWaitActive', '0, 1'],
        ['WinWaitNotActive', '0, 1'],
        ['WinWaitClose', '0, 1'],
    ].map((v: string[]): [string, string] => [v[0].toUpperCase(), v[1]]),
);

function hoverErrorLevelCore(AhkTokenLine: TAhkTokenLine): TCmdMsg | null {
    const {
        fistWordUp,
        SecondWordUp,
    } = AhkTokenLine;
    if (fistWordUp === '') return null;
    return CommandMDMap.get(fistWordUp) ?? CommandMDMap.get(SecondWordUp) ?? null;
}

export function hoverErrorLevel(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
    wordUp: string,
): vscode.MarkdownString | null {
    if (wordUp !== 'ErrorLevel'.toUpperCase()) return null;
    const { DocStrMap } = AhkFileData;

    for (let i = position.line; i >= 0; i--) {
        const AhkTokenLine: TAhkTokenLine = DocStrMap[i];
        const cmd: TCmdMsg | null = hoverErrorLevelCore(AhkTokenLine);
        if (cmd === null) continue;

        const e2: string | undefined = ErrorLevelMap.get(cmd.keyRawName.toUpperCase());
        if (e2 === undefined) continue;

        const {
            line,
            textRaw,
        } = AhkTokenLine;

        const md: string = [
            '```ahk',
            // at line ...
            `;${cmd.keyRawName} at line ${line + 1}`,
            textRaw.trim(),
            `ErrorLevel := "${e2}"`,
            '```',
            '',
            '---',
            '',
            '',
            Bi_VarMDMap.get('ErrorLevel'.toUpperCase())?.value ?? '',
        ].join('\n');

        return new vscode.MarkdownString(md, true);
    }

    return null;
}
