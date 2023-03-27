import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
import { getRange } from './getRange';

export function getCaseDefaultRange(
    DocStrMap: TTokenStream,
    defLine: number,
    searchLine: number,
    RangeEnd: number,
    defLStr: string,
): vscode.Range {
    const startPos: vscode.Position = new vscode.Position(defLine, defLStr.search(/case|default/iu));
    const nextLine = searchLine + 1;
    let Resolved = -1;
    for (let line = nextLine; line <= RangeEnd; line++) {
        if (line < Resolved) continue;

        const { lStr, fistWordUp, fistWordUpCol } = DocStrMap[line];

        if (fistWordUp === 'SWITCH') {
            const SwitchRange: vscode.Range = getRange(DocStrMap, line, line, RangeEnd, fistWordUpCol);
            Resolved = SwitchRange.end.line;
            continue;
        }
        if (
            (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT')
            && lStr.includes(':')
        ) {
            const col = DocStrMap[line - 1].textRaw.length;
            return new vscode.Range(startPos, new vscode.Position(line - 1, col));
        }
    }
    return new vscode.Range(startPos, new vscode.Position(RangeEnd, 0));
}
