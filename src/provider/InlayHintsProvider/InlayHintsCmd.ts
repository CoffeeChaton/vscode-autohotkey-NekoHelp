import * as vscode from 'vscode';
import type { TConfigs } from '../../configUI.data';
import { CommandMDMap, type TCmdMsg } from '../../tools/Built-in/6_command/Command.tools';
import type { TCmdRefEx } from '../../tools/DeepAnalysis/FnVar/def/getFileCmdUsing';
import type { TArgs } from '../../tools/DeepAnalysis/FnVar/def/getFileFnUsing';
import { isBuiltin } from '../../tools/isBuiltin';
import { isLookLikeNumber } from '../../tools/isNumber';
import { isString } from '../../tools/isString';
import { SignatureCmdOverloadMap } from '../SignatureHelpProvider/SignatureCmdOverload';
import { InlayHintsCmdMake } from './InlayHintsCmdMake';

const unknownLabelPart = new vscode.InlayHintLabelPart('unknown:');

/**
 * ```ahk
 * 0 MsgBox , Text
 * 1 MsgBox , Options, Title, Text, Timeout_Sec
 * ```
 */
function getInlayHintLabelPartMsgBox(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    const maxCOmma: number = args.at(-1)?.comma ?? -1;
    const select: TCmdMsg = maxCOmma > 0
        ? cmdDataList[1] // Overload
        : cmdDataList[0];

    const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
    return rr.at(comma) ?? unknownLabelPart;
}

/**
 * ```ahk
 * 0 Random, OutputVar , Min, Max
 * 1 Random, , NewSeed
 * ```
 */
function getInlayHintLabelPartRandom(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    const firstArgs: string = args
        .filter((v) => v.comma === 0)
        .map((v) => v.StrPart)
        .join('')
        .trim();

    const select: TCmdMsg = firstArgs === ''
        ? cmdDataList[1]
        : cmdDataList[0];

    const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
    return rr.at(comma) ?? unknownLabelPart;
}

/**
 * ```ahk
 * 0 Hotkey, KeyName , Label, Options
 * 1 Hotkey, IfWinActive/Exist , WinTitle, WinText
 * 2 Hotkey, If , Expression
 * 3 Hotkey, If, % FunctionObject
 * ```
 */
function getInlayHintLabelPartHotkey(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    const firstArgs: string = args
        .filter((v) => v.comma === 0)
        .map((v) => v.StrPart)
        .join('')
        .trim()
        .toUpperCase();
    if (firstArgs === 'IF') {
        if (comma === 0) return new vscode.InlayHintLabelPart('');
        if (comma === 1) {
            const arg2 = args
                .filter((v) => v.comma === 1)
                .map((v) => v.StrPart)
                .join('')
                .trim();

            return arg2.startsWith('%')
                ? new vscode.InlayHintLabelPart('% FunctionObject:')
                : new vscode.InlayHintLabelPart('Expression:');
        }
        return unknownLabelPart;
    }

    if (firstArgs.startsWith('IF')) { // IfWinActive/Exist
        if (comma === 0) return new vscode.InlayHintLabelPart(''); // IfWinActive/Exist
        if (comma === 1) return new vscode.InlayHintLabelPart('WinTitle:');
        if (comma === 2) return new vscode.InlayHintLabelPart('WinText:');
        return unknownLabelPart;
    }

    const select: TCmdMsg = cmdDataList[0];
    const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
    return rr.at(comma) ?? unknownLabelPart;
}

/**
 * ```ahk
 * 0 IniRead, OutputVar, Filename, Section, Key , Default
 * 1 IniRead, OutputVarSection, Filename, Section
 * 2 IniRead, OutputVarSectionNames, Filename
 * ```
 */
