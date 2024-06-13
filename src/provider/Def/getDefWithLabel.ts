import * as vscode from 'vscode';
import type { CAhkLabel } from '../../AhkSymbol/CAhkLine';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import { CMemo } from '../../tools/CMemo';
import { getGroupAddData } from '../../tools/Command/GroupAddTools';
import { getGuiFunc } from '../../tools/Command/GuiTools';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getMenuFunc } from '../../tools/Command/MenuTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { findLabelAll } from '../../tools/labelsAll';
import { ToUpCase } from '../../tools/str/ToUpCase';

type TLabelRefMsg = {
    keyRawName: string,
    range: vscode.Range,
};

function LabelRef_Hotkey_Menu_or_GroupAdd(AhkTokenLine: TAhkTokenLine): TLabelRefMsg | null {
    const Data: TScanData | null = getMenuFunc(AhkTokenLine)
        ?? getHotkeyWrap(AhkTokenLine)
        ?? getGroupAddData(AhkTokenLine, true);
    if (Data === null) return null;

    const { RawNameNew, lPos } = Data;
    const { line } = AhkTokenLine;

    return {
        keyRawName: RawNameNew,
        range: new vscode.Range(
            new vscode.Position(line, lPos),
            new vscode.Position(line, lPos + RawNameNew.length),
        ),
    };
}

function LabelRefGui(AhkTokenLine: TAhkTokenLine): TLabelRefMsg[] {
    const { line } = AhkTokenLine;

    const list: TLabelRefMsg[] = [];
    const GuiDataList: readonly TScanData[] | null = getGuiFunc(AhkTokenLine, 0);
    if (GuiDataList !== null) {
        for (const { RawNameNew, lPos } of GuiDataList) {
            list.push({
                keyRawName: RawNameNew,
                range: new vscode.Range(
                    new vscode.Position(line, lPos),
                    new vscode.Position(line, lPos + RawNameNew.length),
                ),
            });
        }
    }
    return list;
}

