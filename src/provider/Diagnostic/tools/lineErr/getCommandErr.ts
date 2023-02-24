import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine } from '../../../../globalEnum';
import { CommandErrMap } from '../../../../tools/Built-in/Command.tools';
import { CDiagBase } from '../CDiagBase';

function getLoopErr(lStr: string, line: number, col: number): CDiagBase | null {
    const matchLoop: RegExpMatchArray | null = lStr.match(/\bLoop\b[\s,]*(\w+)/iu);
    if (matchLoop === null) return null; // miss

    const SecondSection = matchLoop[1];
    if ((/^(?:\d+|Files|Parse|Read|Reg)$/iu).test(SecondSection)) {
        return null; // OK
    }

    // eslint-disable-next-line no-magic-numbers
    const colL = lStr.indexOf(SecondSection, col + 4);
    const colR = colL + SecondSection.length;
    if ((/^RootKey$/iu).test(SecondSection)) {
        // https://www.autohotkey.com/docs/v1/lib/LoopReg.htm#old
        return new CDiagBase({
            value: EDiagCode.code801,
            range: new vscode.Range(line, colL, line, colR),
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        });
    }

    if ((/^FilePattern$/iu).test(SecondSection)) {
        // I can't recognize `Loop, FilePattern` syntax
        // https://www.autohotkey.com/boards/viewtopic.php?p=494782#p494782
        // https://www.autohotkey.com/docs/v1/lib/LoopFile.htm#old
        // maybe is never error?
        return new CDiagBase({
            value: EDiagCode.code802,
            range: new vscode.Range(line, colL, line, colR),
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        });
    }

    //     201: {
    //     msg: 'If Count is a variable reference such as `%varName%` or `% expression`',
    //     path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag201',
    // https://www.autohotkey.com/docs/v1/lib/Loop.htm
    return new CDiagBase({
        value: EDiagCode.code201,
        range: new vscode.Range(line, colL, line, colR),
        severity: vscode.DiagnosticSeverity.Error,
        tags: [],
    });
}

function getCommandErrCore(params: TAhkTokenLine, keyWordUp: string, col: number): CDiagBase | null {
    const { lStr, line } = params;

    if (keyWordUp === 'LOOP') {
        return getLoopErr(lStr, line, col);
    }

    const diag: EDiagCode | undefined = CommandErrMap.get(keyWordUp);
    if (diag !== undefined) {
        const colL: number = col;
        return new CDiagBase({
            value: diag,
            range: new vscode.Range(line, colL, line, colL + keyWordUp.length),
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        });
    }
    return null;
}

export function getCommandErr(params: TAhkTokenLine): CDiagBase | null {
    const { fistWordUp } = params;

    if (fistWordUp === '') return null; // miss

    if (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT' || fistWordUp === 'TRY') {
        const { SecondWordUp, SecondWordUpCol } = params;
        return getCommandErrCore(params, SecondWordUp, SecondWordUpCol);
    }
    const { fistWordUpCol } = params;
    return getCommandErrCore(params, fistWordUp, fistWordUpCol);
}