function getInlayHintLabelPartIniRead(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    const maxComma: number = args.at(-1)?.comma ?? -1;

    // eslint-disable-next-line no-magic-numbers
    if (maxComma >= 3) {
        // IniRead, OutputVar, Filename, Section, Key [, Default]
        const select: TCmdMsg = cmdDataList[0];
        const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
        return rr.at(comma) ?? unknownLabelPart;
    }

    if (maxComma === 2) {
        // IniRead, OutputVarSection, Filename, Section
        const select: TCmdMsg = cmdDataList[1];
        const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
        return rr.at(comma) ?? unknownLabelPart;
    }

    if (maxComma === 1) {
        // IniRead, OutputVarSectionNames, Filename
        const select: TCmdMsg = cmdDataList[2];
        const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
        return rr.at(comma) ?? unknownLabelPart;
    }

    return unknownLabelPart;
}

/**
 * ```ahk
 * 0 IniWrite, Value, Filename, Section, Key
 * 1 IniWrite, Pairs, Filename, Section
 * ```
 */
function getInlayHintLabelPartIniWrite(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    const maxCOmma: number = args.at(-1)?.comma ?? -1;
    // eslint-disable-next-line no-magic-numbers
    const select: TCmdMsg = maxCOmma >= 3
        ? cmdDataList[0] // Overload
        : cmdDataList[1];

    const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
    return rr.at(comma) ?? unknownLabelPart;
}

/**
 * ```ahk
 * 0 SplashImage, ImageFile, Options, SubText, MainText, WinTitle, FontName
 * 1 SplashImage, Off
 * ```
 */
function getInlayHintLabelPartSplashImage(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    const firstArgs: string = args
        .filter((v) => v.comma === 0)
        .map((v) => v.StrPart)
        .join('')
        .trim()
        .toUpperCase();

    const select: TCmdMsg = firstArgs === 'OFF'
        ? cmdDataList[1] // Overload
        : cmdDataList[0];

    const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
    return rr.at(comma) ?? unknownLabelPart;
}

/**
 * ```ahk
 * 0 Progress, ProgressParam1, SubText, MainText, WinTitle, FontName
 * 1 Progress, Off
 * ```
 */
// eslint-disable-next-line sonarjs/no-identical-functions
function getInlayHintLabelPartProgress(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    const firstArgs: string = args
        .filter((v) => v.comma === 0)
        .map((v) => v.StrPart)
        .join('')
        .trim()
        .toUpperCase();

    const select: TCmdMsg = firstArgs === 'OFF'
        ? cmdDataList[1] // Overload
        : cmdDataList[0];

    const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
    return rr.at(comma) ?? unknownLabelPart;
}

/**
 * ```ahk
 * 0 WinMove , WinTitle, WinText, X, Y, Width, Height, ExcludeTitle, ExcludeText
 * 1 WinMove , X, Y
 * ```
 */
function getInlayHintLabelPartWinMove(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    const maxCOmma: number = args.at(-1)?.comma ?? -1;
    const select: TCmdMsg = maxCOmma > 1
        ? cmdDataList[0] // Overload
        : cmdDataList[1];

    const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
    return rr.at(comma) ?? unknownLabelPart;
}

/**
 * ```ahk
 * 0 WinSetTitle, WinTitle, WinText, NewTitle , ExcludeTitle, ExcludeText
 * 1 WinSetTitle, NewTitle
 * ```
 */
function getInlayHintLabelPartWinSetTitle(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    const maxCOmma: number = args.at(-1)?.comma ?? -1;
    const select: TCmdMsg = maxCOmma > 0
        ? cmdDataList[0] // Overload
        : cmdDataList[1];

    const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
    return rr.at(comma) ?? unknownLabelPart;
}

