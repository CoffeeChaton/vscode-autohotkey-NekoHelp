import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
import { getRange } from './getRange';
import { getRangeOfLine } from './getRangeOfLine';

export function getRangeCaseBlock(
    DocStrMap: TTokenStream,
    defLine: number,
    searchLine: number,
    RangeEnd: number,
    defLStr: string,
): vscode.Range {
    if (!defLStr.trimEnd().endsWith(':')) {
        /*
         * exp : case "cat": return "cat";
         * exp : case 3: do something;
         */
        return getRangeOfLine(defLine, defLStr, DocStrMap[defLine].textRaw.length);
    }

    /*
     * exp : case 0:\s*
     *          something at next line;
     */
    const startPos: vscode.Position = new vscode.Position(defLine, 0);
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
            (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT' || fistWordUp === 'TRY')
            && lStr.includes(':')
        ) {
            const col = DocStrMap[line - 1].textRaw.length;
            return new vscode.Range(startPos, new vscode.Position(line - 1, col));
        }
    }
    return new vscode.Range(startPos, new vscode.Position(RangeEnd, 0));
}
