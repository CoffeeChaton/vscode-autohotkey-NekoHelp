import * as path from 'node:path';
import * as vscode from 'vscode';
import { CAhkLabel } from '../../AhkSymbol/CAhkLine';
import { EDetail } from '../../globalEnum';
import { getRangeOfLine } from '../../tools/range/getRangeOfLine';
import type { TFuncInput } from '../getChildren';

export function ParserLabel(FuncInput: TFuncInput): CAhkLabel | null {
    if (!FuncInput.AhkTokenLine.detail.includes(EDetail.isLabelLine)) {
        return null;
    }

    const { AhkTokenLine, uri, DocStrMap } = FuncInput;
    const {
        textRaw,
        line,
        lStr,
    } = AhkTokenLine;

    const ahkDoc: string = DocStrMap.at(line - 1)?.ahkDoc ?? '';
    /**
     * Generally, aside from whitespace and comments, no other code can be written on the same line as a label.
     */
    const name: string = lStr.trim();
    const col: number = textRaw.search(/\S/u);
    const userDoc: string = ahkDoc === '' && textRaw.length > (lStr.length + 1)
        ? textRaw.slice(lStr.length + 1)
        : ahkDoc;

    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown(`(label)     of     ${path.basename(uri.fsPath)}\n`)
        .appendCodeblock(name);

    if (userDoc !== '') {
        md.appendMarkdown('\n---\n')
            .appendMarkdown(userDoc);
    }

    md.supportHtml = true;

    return new CAhkLabel({
        name,
        range: getRangeOfLine(line, lStr, lStr.length),
        selectionRange: new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, col + name.length),
        ),
        uri,
        AhkTokenLine,
    }, md);
}
