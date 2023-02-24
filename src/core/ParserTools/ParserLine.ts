import * as vscode from 'vscode';
import { CAhkInclude } from '../../AhkSymbol/CAhkInclude';
import type { CAhkComment, CAhkLabel, TLineClass } from '../../AhkSymbol/CAhkLine';
import { CAhkDirectives } from '../../AhkSymbol/CAhkLine';
import { getRangeOfLine } from '../../tools/range/getRangeOfLine';
import type { TFuncInput } from '../getChildren';
import { getComment } from './getComment';
import { ParserLabel } from './ParserLabel';

export function ParserLine(FuncInput: TFuncInput): CAhkComment | TLineClass | null {
    const { lStr } = FuncInput.AhkTokenLine;

    const strTrim: string = lStr.trim();
    /**
     * CAhkComment
     */
    if (strTrim === '') return getComment(FuncInput);

    /**
     * just of label:
     */
    const label: CAhkLabel | null = ParserLabel(FuncInput);
    if (label !== null) return label;

    const { AhkTokenLine, uri } = FuncInput;
    const { line } = AhkTokenLine;

    /**
     * just of #include and #Directives
     */
    if (!strTrim.startsWith('#')) return null;
    const rangeOfLine: vscode.Range = getRangeOfLine(line, lStr, lStr.length);

    /**
     * just of #Include
     */
    if ((/^#Include(?:Again)?\s/iu).test(strTrim)) {
        return new CAhkInclude({
            name: strTrim,
            range: rangeOfLine,
            selectionRange: rangeOfLine,
            uri,
            AhkTokenLine,
        });
    }

    /**
     * just of #NoEnv
     */
    const ma: RegExpMatchArray | null = strTrim.match(/^(#\w+)\b/u);
    if (ma === null) return null;
    const name: string = ma[1];
    const col: number = lStr.indexOf('#');
    return new CAhkDirectives({
        name,
        range: rangeOfLine,
        selectionRange: new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, col + name.length),
        ),
        uri,
        AhkTokenLine,
    });
}
