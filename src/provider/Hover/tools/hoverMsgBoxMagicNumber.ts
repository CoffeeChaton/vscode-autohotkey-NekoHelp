/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { MsgBoxFullTable } from '../../../tools/Built-in/6_command/MsgBoxFullTable.data';
import { CMemo } from '../../../tools/CMemo';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

type TMsgBoxTree = Readonly<{
    Group1: readonly [string, number, string][],
    Group2: readonly [string, number, string][],
    Group3: readonly [string, number, string][],
    Group4: readonly [string, number, string][],
    Group5: readonly [string, number, string][],
}>;

/**
 * https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Options
 */
const MsgBoxData: TMsgBoxTree = {
    Group1: [
        ['OK (that is, only an OK button is displayed)', 0, '0x0'],
        ['OK/Cancel', 1, '0x1'],
        ['Abort/Retry/Ignore', 2, '0x2'],
        ['Yes/No/Cancel', 3, '0x3'],
        ['Yes/No', 4, '0x4'],
        ['Retry/Cancel', 5, '0x5'],
        ['Cancel/Try Again/Continue', 6, '0x6'],
    ],
    Group2: [
        ['Icon Hand (stop/error)', 16, '0x10'],
        ['Icon Question', 32, '0x20'],
        ['Icon Exclamation', 48, '0x30'],
        ['Icon Asterisk (info)', 64, '0x40'],
    ],
    Group3: [
        ['Makes the 2nd button the default', 256, '0x100'],
        ['Makes the 3rd button the default', 512, '0x200'],
        ['Makes the 4th button the default(requires the Help button to be present)', 768, '0x300'],
    ],
    Group4: [
        ['System Modal (always on top)', 4096, '0x1000'],
        ['Task Modal', 8192, '0x2000'],
        ['Always-on-top (style WS_EX_TOPMOST)(like System Modal but omits title bar icon)', 262_144, '0x40000'],
    ],
    Group5: [
        ['Adds a Help button (see remarks below)', 16_384, '0x4000'],
        ['Make the text right-justified', 524_288, '0x80000'],
        ['Right-to-left reading order for Hebrew/Arabic', 1_048_576, '0x100000'],
    ],
};

type TMsgBoxNumberData = {
    need: readonly string[],
    lPos: number,
    len: number,
};

function TryGetMsgBoxNumber(lStr: string, wordUpCol: number): TMsgBoxNumberData | null {
    const strF: string = lStr
        .slice(wordUpCol)
        .replace(/^\s*MsgBox\b\s*,?\s*/iu, 'MsgBox,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // MsgBox, 16
    // a0    a1

    const a1: TScanData | undefined = arr.at(1);
    if (a1 === undefined || arr.length === 2) return null;
    //
    const { RawNameNew, lPos } = a1;
    const magicNumberRaw: number = RawNameNew.startsWith('0X') || RawNameNew.startsWith('0x')
        ? Number.parseInt(RawNameNew, 16)
        : Number.parseInt(RawNameNew, 10);

    const len: number = RawNameNew.length;

    let magicNumber: number = magicNumberRaw;
    const need: string[] = [
        '```ahk\nMsgBox, Options\n```',
        '[read doc](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Options)',
        '',
        '---',
    ];

    if (Number.isNaN(magicNumberRaw)) {
        return {
            need,
            lPos,
            len,
        };
    }

    for (const [Group, v] of Object.entries(MsgBoxData).toReversed()) {
        if (magicNumber < v[0][1]) continue;

        need.push(Group, '');

        for (const [Function, Decimal, Hex_Value] of v.toReversed()) {
            if (magicNumber >= Decimal) {
                magicNumber -= Decimal;
                need.push(Function, '```ahk', `${Decimal} == ${Hex_Value}`, '```');
                if (magicNumber === 0) {
                    return {
                        need,
                        lPos,
                        len,
                    };
                }
            }
        }
    }

    return {
        need,
        lPos,
        len,
    };
}

function hoverMsgBoxMagicNumberCore(AhkTokenLine: TAhkTokenLine): TMsgBoxNumberData | null {
    const {
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
        lStr,
    } = AhkTokenLine;
    if (fistWordUp === '') return null;
    if (fistWordUp === 'MSGBOX') return TryGetMsgBoxNumber(lStr, fistWordUpCol);
    if (SecondWordUp === 'MSGBOX') return TryGetMsgBoxNumber(lStr, SecondWordUpCol);
    return null;
}

type THoverMeta = {
    range: vscode.Range,
    md: string,
};

const memoMsgBoxMagicNumber = new CMemo<TAhkTokenLine, THoverMeta | null>(
    (AhkTokenLine: TAhkTokenLine): THoverMeta | null => {
        const pp: TMsgBoxNumberData | null = hoverMsgBoxMagicNumberCore(AhkTokenLine);
        if (pp === null) return null;
        const { line } = AhkTokenLine;
        const { need, lPos, len } = pp;
        //
        const md: string = [
            ...need,
            '---',
            MsgBoxFullTable,
        ].join('\n');

        return {
            range: new vscode.Range(
                new vscode.Position(line, lPos),
                new vscode.Position(line, lPos + len),
            ),
            md,
        };
    },
);

export function hoverMsgBoxMagicNumber(AhkTokenLine: TAhkTokenLine, position: vscode.Position): vscode.Hover | null {
    const pp: THoverMeta | null = memoMsgBoxMagicNumber.up(AhkTokenLine);
    if (pp === null) return null;

    const { range, md } = pp;
    if (range.contains(position)) {
        return new vscode.Hover(md, range);
    }

    return null;
}