function LabelRefKeyWord(
    col: number,
    AhkTokenLine: TAhkTokenLine,
    map: Map<string, TLabelRefMsg[]>,
): void {
    //
    const { lStr, line } = AhkTokenLine;

    const strF: string = lStr
        .slice(col)
        .trimStart()
        .replace(/,[ \t]*/u, '')
        .padStart(lStr.length);

    const ma: RegExpMatchArray | null = strF.match(/([#$@\w\u{A1}-\u{FFFF}]+)/u);
    if (ma === null) return;
    const i: number | undefined = ma.index;
    if (i === undefined) return;

    const keyRawName: string = ma[1];
    const upName: string = ToUpCase(keyRawName);
    const arr: TLabelRefMsg[] = map.get(upName) ?? [];
    arr.push({
        keyRawName,
        range: new vscode.Range(
            new vscode.Position(line, i),
            new vscode.Position(line, i + keyRawName.length),
        ),
    });
    map.set(upName, arr);
}

function LabelRefKeyWordWrap(
    AhkTokenLine: TAhkTokenLine,
    map: Map<string, TLabelRefMsg[]>,
): void {
    const {
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    const list: readonly string[] = ['GOTO', 'GOSUB', 'BREAK', 'CONTINUE', 'SETTIMER', 'ONEXIT'];
    if (list.includes(fistWordUp)) {
        LabelRefKeyWord(fistWordUpCol + fistWordUp.length, AhkTokenLine, map);
    } else if (list.includes(SecondWordUp)) {
        LabelRefKeyWord(SecondWordUpCol + SecondWordUp.length, AhkTokenLine, map);
    }
}

type TFileLabelRefMap = ReadonlyMap<string, readonly TLabelRefMsg[]>;
const getLabelRefCoreMemo = new CMemo<TAhkFileData, TFileLabelRefMap>((AhkFileData: TAhkFileData): TFileLabelRefMap => {
    const map = new Map<string, TLabelRefMsg[]>();
    const { DocStrMap } = AhkFileData;
    for (const AhkTokenLine of DocStrMap) {
        const { detail, lStr, line } = AhkTokenLine;
        if (detail.includes(EDetail.isLabelLine)) {
            const keyRawName: string = lStr
                .replace(/^[ \t]*\}?/u, '')
                .trim()
                .replace(':', '');
            const upName: string = ToUpCase(keyRawName);
            const arr: TLabelRefMsg[] = map.get(upName) ?? [];
            const col: number = lStr.indexOf(':');
            arr.push({
                keyRawName,
                range: new vscode.Range(
                    new vscode.Position(line, col - keyRawName.length),
                    new vscode.Position(line, col),
                ),
            });
            map.set(upName, arr);
            continue;
        }

        const msg1: TLabelRefMsg | null = LabelRef_Hotkey_Menu_or_GroupAdd(AhkTokenLine);
        if (msg1 !== null) {
            const { keyRawName, range } = msg1;
            const upName: string = ToUpCase(keyRawName);
            const arr: TLabelRefMsg[] = map.get(upName) ?? [];
            arr.push({
                keyRawName,
                range,
            });
            map.set(upName, arr);
            continue;
        }

        const msgList: TLabelRefMsg[] = LabelRefGui(AhkTokenLine);
        for (const msg of msgList) {
            const { keyRawName, range } = msg;
            const upName: string = ToUpCase(keyRawName);
            const arr: TLabelRefMsg[] = map.get(upName) ?? [];
            arr.push({
                keyRawName,
                range,
            });
            map.set(upName, arr);
        }

        LabelRefKeyWordWrap(AhkTokenLine, map);
    }

    return map;
});

export function getLabelRef(wordUp: string): vscode.Location[] {
    const List: vscode.Location[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const msgList: readonly TLabelRefMsg[] | undefined = getLabelRefCoreMemo.up(AhkFileData).get(wordUp);
        if (msgList === undefined) continue;

        const { uri } = AhkFileData;
        for (const { range } of msgList) {
            List.push(new vscode.Location(uri, range));
        }
    }

    return List;
}

export function posAtLabelDef(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
    wordUp: string,
): vscode.Location[] | null {
    const { detail } = AhkFileData.DocStrMap[position.line];
    return detail.includes(EDetail.isLabelLine)
        ? getLabelRef(wordUp)
        : null;
}

export function getDefWithLabel(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
    wordUpCase: string,
): readonly CAhkLabel[] | null {
    const { DocStrMap } = AhkFileData;

    const { line, character } = position;
    const AhkTokenLine: TAhkTokenLine = DocStrMap[line];
    const { lStr, detail } = AhkTokenLine;
    const lStrFix: string = lStr.slice(0, Math.max(0, character));

    if (
        detail.includes(EDetail.isLabelLine)
        && (/^[#$@\w\u{A1}-\u{FFFF}]+:$/u).test(lStr.replace(/^[ \t]*\}?/u, '').trim())
    ) {
        return findLabelAll(wordUpCase);
    }

    const {
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;
    const list: readonly string[] = ['GOTO', 'GOSUB', 'BREAK', 'CONTINUE', 'SETTIMER', 'ONEXIT'];
    if (
        list.includes(fistWordUp)
        && character > fistWordUp.length + fistWordUpCol
        && (/[#$@\w\u{A1}-\u{FFFF}]*$/iu).test(lStrFix)
    ) return findLabelAll(wordUpCase);

    if (
        list.includes(SecondWordUp)
        && character > SecondWordUp.length + SecondWordUpCol
        && (/[#$@\w\u{A1}-\u{FFFF}]*$/iu).test(lStrFix)
    ) return findLabelAll(wordUpCase);

    const Data: TScanData | null = getHotkeyWrap(AhkTokenLine)
        ?? getMenuFunc(AhkTokenLine)
        ?? getSetTimerWrap(AhkTokenLine)
        ?? getGroupAddData(AhkTokenLine, true); // don't find `Sort`

    if (ToUpCase(Data?.RawNameNew ?? '') === wordUpCase) return findLabelAll(wordUpCase);

    const GuiDataList: readonly TScanData[] | null = getGuiFunc(AhkTokenLine, 0);
    if (GuiDataList !== null) {
        const wordUpCaseFix: string = wordUpCase.replace(/^g/iu, '');
        for (const { RawNameNew } of GuiDataList) {
            if (ToUpCase(RawNameNew) === wordUpCaseFix) {
                return findLabelAll(wordUpCaseFix);
            }
        }
    }

    return null;
}

export function getDefWithLabelWrap(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
    wordUpCase: string,
): vscode.Location[] | null {
    const list: readonly CAhkLabel[] | null = getDefWithLabel(
        AhkFileData,
        position,
        wordUpCase,
    );
    if (list === null || list.length === 0) return null;
    return list.map((l: CAhkLabel): vscode.Location => new vscode.Location(l.uri, l.selectionRange));
}
// unknown...
// {_T("GroupAdd"), 1, 6, 6, NULL} // Group name, WinTitle, WinText, Label, exclude-title/text
// {_T("Menu"), 2, 6, 6, NULL}  // tray, add, name, label, options, future use
