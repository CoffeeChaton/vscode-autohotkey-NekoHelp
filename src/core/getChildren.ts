/* eslint-disable max-depth */
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4,5] }] */
import type * as vscode from 'vscode';
import type { TAhkTokenLine, TTokenStream } from '../globalEnum';
import type { TGValMap } from './ParserTools/ahkGlobalDef';

export type TFuncInput = Readonly<{
    AhkTokenLine: TAhkTokenLine,
    //
    defStack: string[],
    DocStrMap: TTokenStream,
    GValMap: TGValMap,
    RangeEndLine: number,
    uri: vscode.Uri,
}>;

type ChildType = Readonly<{
    defStack: string[],
    DocStrMap: TTokenStream,
    GValMap: TGValMap,
    RangeEndLine: number,
    RangeStartLine: number,
    uri: vscode.Uri,
}>;

type TChildrenType<T extends vscode.DocumentSymbol> = T['children'][number];

export function getChildren<T extends vscode.DocumentSymbol>(
    fnList: ((FuncInput: TFuncInput) => TChildrenType<T> | null)[],
    child: ChildType,
): TChildrenType<T>[] {
    const {
        DocStrMap,
        RangeStartLine,
        RangeEndLine,
        defStack,
        GValMap,
        uri,
    } = child;

    const result: TChildrenType<T>[] = [];
    let Resolved = RangeStartLine; // <--------------------------------
    for (let line = RangeStartLine; line < RangeEndLine; line++) {
        if (line < Resolved) continue; // <------------------------------------
        const AhkTokenLine: TAhkTokenLine = DocStrMap[line];

        for (const fn of fnList) {
            const DocumentSymbol: TChildrenType<T> | null = fn({
                AhkTokenLine,
                DocStrMap,
                RangeEndLine,
                defStack,
                GValMap,
                uri,
            });
            if (DocumentSymbol !== null) {
                result.push(DocumentSymbol);
                Resolved = DocumentSymbol.range.end.line; // <-----------------
                if (
                    Resolved > DocumentSymbol.range.start.line
                    && (/^[ \t}]*[^ \t}]/u).test(DocStrMap[DocumentSymbol.range.end.line].lStr)
                ) { // not only `}`
                    Resolved--;
                }

                break;
            }
        }
    }
    return result;
}
