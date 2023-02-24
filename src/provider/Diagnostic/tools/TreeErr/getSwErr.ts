/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,20] }] */
import * as vscode from 'vscode';
import { CAhkCase, CAhkDefault, CAhkSwitch } from '../../../../AhkSymbol/CAhkSwitch';
import type { TAhkSymbol } from '../../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../../diag';
import { CDiagBase } from '../CDiagBase';

function setErrDefault(sw: CAhkSwitch): CDiagBase | null {
    const { children } = sw;
    const DefaultList: CAhkDefault[] = children
        .filter((e: CAhkCase | CAhkDefault): e is CAhkDefault => e instanceof CAhkDefault);

    const iDefault: number = DefaultList.length;

    if (iDefault === 1 || iDefault === 0) return null; // OK

    return new CDiagBase({ // too Much
        value: EDiagCode.code111,
        range: DefaultList[0].range,
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [],
    });
}

function setErrCase(sw: CAhkSwitch): CDiagBase | null {
    const { children, range } = sw;
    const iCase: number = children
        .filter((e: CAhkCase | CAhkDefault): boolean => e instanceof CAhkCase)
        .length;

    return iCase === 0 // not find
        ? new CDiagBase({
            value: EDiagCode.code113,
            range,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
        })
        : null; // at 1~19
}

export function getSwErr(sw: TAhkSymbol): CDiagBase[] {
    if (!(sw instanceof CAhkSwitch)) return [];

    type TFnLint = (sw: CAhkSwitch) => CDiagBase | null;
    const fnList: TFnLint[] = [setErrDefault, setErrCase];

    const digS: CDiagBase[] = [];
    for (const fn of fnList) {
        const err: CDiagBase | null = fn(sw);
        if (err !== null) digS.push(err);
    }

    return digS;
}
