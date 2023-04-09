import * as vscode from 'vscode';
import type { CAhkLabel } from '../../AhkSymbol/CAhkLine';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import { getGuiFunc } from '../../tools/Command/GuiTools';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getMenuFunc } from '../../tools/Command/MenuTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { findLabel } from '../../tools/labels';
import { ToUpCase } from '../../tools/str/ToUpCase';

function LabelRefHotkey(AhkTokenLine: TAhkTokenLine, wordUp: string): vscode.Range | null {
    const HotkeyData: TScanData | null = getHotkeyWrap(AhkTokenLine);
    if (HotkeyData === null) return null;

    const { RawNameNew, lPos } = HotkeyData;
    if (ToUpCase(RawNameNew) !== wordUp) return null;

    const { line } = AhkTokenLine;
    return new vscode.Range(
        new vscode.Position(line, lPos),
        new vscode.Position(line, lPos + RawNameNew.length),
    );
}

function LabelRefMenu(AhkTokenLine: TAhkTokenLine, wordUp: string): vscode.Range | null {
    const MenuData: TScanData | null = getMenuFunc(AhkTokenLine);
    if (MenuData === null) return null;

    const { RawNameNew, lPos } = MenuData;
    if (ToUpCase(RawNameNew) !== wordUp) return null;

    const { line } = AhkTokenLine;
    return new vscode.Range(
        new vscode.Position(line, lPos),
        new vscode.Position(line, lPos + RawNameNew.length),
    );
}

function LabelRefGui(AhkTokenLine: TAhkTokenLine, wordUp: string): vscode.Range | null {
    const GuiDataList: readonly TScanData[] | null = getGuiFunc(AhkTokenLine, 0);
    if (GuiDataList !== null) {
        for (const { RawNameNew, lPos } of GuiDataList) {
            if (ToUpCase(RawNameNew) === wordUp) {
                const { line } = AhkTokenLine;
                return new vscode.Range(
                    new vscode.Position(line, lPos),
                    new vscode.Position(line, lPos + RawNameNew.length),
                );
            }
        }
    }
    return null;
}

