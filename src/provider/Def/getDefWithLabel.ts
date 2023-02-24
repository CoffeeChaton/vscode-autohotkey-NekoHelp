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

function LabelRefHotkey(AhkTokenLine: TAhkTokenLine, wordUp: string): vscode.Range | null {
    const HotkeyData: TScanData | null = getHotkeyWrap(AhkTokenLine);
    if (HotkeyData === null) return null;

    const { RawNameNew, lPos } = HotkeyData;
    if (RawNameNew.toUpperCase() !== wordUp) return null;

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
    if (RawNameNew.toUpperCase() !== wordUp) return null;

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
            if (RawNameNew.toUpperCase() === wordUp) {
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

function getLabelRef(wordUp: string): vscode.Location[] {
    // TODO for performance use keyword match replace regex!
    // eslint-disable-next-line security/detect-non-literal-regexp
    const reg = new RegExp(`(\\b(?:goto|goSub|Break|Continue|SetTimer)\\b\\s*,?\\s*)\\b${wordUp}\\b`, 'iu');

    const List: vscode.Location[] = [];
    for (const { DocStrMap, uri } of pm.getDocMapValue()) {
        for (const AhkTokenLine of DocStrMap) {
            const { detail, lStr, line } = AhkTokenLine;
            if (detail.includes(EDetail.isLabelLine) && lStr.trim().toUpperCase() === (`${wordUp}:`)) {
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

            const ma: RegExpMatchArray | null = lStr.match(reg);
            if (ma === null) continue;
            const { index } = ma;
            if (index === undefined) continue;
            const col: number = ma[1].length + index;

            List.push(
                new vscode.Location(
                    uri,
                    new vscode.Range(
                        new vscode.Position(line, col),
                        new vscode.Position(line, col + wordUp.length),
                    ),
                ),
            );
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

    if ((/^\w+:$/u).test(lStr.trim())) {
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

    const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];
    const { lStr } = AhkTokenLine;
    const lStrFix: string = lStr.slice(0, Math.max(0, position.character));

    if ((/^\w+:$/u).test(lStr.trim())) {
        return [new vscode.Location(uri, position)]; // let auto call Ref
    }

    if ((/\b(?:goto|goSub|Break|Continue|OnExit)[\s,]+\w*$/iu).test(lStrFix)) {
        // OnExit , Label
        return getDefWithLabelCore(wordUpCase);
    }

    const Data: TScanData | null = getHotkeyWrap(AhkTokenLine)
        ?? getMenuFunc(AhkTokenLine)
        ?? getSetTimerWrap(AhkTokenLine); // don't find `Sort`

    if (Data?.RawNameNew.toUpperCase() === wordUpCase) return getDefWithLabelCore(wordUpCase);

    const GuiDataList: readonly TScanData[] | null = getGuiFunc(AhkTokenLine, 0);
    if (GuiDataList !== null) {
        const wordUpCaseFix: string = wordUpCase.replace(/^g/iu, '');
        for (const { RawNameNew } of GuiDataList) {
            if (RawNameNew.toUpperCase() === wordUpCaseFix) {
                return getDefWithLabelCore(wordUpCaseFix);
            }
        }
    }

    return null;
}

// unknown...
// {_T("GroupAdd"), 1, 6, 6, NULL} // Group name, WinTitle, WinText, Label, exclude-title/text
// {_T("Menu"), 2, 6, 6, NULL}  // tray, add, name, label, options, future use
