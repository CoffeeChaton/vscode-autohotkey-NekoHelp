import * as vscode from 'vscode';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import { getGuiFunc } from '../../tools/Command/GuiTools';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getMenuFunc } from '../../tools/Command/MenuTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import { getSortFunc } from '../../tools/Command/sotrTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import type { TLineFnCall } from '../Def/getFnRef';
import { fnRefTextRawReg } from '../Def/getFnRef';
import type { TSemanticTokensLeaf } from './tools';

function GuiFuncHighlight(AhkTokenLine: TAhkTokenLine, Tokens: TSemanticTokensLeaf[]): 0 | 1 {
    // Menu, MenuName, Add , MenuItemName, LabelOrSubmenu, Options
    // Menu, MenuName, Insert , MenuItemName, ItemToInsert, LabelOrSubmenu, Options
    const GuiDataList: readonly TScanData[] | null = getGuiFunc(AhkTokenLine, 0);
    if (GuiDataList === null || GuiDataList.length === 0) return 0;

    const { line } = AhkTokenLine;

    for (const { RawNameNew, lPos } of GuiDataList) {
        Tokens.push({
            range: new vscode.Range(
                new vscode.Position(line, lPos - 1),
                new vscode.Position(line, lPos),
            ),
            tokenType: 'keyword',
            tokenModifiers: [],
        }, {
            range: new vscode.Range(
                new vscode.Position(line, lPos),
                new vscode.Position(line, lPos + RawNameNew.length),
            ),
            tokenType: 'function',
            tokenModifiers: [],
        });
    }

    return 1;
}

function cmdFnHighlight(AhkTokenLine: TAhkTokenLine, Tokens: TSemanticTokensLeaf[]): 0 | 1 {
    // SetTimer , Label_or_fnName, PeriodOnOffDelete, Priority

    const Data: TScanData | null = getSetTimerWrap(AhkTokenLine)
        ?? getMenuFunc(AhkTokenLine)
        ?? getSortFunc(AhkTokenLine);
    if (Data === null) return 0;

    const { RawNameNew, lPos } = Data;

    const { line } = AhkTokenLine;
    Tokens.push({
        range: new vscode.Range(
            new vscode.Position(line, lPos),
            new vscode.Position(line, lPos + RawNameNew.length),
        ),
        tokenType: 'function',
        tokenModifiers: [],
    });
    return 1;
}

function HotkeyHighlight(AhkTokenLine: TAhkTokenLine, Tokens: TSemanticTokensLeaf[]): 0 | 1 {
    // Hotkey, KeyName , Label, Options
    const HotkeyData: TScanData | null = getHotkeyWrap(AhkTokenLine);
    if (HotkeyData === null) return 0;

    const { RawNameNew, lPos } = HotkeyData;

    const { line } = AhkTokenLine;
    Tokens.push({
        range: new vscode.Range(
            new vscode.Position(line, lPos),
            new vscode.Position(line, lPos + RawNameNew.length),
        ),
        tokenType: (/^(?:On|Off|Toggle|AltTab)$/iu).test(RawNameNew)
            ? 'keyword'
            : 'function', // label .... ahk.tmLanguage.json is user "entity.name.function.label.ahk"
        tokenModifiers: [],
        // On: The hotkey becomes enabled. No action is taken if the hotkey is already On.
        // Off: The hotkey becomes disabled. No action is taken if the hotkey is already Off.
        // Toggle: The hotkey is set to the opposite state (enabled or disabled).
        // AltTab (and others): These are special Alt-Tab hotkey actions that are described here.
        // WTF ... ahk is too many cases ...
    });
    return 1;
}

function regFnHighlight(AhkTokenLine: TAhkTokenLine, Tokens: TSemanticTokensLeaf[]): 0 | 1 {
    // I need to check San = =||
    const DataList: TLineFnCall[] = fnRefTextRawReg(AhkTokenLine);
    if (DataList.length === 0) return 0;

    for (const Data of DataList) {
        const { upName, col } = Data;

        const { line } = AhkTokenLine;
        Tokens.push(
            {
                range: new vscode.Range(
                    new vscode.Position(line, col - '(?C'.length), //
                    new vscode.Position(line, col),
                ),
                tokenType: 'keyword',
                tokenModifiers: [],
            },
            {
                range: new vscode.Range(
                    new vscode.Position(line, col),
                    new vscode.Position(line, col + upName.length),
                ),
                tokenType: 'function',
                tokenModifiers: [],
            },
            {
                range: new vscode.Range(
                    new vscode.Position(line, col + upName.length),
                    new vscode.Position(line, col + upName.length + ')'.length),
                ),
                tokenType: 'keyword',
                tokenModifiers: [],
            },
        );
    }
    return 1;
}

export function funcHighlight(DocStrMap: TTokenStream): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];

    type TFn = (AhkTokenLine: TAhkTokenLine, Tokens: TSemanticTokensLeaf[]) => 0 | 1;
    const fnList: TFn[] = [cmdFnHighlight, HotkeyHighlight, GuiFuncHighlight, regFnHighlight];

    for (const AhkTokenLine of DocStrMap) {
        for (const fn of fnList) {
            const result: 0 | 1 = fn(AhkTokenLine, Tokens);
            if (result === 1) break;
        }
    }

    return Tokens;
}
