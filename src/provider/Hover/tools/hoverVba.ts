import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine, TTokenStream } from '../../../globalEnum';
import { getDAWithPos } from '../../../tools/DeepAnalysis/getDAWithPos';
import { setVarTrackRange } from '../../CompletionItem/classThis/wrapClass';
import type { CVbaCompletionItem } from '../../CompletionItem/vba/2Completion/CVbaCompletionItem';
import type { TVbaDataLast } from '../../CompletionItem/vba/valTrackFn';
import { valTrackAllowFnCall } from '../../CompletionItem/vba/valTrackFn';
import { vbaCompletionDeep1 } from '../../CompletionItem/vba/vbaCompletion';
import { getObjChapterArrAllowFnCall } from '../../CompletionItem/vba/wrapVba';

export function hoverVba(
    document: vscode.TextDocument,
    AhkFileData: TAhkFileData,
    position_raw: vscode.Position,
): vscode.Hover | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position_raw);
    if (range === undefined) return null;
    const wordLast: string = document.getText(range).toUpperCase();

    const position = new vscode.Position(position_raw.line, range.end.character);
    const { AST, DocStrMap } = AhkFileData;

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];
    const { lStr, textRaw } = AhkTokenLine;

    const col: number = position.character;
    if (col > lStr.length) return null;

    const ChapterArr: readonly string[] | null = getObjChapterArrAllowFnCall(textRaw, col);
    if (ChapterArr === null) return null;

    const AhkTokenList: TTokenStream = setVarTrackRange(position, AhkFileData, DA);
    const data: TVbaDataLast | null = valTrackAllowFnCall(ChapterArr, AhkTokenList);

    if (data === null) return null;

    let s = '';
    const list: CVbaCompletionItem[] = vbaCompletionDeep1(data);
    for (const v of list) {
        if (wordLast === v.label.label.toUpperCase()) {
            s += v.documentation.value;
        }
    }

    return new vscode.Hover(new vscode.MarkdownString(s), range);
}
