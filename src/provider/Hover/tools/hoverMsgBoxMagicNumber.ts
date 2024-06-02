/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { $t } from '../../../i18n';
import { MsgBoxFullTable } from '../../../tools/Built-in/6_command/MsgBoxFullTable.data';
import { CMemo } from '../../../tools/CMemo';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

type TMsgBoxTree = readonly [msg: string, number, `0x${number}`, `Group #${number}:${string}`];

const Group1 = 'Group #1: Buttons';
const Group2 = 'Group #2: Icon';
const Group3 = 'Group #3: Default Button';
const Group4 = 'Group #4: Modality';
const Group5 = 'Group #5: Other Options';

/**
 * https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Options
 */
const MsgBoxData: readonly TMsgBoxTree[] = ([
    // Group1
    ['OK (that is, only an OK button is displayed)', 0, '0x0', Group1],
    ['OK/Cancel', 1, '0x1', Group1],
    ['Abort/Retry/Ignore', 2, '0x2', Group1],
    ['Yes/No/Cancel', 3, '0x3', Group1],
    ['Yes/No', 4, '0x4', Group1],
    ['Retry/Cancel', 5, '0x5', Group1],
    ['Cancel/Try Again/Continue', 6, '0x6', Group1],
    // Group2
    ['Icon Hand (stop/error)', 16, '0x10', Group2],
    ['Icon Question', 32, '0x20', Group2],
    ['Icon Exclamation', 48, '0x30', Group2],
    ['Icon Asterisk (info)', 64, '0x40', Group2],

    // Group3
    ['Makes the 2nd button the default', 256, '0x100', Group3],
    ['Makes the 3rd button the default', 512, '0x200', Group3],
    ['Makes the 4th button the default(requires the Help button to be present)', 768, '0x300', Group3],

    // Group4
    ['System Modal (always on top)', 4096, '0x1000', Group4],
    ['Task Modal', 8192, '0x2000', Group4],
    ['Always-on-top (style WS_EX_TOPMOST)(like System Modal but omits title bar icon)', 262_144, '0x40000', Group4],

    // Group5
    ['Adds a Help button (see remarks below)', 16_384, '0x4000', Group5],
    ['Make the text right-justified', 524_288, '0x80000', Group5],
    ['Right-to-left reading order for Hebrew/Arabic', 1_048_576, '0x100000', Group5],
] as TMsgBoxTree[]).sort((a: TMsgBoxTree, b: TMsgBoxTree) => a[1] - b[1]).reverse();

type TMsgBoxNumberData = {
    need: readonly string[],
    lPos: number,
    len: number,
};

function ParserNumber(s: string): number {
    return s.startsWith('0X') || s.startsWith('0x')
        ? Number.parseInt(s, 16)
        : Number.parseInt(s, 10);
}

function tryParserAddNumber(RawNameNew: string): number {
    const trim: string = RawNameNew.trim();
    if ((/^(?:0x)?[0-9A-F]+$/iu).test(trim)) {
        return ParserNumber(trim);
    }

    if ((/^%\s[x0-9A-F\s+]+$/iu).test(trim)) {
        // just number +
        const arr: string[] = trim
            .replace(/^\s*%\s/u, '')
            .split('+')
            .map((s: string): string => s.trim());

        let j = 0;
        for (const s2 of arr) {
            j += ParserNumber(s2);
        }
        return j;
    }

    if ((/^%\S+%$/u).test(trim.trim())) {
        return Number.NaN;
    }
    if ((/^%\s+/u).test(trim.trim())) {
        return -1;
    }
    return Number.NaN;
}

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
    const magicNumberRaw: number = tryParserAddNumber(RawNameNew);

    const len: number = RawNameNew.length;

    let magicNumber: number = magicNumberRaw;
    const need: string[] = [
        '```ahk\nMsgBox, Options\n```',
        '[read doc](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Options)',
        '',
        '---',
    ];

    if (Number.isNaN(magicNumberRaw)) {
        need.push('\n\n---', $t('MsgBox.Param.isNaN'), '\n');
        return {
            need,
            lPos,
            len,
        };
    }

    if (magicNumberRaw === -1) {
        need.push('\n\n---', 'unknown', '\n');
        return {
            need,
            lPos,
            len,
        };
    }

    for (const [msg, Decimal, Hex_Value, Group] of MsgBoxData) {
        if (magicNumber < Decimal) continue;

        need.push(Group, '');

        if (magicNumber >= Decimal) {
            magicNumber -= Decimal;
            need.push(msg, '```ahk', `${Decimal} == ${Hex_Value}`, '```');
            if (magicNumber === 0) {
                return {
                    need,
                    lPos,
                    len,
                };
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
