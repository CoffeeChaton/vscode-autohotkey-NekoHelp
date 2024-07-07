import * as vscode from 'vscode';
import type { CAhkClassPropertyGetSet } from '../../AhkSymbol/CAhkClass';
import { CAhkClassPropertyDef } from '../../AhkSymbol/CAhkClass';
import { getChildren, type TFuncInput } from '../../core/getChildren';
import type { TTokenStream } from '../../globalEnum';
import { getRange } from '../range/getRange';
import { getCAhkClassGet } from './getCAhkClassGet';

function getPropertySearchLine(DocStrMap: TTokenStream, defLine: number): number | null {
    for (let i: number = defLine + 1; i < DocStrMap.length; i++) {
        const { cll, lStr, line } = DocStrMap[i];
        if ((/^[ \t]*\{/u).test(lStr)) return line;
        if (cll === 0) {
            return null;
        }
    }
    return null;
}

export function getClassPropertyDef(FuncInput: TFuncInput): CAhkClassPropertyDef | null {
    const { lStr, line } = FuncInput.AhkTokenLine;

    if (lStr.includes('(') || lStr.includes('=')) return null;

    const ma: RegExpMatchArray | null = lStr.match(/^[ \t}]*([#$@\w\u{A1}-\u{FFFF}]+)[ \t]*\[/u)
        ?? lStr.match(/^[ \t}]*([#$@\w\u{A1}-\u{FFFF}]+)(?:[ \t{]|$)/u);
    if (ma === null) return null;

    const {
        uri,
        DocStrMap,
        RangeEndLine,
        GValMap,
    } = FuncInput;

    // if (ma[0].endsWith('[')) {
    //     // TODO something ...
    // }

    const name: string = ma[1];
    const colS: number = lStr.indexOf(name);
    const colE: number = colS + name.length;
    const selectionRange: vscode.Range = new vscode.Range(
        new vscode.Position(line, colS),
        new vscode.Position(line, colE),
    );

    const searchLine: number | null = lStr.includes('{')
        ? line
        : getPropertySearchLine(DocStrMap, line);

    if (searchLine === null) return null;

    const range = getRange(DocStrMap, line, searchLine, RangeEndLine, colS);

    const ch: CAhkClassPropertyGetSet[] = getChildren<CAhkClassPropertyDef>(
        [getCAhkClassGet],
        {
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            defStack: [name],
            uri,
            GValMap,
        },
    );

    return new CAhkClassPropertyDef({
        name,
        range,
        selectionRange,
        uri,
        ch,
    });
}