function LabelRefKeyWord(
    col: number,
    wordUp: string,
    AhkTokenLine: TAhkTokenLine,
    uri: vscode.Uri,
): never[] | [vscode.Location] {
    //
    const { lStr, line } = AhkTokenLine;

    const strF: string = lStr
        .slice(col)
        .trimStart()
        .replace(/,[ \t]*/u, '')
        .padStart(lStr.length);

    const ma: RegExpMatchArray | null = strF.match(/^\s*([#$@\w\u{A1}-\u{FFFF}]+)/u);
    if (ma === null) return [];

    const wordUp2: string = ToUpCase(ma[1]);
    if (wordUp2 !== wordUp) return [];

    const col2: number = strF.search(/\S/u);

    return [
        new vscode.Location(
            uri,
            new vscode.Range(
                new vscode.Position(line, col2),
                new vscode.Position(line, col2 + wordUp2.length),
            ),
        ),
    ];
}

function LabelRefKeyWordWrap(
    wordUp: string,
    AhkTokenLine: TAhkTokenLine,
    uri: vscode.Uri,
): never[] | [vscode.Location] {
    const {
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    const list: readonly string[] = ['GOTO', 'GOSUB', 'BREAK', 'CONTINUE', 'SETTIMER'];
    if (list.includes(fistWordUp)) {
        return LabelRefKeyWord(fistWordUpCol + fistWordUp.length, wordUp, AhkTokenLine, uri);
    }
    if (list.includes(SecondWordUp)) {
        return LabelRefKeyWord(SecondWordUpCol + SecondWordUp.length, wordUp, AhkTokenLine, uri);
    }
    return [];
}

function getLabelRef(wordUp: string): vscode.Location[] {
    // TODO for performance use keyword match replace regex!
    const List: vscode.Location[] = [];
    for (const { DocStrMap, uri } of pm.getDocMapValue()) {
        for (const AhkTokenLine of DocStrMap) {
            const { detail, lStr, line } = AhkTokenLine;
            if (detail.includes(EDetail.isLabelLine) && ToUpCase(lStr.trim()) === (`${wordUp}:`)) {
                List.push(
                    new vscode.Location(
                        uri,
                        new vscode.Range(
                            new vscode.Position(line, lStr.search(/\S/u)),
                            new vscode.Position(line, lStr.indexOf(':')),
                        ),
                    ),
                );
                continue;
            }
            const range: vscode.Range | null = LabelRefHotkey(AhkTokenLine, wordUp);
            if (range !== null) {
                List.push(new vscode.Location(uri, range));
                continue;
            }

            const menuRange: vscode.Range | null = LabelRefMenu(AhkTokenLine, wordUp);
            if (menuRange !== null) {
                List.push(new vscode.Location(uri, menuRange));
                continue;
            }

            const range2: vscode.Range | null = LabelRefGui(AhkTokenLine, wordUp);
            if (range2 !== null) {
                List.push(new vscode.Location(uri, range2));
                continue;
            }

            List.push(...LabelRefKeyWordWrap(wordUp, AhkTokenLine, uri));
        }
    }

    return List;
}

export function posAtLabelDef(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
    wordUp: string,
): vscode.Location[] | null {
    const { lStr } = AhkFileData.DocStrMap[position.line];

    if ((/^[#$@\w\u{A1}-\u{FFFF}]+:$/u).test(lStr.trim())) {
        return getLabelRef(wordUp);
    }
    return null;
}

function getDefWithLabelCore(wordUpCase: string): vscode.Location[] | null {
    const label: CAhkLabel | null = findLabel(wordUpCase);
    if (label === null) {
        return null;
    }
    const { range, uri } = label;
    const Location: vscode.Location = new vscode.Location(uri, range);
    return [Location];
}

/**
 * //TODO goto label
 *
 * ```ahk
 * GroupAdd, GroupName , WinTitle, WinText, Label, ExcludeTitle, ExcludeText
 *                                          ^
 * ;            ... The label is jumped to as though a Gosub had been used.
 * ```
 */
export function getDefWithLabel(
    AhkFileData: TAhkFileData,
    uri: vscode.Uri,
    position: vscode.Position,
    wordUpCase: string,
): vscode.Location[] | null {
    const { DocStrMap } = AhkFileData;

    const { line, character } = position;
    const AhkTokenLine: TAhkTokenLine = DocStrMap[line];
    const { lStr } = AhkTokenLine;
    const lStrFix: string = lStr.slice(0, Math.max(0, character));

    if ((/^[#$@\w\u{A1}-\u{FFFF}]+:$/u).test(lStr.trim())) {
        return [new vscode.Location(uri, position)]; // let auto call Ref
    }

    const {
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;
    const list: readonly string[] = ['GOTO', 'GOSUB', 'BREAK', 'CONTINUE', 'SETTIMER'];
    if (
        list.includes(fistWordUp)
        && character > fistWordUp.length + fistWordUpCol
        && (/[#$@\w\u{A1}-\u{FFFF}]*$/iu).test(lStrFix)
    ) return getDefWithLabelCore(wordUpCase);

    if (
        list.includes(SecondWordUp)
        && character > SecondWordUp.length + SecondWordUpCol
        && (/[#$@\w\u{A1}-\u{FFFF}]*$/iu).test(lStrFix)
    ) return getDefWithLabelCore(wordUpCase);

    const Data: TScanData | null = getHotkeyWrap(AhkTokenLine)
        ?? getMenuFunc(AhkTokenLine)
        ?? getSetTimerWrap(AhkTokenLine); // don't find `Sort`

    if (ToUpCase(Data?.RawNameNew ?? '') === wordUpCase) return getDefWithLabelCore(wordUpCase);

    const GuiDataList: readonly TScanData[] | null = getGuiFunc(AhkTokenLine, 0);
    if (GuiDataList !== null) {
        const wordUpCaseFix: string = wordUpCase.replace(/^g/iu, '');
        for (const { RawNameNew } of GuiDataList) {
            if (ToUpCase(RawNameNew) === wordUpCaseFix) {
                return getDefWithLabelCore(wordUpCaseFix);
            }
        }
    }

    return null;
}

// unknown...
// {_T("GroupAdd"), 1, 6, 6, NULL} // Group name, WinTitle, WinText, Label, exclude-title/text
// {_T("Menu"), 2, 6, 6, NULL}  // tray, add, name, label, options, future use
