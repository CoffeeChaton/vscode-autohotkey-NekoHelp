import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine, TTokenStream } from '../../../globalEnum';
import { getDAWithPos } from '../../../tools/DeepAnalysis/getDAWithPos';
import type { TVbaDataLast } from '../../CompletionItem/classThis/valTrackFn';
import { valTrackAllowFnCall } from '../../CompletionItem/classThis/valTrackFn';
import { setVarTrackRange } from '../../CompletionItem/classThis/wrapClass';
import { vbaCompletionDeep1 } from '../../CompletionItem/vba/vbaCompletion';
import { getObjChapterArrAllowFnCall } from '../../CompletionItem/vba/wrapVba';

export function hoverVba(
    document: vscode.TextDocument,
    AhkFileData: TAhkFileData,
    _position: vscode.Position,
): vscode.Hover | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(_position);
    if (range === undefined) return null;
    const wordLast: string = document.getText(range).toUpperCase();

    const position = new vscode.Position(_position.line, range.end.character);
    const { AST, DocStrMap } = AhkFileData;

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];
    const { lStr, textRaw } = AhkTokenLine;

    const col: number = position.character;
    if (col > lStr.length) return null;

    const ChapterArr: readonly string[] | null = getObjChapterArrAllowFnCall(textRaw, col);
    if (ChapterArr === null) return null;

    const AhkTokenList: TTokenStream = setVarTrackRange(position, AhkFileData, DA);
    const data: TVbaDataLast | null = valTrackAllowFnCall([...ChapterArr], AhkTokenList);

    if (data === null) return null;

    let s = '';
    for (const v of vbaCompletionDeep1(data)) {
        if (wordLast === v.label.toUpperCase()) {
            s += v.documentation.value;
        }
    }

    return new vscode.Hover(new vscode.MarkdownString(s), range);
}
