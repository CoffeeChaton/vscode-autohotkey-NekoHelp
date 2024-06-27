/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../../globalEnum';
import { CMemo } from '../../../CMemo';
import type { TScanData } from '../../../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../DeepAnalysis/FnVar/def/spiltCommandAll';
import { ToUpCase } from '../../../str/ToUpCase';
import { Gui_MDMap } from '../Gui/Gui.tools';
import { GuiControl_MDMap } from '../GuiControl/GuiControl.tools';

const GuiNameMd: vscode.MarkdownString = new vscode.MarkdownString(
    'hover at [GuiName](https://www.autohotkey.com/docs/v1/lib/Gui.htm#MultiWin)',
    true,
);

const unknownGuiSubCmdMd: vscode.MarkdownString = new vscode.MarkdownString(
    'Unknown Gui [Sub-commands](https://www.autohotkey.com/docs/v1/lib/Gui.htm#SubCommands)',
    true,
);

type TGuiName = {
    rawName: string,
    wordUp: string,
    md: vscode.MarkdownString,
    range: vscode.Range,
};

type TSubCmd = {
    wordUp: string,
    md: vscode.MarkdownString,
    range: vscode.Range,
};

export type TGui2ndParamEx = {
    GuiName: TGuiName | null,
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

    const rawName: string = GuiNameCol > -1
        ? RawNameNew.replace(/:.*/u, '').trim()
        : '';
    const GuiNameWordUp: string = ToUpCase(rawName);

    const GuiName: TGuiName | null = GuiNameWordUp !== '' && !GuiNameWordUp.includes('%')
        ? {
            rawName,
            wordUp: GuiNameWordUp,
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
    const md: vscode.MarkdownString | undefined = Gui_MDMap.get(wordUp.trim().toUpperCase());
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
        const mdOpt: vscode.MarkdownString | undefined = Gui_MDMap.get('Options'.toUpperCase());
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

function getGuiControlParam2ndData(lStr: string, col: number, line: number): TGui2ndParamEx | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*GuiControl\b\s*,?\s*/iu, 'GuiControl,')
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

    const rawName: string = GuiNameCol > -1
        ? RawNameNew.replace(/:.*/u, '').trim()
        : '';
    const GuiNameWordUp: string = ToUpCase(rawName);

    const GuiName: TGuiName | null = GuiNameWordUp !== '' && !GuiNameWordUp.includes('%')
        ? {
            rawName,
            wordUp: GuiNameWordUp,
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
    const md: vscode.MarkdownString | undefined = GuiControl_MDMap.get(wordUp.trim().toUpperCase());
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

    if (wordUp === '') {
        const md2: vscode.MarkdownString | undefined = GuiControl_MDMap.get('(Blank)'.trim().toUpperCase());
        if (md2 !== undefined) {
            const SubCmd: TSubCmd = {
                wordUp,
                md: md2,
                range,
            };
            return {
                GuiName,
                SubCmd,
            };
        }
    }

    // Options
    if (RawNameNew.includes('+') || RawNameNew.includes('-')) {
        const mdOpt: vscode.MarkdownString | undefined = Gui_MDMap.get('(options)'.toUpperCase());
        if (mdOpt !== undefined) {
            const SubCmd: TSubCmd = {
                wordUp: '(options)'.toUpperCase(),
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
        const {
            fistWordUp,
            line,
            lStr,
            fistWordUpCol,
            SecondWordUpCol,
            SecondWordUp,
        } = AhkTokenLine;

        if (fistWordUp === '') return null;
        if (fistWordUp === 'GUI') return getGuiParam2ndData(lStr, fistWordUpCol, line);
        if (SecondWordUp === 'GUI') return getGuiParam2ndData(lStr, SecondWordUpCol, line);

        if (fistWordUp === 'GUICONTROL') return getGuiControlParam2ndData(lStr, fistWordUpCol, line);
        if (SecondWordUp === 'GUICONTROL') return getGuiControlParam2ndData(lStr, SecondWordUpCol, line);

        return null;
    },
);

export function getGuiParam(AhkTokenLine: TAhkTokenLine): TGui2ndParamEx | null {
    return memoGuiParam.up(AhkTokenLine);
}
