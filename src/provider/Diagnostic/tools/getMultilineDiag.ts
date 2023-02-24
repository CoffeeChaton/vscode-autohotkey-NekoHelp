import * as vscode from 'vscode';
import { EDiagCode } from '../../../diag';
import type {
    NonNull,
    TAhkTokenLine,
    TMultilineFlag,
    TPos,
    TTokenStream,
} from '../../../globalEnum';
import { EMultiline } from '../../../globalEnum';
import { CDiagBase } from './CDiagBase';
import { diagEMultilineMidStyle1, diagEMultilineMidStyle2 } from './getMultilineDiagMid';

type TDiagCodeAllow =
    | EDiagCode.code120
    | EDiagCode.code121
    | EDiagCode.code122;

function fnMakeDiag(Pos: TPos, value: TDiagCodeAllow, line: number, severity: vscode.DiagnosticSeverity): CDiagBase {
    //
    const { col, len } = Pos;
    return new CDiagBase({
        value,
        range: new vscode.Range(line, col, line, col + len),
        severity,
        tags: [],
    });
}

function diagEMultilineStart(multilineFlag: NonNull<TMultilineFlag>, line: number): CDiagBase[] {
    const {
        Join,
        unknownFlag,
        isExpress,
        PercentFlag, // Percent: TPos[]; // %
        commaFlag, // comma: TPos[]; // ,
        accentFlag,
    } = multilineFlag;

    const diagList: CDiagBase[] = [
        // unknown
        ...unknownFlag
            .map((Pos: TPos): CDiagBase => fnMakeDiag(Pos, EDiagCode.code120, line, vscode.DiagnosticSeverity.Warning)),
        //
        // Join is too long > 15 characters
        ...Join
            // eslint-disable-next-line no-magic-numbers
            .filter(({ len }: TPos): boolean => len > 19) // 15+ "join".len
            .map((Pos: TPos): CDiagBase => fnMakeDiag(Pos, EDiagCode.code121, line, vscode.DiagnosticSeverity.Warning)),
    ];

    if (commaFlag.length > 0 || accentFlag.length > 0) {
        diagList.push(fnMakeDiag(PercentFlag[0], EDiagCode.code122, line, vscode.DiagnosticSeverity.Information));
    }

    if (isExpress) {
        // FIXME: check this line is open by `"`.
    }

    return diagList;
}

function diagEMultilineEnd(params: TAhkTokenLine): [] | [CDiagBase] {
    const { textRaw } = params;
    if ((/^[ \t]*\)[ \t]*"/u).test(textRaw)) {
        return [];
    }

    return [];
    // const col = textRaw.indexOf(')');
    // return [
    //     new CDiagBase({
    //         value, // FIXME: check this line is closed by `"`.
    //         range: new vscode.Range(line, 0, line, col),
    //         severity: vscode.DiagnosticSeverity.Error,
    //         tags: [],
    //     }),
    // ];
}

function getMultilineDiagOfLine(params: TAhkTokenLine): CDiagBase[] {
    const {
        multiline,
        multilineFlag,
        line,
        lStr,
    } = params;

    if (multilineFlag === null) return [];
    if (multiline === EMultiline.start) return diagEMultilineStart(multilineFlag, line);
    if (multiline === EMultiline.mid) {
        return multilineFlag.isExpress
            ? diagEMultilineMidStyle2(line, lStr)
            : diagEMultilineMidStyle1(line, lStr);
    }
    if (multiline === EMultiline.end && multilineFlag.isExpress) {
        return diagEMultilineEnd(params);
    }
    // if EMultiline.none
    return [];
}

export function getMultilineDiag(DocStrMap: TTokenStream): CDiagBase[] {
    return DocStrMap
        .filter(({ displayErr }: TAhkTokenLine): boolean => displayErr)
        .flatMap((params: TAhkTokenLine): CDiagBase[] => getMultilineDiagOfLine(params));
}

// https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section
