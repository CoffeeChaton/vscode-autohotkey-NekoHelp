import * as vscode from 'vscode';
import { CAhkClassPropertyGetSet } from '../../AhkSymbol/CAhkClass';
import { type TFuncInput } from '../../core/getChildren';
import { getRange } from '../range/getRange';

export function getCAhkClassGet(FuncInput: TFuncInput): CAhkClassPropertyGetSet | null {
    const {
        AhkTokenLine,
        uri,
        DocStrMap,
        RangeEndLine,
        defStack,
    } = FuncInput;

    const {
        lStr,
        line,
        fistWordUp,
    } = AhkTokenLine;

    if (fistWordUp === '') return null;

    const ma: RegExpMatchArray | null = lStr.match(/\b(get|set)\b/iu);
    if (ma === null) return null;
    const col: number | undefined = ma.index;
    if (col === undefined) return null;

    const name: string = ma[1];

    const searchLine = !lStr.endsWith('{')
            && lStr.replace(name, '').trim() !== ''
        ? line + 1
        : line;

    return new CAhkClassPropertyGetSet({
        name,
        range: getRange(DocStrMap, line, searchLine, RangeEndLine, col),
        selectionRange: new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, col + name.length),
        ),
        uri,
        detail: defStack[0],
    });
}
