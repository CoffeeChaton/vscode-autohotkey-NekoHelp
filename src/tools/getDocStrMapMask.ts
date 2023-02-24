import type * as vscode from 'vscode';
import type { TAhkToken, TTokenStream } from '../globalEnum';
import { log } from '../provider/vscWindows/log';

function getDocStrMapMaskSlowMode(range: vscode.Range, DocStrMap: TTokenStream): TTokenStream {
    const startLine: number = range.start.line;
    const endLine: number = range.end.line;
    const AhkTokenList: TAhkToken = [];
    for (const e of DocStrMap) {
        if (e.line < startLine) continue;
        if (e.line > endLine) break;
        AhkTokenList.push(e);
    }
    return AhkTokenList;
}

export function getDocStrMapMask(range: vscode.Range, DocStrMap: TTokenStream): TTokenStream {
    if (DocStrMap[0].line === 0 && DocStrMap.at(-1)?.line === (DocStrMap.length - 1)) {
        return DocStrMap.slice(range.start.line, range.end.line + 1);
    }
    log.warn('DocStrMap not start with 0', range, DocStrMap);
    return getDocStrMapMaskSlowMode(range, DocStrMap);
}
