import * as vscode from 'vscode';
import { CAhkInclude } from '../../AhkSymbol/CAhkInclude';
import type { CAhkComment, TLineClass } from '../../AhkSymbol/CAhkLine';
import { CAhkDirectives } from '../../AhkSymbol/CAhkLine';
import { EDetail } from '../../globalEnum';
import { DirectivesMDMap } from '../../tools/Built-in/0_directive/Directives.tool';
import { getRangeOfLine } from '../../tools/range/getRangeOfLine';
import type { TFuncInput } from '../getChildren';
import { getComment } from './getComment';
import { ParserLabel } from './ParserLabel';

export function ParserLine(FuncInput: TFuncInput): CAhkComment | TLineClass | null {
    const { AhkTokenLine, uri } = FuncInput;
    const {
        lStr,
        textRaw,
        line,
        detail,
    } = AhkTokenLine;

    const strTrim: string = lStr.trim();

    /**
     * CAhkComment
     */
    if (strTrim === '') return getComment(FuncInput);

    /**
     * just of label:
     */
    if (detail.includes(EDetail.isLabelLine)) {
        return ParserLabel(FuncInput);
    }

    /**
     * just of #include and #Directives
     */
    if (!strTrim.startsWith('#')) return null;
    if (!detail.includes(EDetail.isDirectivesLine)) return null;
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
            textRaw,
        });
    }

    /**
     * just of #NoEnv [#$@\w\u{A1}-\u{FFFF}]+
     */
    const ma: RegExpMatchArray | null = strTrim.match(/^(#\w+)/u); // core-check it now
    if (ma === null) return null;
    const name: string = ma[1];
    const col: number = lStr.indexOf('#');

    const hashtag: string = name.replace('#', '').toUpperCase();
    if (DirectivesMDMap.has(hashtag)) {
        return new CAhkDirectives({
            name,
            range: rangeOfLine,
            selectionRange: new vscode.Range(
                new vscode.Position(line, col),
                new vscode.Position(line, col + name.length),
            ),
            uri,
            AhkTokenLine,
        }, hashtag);
    }
    return null;
}