function getInlayHintLabelPart(
    comma: number,
    args: readonly TArgs[],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHintLabelPart {
    /**
     * 99% case
     */
    if (cmdDataList.length === 1) {
        const select: TCmdMsg = cmdDataList[0];
        const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
        return rr.at(comma) ?? unknownLabelPart;
    }

    /**
     * ```ahk
     * MsgBox
     * Random
     * Hotkey
     * IniRead
     * IniWrite
     * SplashImage
     * Progress
     * WinMove
     * WinSetTitle
     * ```
     */
    const { keyRawName } = cmdDataList[0];
    if (keyRawName === 'MsgBox') return getInlayHintLabelPartMsgBox(comma, args, cmdDataList);
    if (keyRawName === 'Random') return getInlayHintLabelPartRandom(comma, args, cmdDataList);
    if (keyRawName === 'Hotkey') return getInlayHintLabelPartHotkey(comma, args, cmdDataList);
    if (keyRawName === 'IniRead') return getInlayHintLabelPartIniRead(comma, args, cmdDataList);
    if (keyRawName === 'IniWrite') return getInlayHintLabelPartIniWrite(comma, args, cmdDataList);
    if (keyRawName === 'SplashImage') return getInlayHintLabelPartSplashImage(comma, args, cmdDataList);
    if (keyRawName === 'Progress') return getInlayHintLabelPartProgress(comma, args, cmdDataList);
    if (keyRawName === 'WinMove') return getInlayHintLabelPartWinMove(comma, args, cmdDataList);
    if (keyRawName === 'WinSetTitle') return getInlayHintLabelPartWinSetTitle(comma, args, cmdDataList);

    const select: TCmdMsg = cmdDataList[0];
    const rr: readonly vscode.InlayHintLabelPart[] = InlayHintsCmdMake(select);
    return rr.at(comma) ?? unknownLabelPart;
}

function InlayHintsCmdCore(
    args: readonly TArgs[],
    config: TConfigs['inlayHints'],
    cmdDataList: readonly TCmdMsg[],
): vscode.InlayHint[] {
    const { parameterNamesSuppressWhenArgumentMatchesName, HideSingleParameters, parameterNamesEnabled } = config;
    if (HideSingleParameters && args.length === 1) {
        return [];
    }

    const need: vscode.InlayHint[] = [];
    const commaSet = new Set<number>();
    for (const arg of args) {
        const {
            ln,
            col,
            comma,
            StrPart,
        } = arg;
        if (commaSet.has(comma)) continue;
        commaSet.add(comma);

        if (parameterNamesEnabled === 'literals') {
            const str: string = StrPart.trim();
            if (isBuiltin(str) || isString(str) || isLookLikeNumber(str)) {
                //
            } else {
                continue;
            }
        }

        const label: vscode.InlayHintLabelPart = getInlayHintLabelPart(comma, args, cmdDataList);

        const { value } = label;
        if (value === '') continue; // len === 0 && comma === 0
        if (parameterNamesSuppressWhenArgumentMatchesName && StrPart.trim() === value.replace(':', '')) {
            continue;
        }

        const InlayHint = new vscode.InlayHint(
            new vscode.Position(ln, col + (StrPart.length - StrPart.trimStart().length)),
            [label],
            vscode.InlayHintKind.Parameter,
        );
        InlayHint.paddingRight = true;
        need.push(InlayHint);
    }

    return need;
}

export function InlayHintsCmd(
    selectLineData: TCmdRefEx,
    config: TConfigs['inlayHints'],
): vscode.InlayHint[] {
    const need: vscode.InlayHint[] = [];
    // allFileCmdUsing[line];

    for (const { CmdUpName, args } of selectLineData) {
        if (CmdUpName === '') {
            continue;
        }
        const cmdData2: TCmdMsg | undefined = CommandMDMap.get(CmdUpName);
        if (cmdData2 === undefined) {
            // GLOBAL  IF RETURN CONTINUE ...etc
            continue;
        }

        const cmdDataOverloadMap: readonly TCmdMsg[] = SignatureCmdOverloadMap.get(CmdUpName) ?? [];
        const cmdInlayHintsData: readonly TCmdMsg[] = [cmdData2, ...cmdDataOverloadMap];

        need.push(...InlayHintsCmdCore(
            args,
            config,
            cmdInlayHintsData,
        ));
    }

    return need;
}
