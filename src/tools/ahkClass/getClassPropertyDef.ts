import * as vscode from 'vscode';
import type { CAhkClassPropertyGetSet } from '../../AhkSymbol/CAhkClass';
import { CAhkClassPropertyDef } from '../../AhkSymbol/CAhkClass';
import { getChildren, type TFuncInput } from '../../core/getChildren';
import { getRange } from '../range/getRange';
import { getCAhkClassGet } from './getCAhkClassGet';

export function getClassPropertyDef(FuncInput: TFuncInput): CAhkClassPropertyDef | null {
    const { lStr, line } = FuncInput.AhkTokenLine;

    if (lStr.includes('(') || lStr.includes('=')) return null;

    const ma: RegExpMatchArray | null = lStr.match(/^[ \t]*(?:\}[ \t]*)?([#$@\w\u{A1}-\u{FFFF}]+)[ \t]*\[/u)
        ?? lStr.match(/^[ \t]*(?:\}[ \t]*)?([#$@\w\u{A1}-\u{FFFF}]+)(?:[ \t{]|$)/u);
    if (ma === null) return null;

    const {
        uri,
        DocStrMap,
        RangeEndLine,
        GValMap,
    } = FuncInput;

    if (ma[0].endsWith('[')) {
        // TODO something ...
    }

    const name: string = ma[1];
    const col: number = lStr.indexOf(name);
    const selectionRange: vscode.Range = new vscode.Range(
        new vscode.Position(line, col),
        new vscode.Position(line, col + name.length),
    );

    const range = getRange(DocStrMap, line, line, RangeEndLine, col);

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
