import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine } from '../../../../globalEnum';
import { CommandErrMap } from '../../../../tools/Built-in/Command.tools';
import { RegRootList } from '../../../../tools/Built-in/RegRoot/RegRootKey';
import type { TScanData } from '../../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { CDiagBase } from '../CDiagBase';

type TLoopData = { lPos: number, section: string };
function getLoopErrData(lStr: string, wordUpCol: number): TLoopData | null {
    const strF: string = lStr
        .slice(wordUpCol)
        .replace(/^\s*Loop\b\s*,?\s*/iu, 'Loop,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // Loop, HKEY_LOCAL_MACHINE
    // Loop, %A_Desktop%\combine\*,
    // a0    a1

    const a1: TScanData | undefined = arr.at(1);
    if (a1 === undefined) return null;

    const { lPos, RawNameNew } = a1;
    const sectionFix: string = arr.at(2) === undefined
        ? RawNameNew.replace(/\s*\{$/u, '')
        : RawNameNew;

    return { lPos, section: sectionFix };
}
function getLoopErr(lStr: string, line: number, wordUpCol: number): CDiagBase | null {
    const data: TLoopData | null = getLoopErrData(lStr, wordUpCol);
    if (data === null) return null;
    const { lPos, section } = data;

    if ((/^(?:\d+|Files|Parse|Read|Reg|0x[A-F\d]+)$/iu).test(section)) {
        return null; // OK
    }

    const colL: number = lPos;
    const colR: number = lPos + section.length;

    const paramUp: string = section.toUpperCase();
    const isOldRegLoop: boolean = RegRootList.some((key): boolean => paramUp.includes(key));

    if (isOldRegLoop) {
        // https://www.autohotkey.com/docs/v1/lib/LoopReg.htm#old
        return new CDiagBase({
            value: EDiagCode.code801,
            range: new vscode.Range(line, colL, line, colR),
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        });
    }

    if (paramUp.includes('\\')) {
        // https://www.autohotkey.com/boards/viewtopic.php?p=494782#p494782
        // https://www.autohotkey.com/docs/v1/lib/LoopFile.htm#old
        return new CDiagBase({
            value: EDiagCode.code802,
            range: new vscode.Range(line, colL, line, colR),
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        });
    }

    // if () {
    // is float / 1.0e3
    // }

    if (paramUp.includes('%')) {
        return null; // OK
    }

    //     201: {
    //     msg: 'If Count is a variable reference such as `%varName%` or `% expression`',
    //     path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/main/note#diag201',
    // https://www.autohotkey.com/docs/v1/lib/Loop.htm
    return new CDiagBase({
        value: EDiagCode.code201,
        range: new vscode.Range(line, colL, line, colR),
        severity: vscode.DiagnosticSeverity.Error,
        tags: [],
    });
}

function getCommandErrCore(params: TAhkTokenLine, keyWordUp: string, wordUpCol: number): CDiagBase | null {
    const { lStr, line } = params;

    if (keyWordUp === 'LOOP') {
        return getLoopErr(lStr, line, wordUpCol);
    }

    const diag: EDiagCode | undefined = CommandErrMap.get(keyWordUp);
    if (diag !== undefined) {
        return new CDiagBase({
            value: diag,
            range: new vscode.Range(line, wordUpCol, line, wordUpCol + keyWordUp.length),
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        });
    }
    return null;
}

export function getCommandErr(params: TAhkTokenLine): CDiagBase | null {
    const {
        fistWordUp,
        SecondWordUp,
        SecondWordUpCol,
        fistWordUpCol,
    } = params;

    if (fistWordUp === '') return null; // miss

    if (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT' || fistWordUp === 'TRY') {
        return getCommandErrCore(params, SecondWordUp, SecondWordUpCol);
    }
    return getCommandErrCore(params, fistWordUp, fistWordUpCol);
}
