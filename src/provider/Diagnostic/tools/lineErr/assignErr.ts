import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine, TTokenStream } from '../../../../globalEnum';
import { EDetail, EMultiline } from '../../../../globalEnum';
import { CMemo } from '../../../../tools/CMemo';
import { CDiagBase } from '../CDiagBase';

function assignErr({
    detail,
    line,
    lStr,
}: TAhkTokenLine, DocStrMap: TTokenStream): CDiagBase | null {
    if (!detail.includes(EDetail.inSkipSign2)) return null;

    const tokenNext: TAhkTokenLine | undefined = DocStrMap[line + 1] as TAhkTokenLine | undefined;

    if (tokenNext !== undefined && tokenNext.multiline === EMultiline.start) {
        return null;
    }

    const col: number = lStr.indexOf('=');
    return new CDiagBase({
        value: EDiagCode.code107,
        range: new vscode.Range(line, col, line, col + 1),
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [],
    });
}

const AssignErr = new CMemo<TTokenStream, readonly CDiagBase[]>((DocStrMap: TTokenStream) => {
    const diagList: CDiagBase[] = [];

    for (const token of DocStrMap) {
        if (!token.displayErr) continue;

        const ed1: CDiagBase | null = assignErr(token, DocStrMap);
        if (ed1 !== null) diagList.push(ed1);
    }
    return diagList;
});

export function getAssignErr(DocStrMap: TTokenStream): readonly CDiagBase[] {
    return AssignErr.up(DocStrMap);
}
