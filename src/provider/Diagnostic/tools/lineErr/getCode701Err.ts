import * as vscode from 'vscode';
import type { TPatternMatch } from '../../../../core/getSecondUpIfEx';
import { getSecondUpIfEx } from '../../../../core/getSecondUpIfEx';
import type { TAhkFileData } from '../../../../core/ProjectManager';
import { EDiagCode } from '../../../../diag';
import { StatementMDMap } from '../../../../tools/Built-in/3_foc/foc.tools';
import { CommandMDMap } from '../../../../tools/Built-in/6_command/Command.tools';
import { CMemo } from '../../../../tools/CMemo';
import { CDiagBase } from '../CDiagBase';

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
        const match: TPatternMatch | undefined = getSecondUpIfEx.find((v) => v.name === fistWordUp);
        if (match === undefined) continue;
        if (StatementMDMap.has(SecondWordUp) || CommandMDMap.has(SecondWordUp)) continue;
        const { displayErr } = DocStrMap[line];
        if (!displayErr) continue;

        const lStrFix: string = match.fn(lStr, fistWordUpCol);
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
