import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import { log } from '../../provider/vscWindows/log';

function getSearchLineFix(DocStrMap: TTokenStream, searchLine: number, RangeEnd: number): number {
    for (let line = searchLine; line < RangeEnd; line++) {
        if (DocStrMap[line].detail.includes(EDetail.deepAdd)) {
            return line;
        }
    }
    return RangeEnd;
}

export function getRange(
    DocStrMap: TTokenStream,
    defLine: number,
    searchLine: number,
    RangeEnd: number,
    startCharacter: number,
): vscode.Range {
    //  selectionRange must be contained in fullRange

    const searchLineFix = getSearchLineFix(DocStrMap, searchLine, RangeEnd);
    const startDeep = (DocStrMap[searchLineFix].deep2.at(-1) ?? 0) - 1;
    for (let line = searchLineFix + 1; line <= RangeEnd; line++) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (DocStrMap[line] === undefined) {
            log.error(
                '"DocStrMap[line] === undefined"\nDocStrMap[line - 1] is ',
                DocStrMap[line - 1],
            );

            break;
        }
        if (DocStrMap[line].deep2.includes(startDeep)) {
            const col = DocStrMap[line].lStr.lastIndexOf('}'); // FIXME
            return new vscode.Range(defLine, startCharacter, line, col);
        }
        // if (DocStrMap[line].deep <= startDeep) {
        //     const col = DocStrMap[line].lStr.lastIndexOf('}');
        //     return new vscode.Range(defLine, 0, line, col);
        // }
    }

    log.error([
        '"get Range Error"----',
        `- startDeep: ${startDeep}`,
        `- textRaw: ${DocStrMap[searchLine].textRaw}`,
        `- defLine: ${defLine}`,
        `- searchLineFix: "${searchLineFix}"`,
        `- startDeep: ${startDeep}`,
        `- RangeEnd: ${RangeEnd}`,
        '------------------------',
    ].join('\n'));
    return new vscode.Range(defLine, 0, searchLine + 1, 0);
}
