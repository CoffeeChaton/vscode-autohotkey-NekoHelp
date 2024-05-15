import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { GuiMDMap } from '../../../tools/Built-in/7_sub_command/Gui/Gui.tools';
import { CMemo } from '../../../tools/CMemo';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { ToUpCase } from '../../../tools/str/ToUpCase';

const GuiNameMd: vscode.MarkdownString = new vscode.MarkdownString(
    'hover at [GuiName](https://www.autohotkey.com/docs/v1/lib/Gui.htm#New)',
    true,
);

const unknownGuiSubCmdMd: vscode.MarkdownString = new vscode.MarkdownString(
    'Unknown Gui [Sub-commands](https://www.autohotkey.com/docs/v1/lib/Gui.htm#SubCommands)',
    true,
);

type TGuiName = {
    wordUp: string,
    md: vscode.MarkdownString,
    range: vscode.Range,
} | null;

type TSubCmd = {
    wordUp: string,
    md: vscode.MarkdownString,
    range: vscode.Range,
};

export type TGui2ndParamEx = {
    GuiName: TGuiName,
    SubCmd: TSubCmd,
};

function getGuiParam2ndData(lStr: string, col: number, line: number): TGui2ndParamEx | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*GUI\b\s*,?\s*/iu, 'GUI,')
        .padStart(lStr.length, ' ')
        .replace(/\[.*/u, '');
    //  .padEnd(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // Gui, New , Options, Title
    // a0   a1    a2

    const atA1: TScanData | undefined = arr.at(1);
    if (atA1 === undefined) return null;
    const { lPos, RawNameNew } = atA1;

    /**
     * Gui, New
     * Gui, GuiName:New
     */
    const GuiNameCol: number = RawNameNew.indexOf(':');

    const GuiName: TGuiName = GuiNameCol > -1
        ? {
            wordUp: ToUpCase(RawNameNew.replace(/:.*/u, '').trim()),
            md: GuiNameMd,
            range: new vscode.Range(
                new vscode.Position(line, lPos),
                new vscode.Position(line, lPos + GuiNameCol),
            ),
        }
        : null;

    const word: string = RawNameNew
        .replace(/.*:/u, '')
        .trim();

    const wordUp: string = word.toUpperCase();
    const pos2: number = lPos + RawNameNew.lastIndexOf(word);

    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, pos2),
        new vscode.Position(line, pos2 + wordUp.length),
    );

    // add... etc
    const md: vscode.MarkdownString | undefined = GuiMDMap.get(wordUp.trim().toUpperCase());
    if (md !== undefined) {
        const SubCmd: TSubCmd = {
            wordUp,
            md,
            range,
        };
        return {
            GuiName,
            SubCmd,
        };
    }

    // Options
    if (RawNameNew.includes('+') || RawNameNew.includes('-')) {
        const mdOpt: vscode.MarkdownString | undefined = GuiMDMap.get('Options'.toUpperCase());
        if (mdOpt !== undefined) {
            const SubCmd: TSubCmd = {
                wordUp: 'Options'.toUpperCase(),
                md: mdOpt,
                range,
            };
            return {
                GuiName,
                SubCmd,
            };
        }
    }

    // unknown
    return {
        GuiName,
        SubCmd: {
            wordUp,
            md: unknownGuiSubCmdMd,
            range,
        },
    };
}

const memoGuiParam = new CMemo<TAhkTokenLine, TGui2ndParamEx | null>(
    (AhkTokenLine: TAhkTokenLine): TGui2ndParamEx | null => {
        const { fistWordUp, line } = AhkTokenLine;
        if (fistWordUp === 'GUI') {
            const { lStr, fistWordUpCol } = AhkTokenLine;
            return getGuiParam2ndData(lStr, fistWordUpCol, line);
        }

        const { SecondWordUp } = AhkTokenLine;
        if (SecondWordUp === 'GUI') {
            const { SecondWordUpCol, lStr } = AhkTokenLine;
            return getGuiParam2ndData(lStr, SecondWordUpCol, line);
        }

        return null;
    },
);

export function getGuiParam(AhkTokenLine: TAhkTokenLine): TGui2ndParamEx | null {
    return memoGuiParam.up(AhkTokenLine);
}

export function hoverGuiParam(AhkTokenLine: TAhkTokenLine, position: vscode.Position): vscode.MarkdownString | null {
    const param: TGui2ndParamEx | null = getGuiParam(AhkTokenLine);
    if (param === null) return null;

    const { GuiName, SubCmd } = param;
    if (SubCmd.range.contains(position)) return SubCmd.md;
    if (GuiName === null) return null;
    if (GuiName.range.contains(position)) return GuiName.md;
    return null;
}
