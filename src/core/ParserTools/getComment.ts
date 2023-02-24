import * as vscode from 'vscode';
import { CAhkComment } from '../../AhkSymbol/CAhkLine';
import { EDetail } from '../../globalEnum';
import type { TFuncInput } from '../getChildren';

export function getComment(FuncInput: TFuncInput): CAhkComment | null {
    const { detail, textRaw } = FuncInput.AhkTokenLine;

    if (!detail.includes(EDetail.hasDoubleSemicolon)) {
        return null;
    }

    // ;;
    if (!(/^\s*;;/u).test(textRaw)) {
        return null;
    }

    const { AhkTokenLine, uri } = FuncInput;
    const { line } = AhkTokenLine;

    const doubleSemicolon: number = textRaw.indexOf(';;');

    const name: string = textRaw.trim();

    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, doubleSemicolon),
        new vscode.Position(line, textRaw.length),
    );
    return new CAhkComment({
        name,
        range,
        selectionRange: range,
        uri,
        AhkTokenLine,
    });
}
