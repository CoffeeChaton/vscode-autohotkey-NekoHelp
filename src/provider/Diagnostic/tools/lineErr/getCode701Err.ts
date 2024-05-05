import * as vscode from 'vscode';
import { getIfCmdSecUp } from '../../../../core/getSecondUpIfEx';
import type { TAhkFileData } from '../../../../core/ProjectManager';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine } from '../../../../globalEnum';
import { StatementMDMap } from '../../../../tools/Built-in/3_foc/foc.tools';
import { FocIfExMap } from '../../../../tools/Built-in/3_foc/semanticFoc.data';
import { CommandMDMap } from '../../../../tools/Built-in/6_command/Command.tools';
import { CMemo } from '../../../../tools/CMemo';
import type { TScanData } from '../../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { CDiagBase } from '../CDiagBase';

function getCode702(AhkTokenLine: TAhkTokenLine, match: number): CDiagBase | null {
    const {
        fistWordUp,
        fistWordUpCol,
        line,
        lStr,
    } = AhkTokenLine;

    const strF: string = lStr.slice(fistWordUpCol + fistWordUp.length)
        .replace(/^\s*,/u, '')
        .trimStart()
        .padStart(lStr.length);

    // first opt comma
    const arr: TScanData[] = spiltCommandAll(strF);
    // IfInString, MyVar, abc, GoSub, Process1
    // ^    a0     a1     a2     a3
    const aa: TScanData | undefined = arr.at(match - 1);

    if (aa === undefined) return null;
    const { RawNameNew, lPos } = aa;
    for (const ma of RawNameNew.matchAll(/(\w+)/giu)) {
        const RawName: string = ma[1];
        const UpName: string = RawName.toUpperCase();

        if (StatementMDMap.has(UpName) || CommandMDMap.has(UpName)) {
            const col00: number = lPos + RawNameNew.indexOf(RawName);
            const range = new vscode.Range(
                new vscode.Position(line, col00),
                new vscode.Position(line, col00 + RawName.length),
            );

            return new CDiagBase({
                value: EDiagCode.code702,
                range,
                severity: vscode.DiagnosticSeverity.Warning,
                tags: [],
            });
        }
    }

    return null;
}
const code701Err = new CMemo<TAhkFileData, readonly CDiagBase[]>((AhkFileData: TAhkFileData): readonly CDiagBase[] => {
    const { DocStrMap } = AhkFileData;

    const diagList: CDiagBase[] = [];

    for (const AhkTokenLine of DocStrMap) {
        const {
            fistWordUp,
            fistWordUpCol,
            line,
            lStr,
            SecondWordUp,
        } = AhkTokenLine;
        const match: number | undefined = FocIfExMap.get(fistWordUp);
        if (match === undefined) continue;
        if (StatementMDMap.has(SecondWordUp) || CommandMDMap.has(SecondWordUp)) continue;
        if (!DocStrMap[line].displayErr) continue;

        const c702: CDiagBase | null = getCode702(AhkTokenLine, match);
        if (c702 !== null) diagList.push(c702);

        // check c701
        const lStrFix: string = getIfCmdSecUp(fistWordUp, match)(lStr, fistWordUpCol);
        if (lStrFix === '') {
            continue;
        }

        const range = new vscode.Range(
            new vscode.Position(line, lStr.length - lStrFix.length),
            new vscode.Position(line, lStr.length),
        );
        diagList.push(
            new CDiagBase({
                value: EDiagCode.code701,
                range,
                severity: vscode.DiagnosticSeverity.Warning,
                tags: [],
            }),
        );
    }

    return diagList;
});

export function getCode701Err(AhkFileData: TAhkFileData): readonly CDiagBase[] {
    return code701Err.up(AhkFileData);
}
