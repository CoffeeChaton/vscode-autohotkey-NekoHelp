import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import type { TGui2ndParamEx } from '../../tools/Built-in/7_sub_command/GuiName/GuiName.tools';
import { getGuiParam } from '../../tools/Built-in/7_sub_command/GuiName/GuiName.tools';
import { CMemo } from '../../tools/CMemo';
import { findAllLabelAllMap } from '../../tools/labelsAll';
import { getFileAllFuncMap } from '../../tools/visitor/getFileAllFuncMap';

export const memoFileGuiRef = new CMemo<TAhkFileData, readonly TGui2ndParamEx[]>(
    (AhkFileData: TAhkFileData): readonly TGui2ndParamEx[] => {
        const arr: TGui2ndParamEx[] = [];
        for (const AhkTokenLine of AhkFileData.DocStrMap) {
            const g: TGui2ndParamEx | null = getGuiParam(AhkTokenLine);
            if (g !== null && g.GuiName !== null) {
                arr.push(g);
            }
        }
        return arr;
    },
);

export function findAllRefGuiNameStr(searchGuiUpName: string): vscode.Location[] {
    const arr: vscode.Location[] = [];
    const GuiEventList: readonly string[] = [
        'GuiClose',
        'GuiEscape',
        'GuiSize',
        'GuiContextMenu',
        'GuiDropFiles',
    ].map((s: string): string => `${searchGuiUpName}${s.toUpperCase()}`);

    for (const AhkFileData of pm.getDocMapValue()) {
        const { uri, AST } = AhkFileData;
        const allRef: readonly TGui2ndParamEx[] = memoFileGuiRef.up(AhkFileData);
        for (const { GuiName } of allRef) {
            if (GuiName?.wordUp === searchGuiUpName) {
                arr.push(new vscode.Location(uri, GuiName.range));
            }
        }

        // Label gui event
        for (const [k, LabelArr] of findAllLabelAllMap.up(AST)) {
            if (GuiEventList.includes(k)) {
                for (const AhkLabel of LabelArr) {
                    arr.push(new vscode.Location(uri, AhkLabel.range));
                }
            }
        }

        // func
        for (const [k, AhkFunc] of getFileAllFuncMap(AST)) {
            if (GuiEventList.includes(k)) {
                arr.push(new vscode.Location(uri, AhkFunc.selectionRange));
            }
        }
    }
    return arr;
}

function gotoGuiNameDefWithStr(
    searchGuiUpName: string,
    rawPosition: vscode.Position,
    rawUri: vscode.Uri,
): vscode.Location[] {
    const arr: vscode.Location[] = [];

    for (const AhkFileData of pm.getDocMapValue()) {
        const { uri } = AhkFileData;
        // form `Gui, GuiName:SubCmd`
        for (const ref of memoFileGuiRef.up(AhkFileData)) {
            if (ref.GuiName?.wordUp === searchGuiUpName) {
                const { range } = ref.GuiName;
                if (uri.fsPath === rawUri.fsPath && range.contains(rawPosition)) {
                    return [new vscode.Location(uri, range)]; // let it to call find all ref
                }

                arr.push(new vscode.Location(uri, range));
                break; // just need all-file first def
            }
        }
    }

    return arr;
}

export function gotoGuiNameDef(
    rawAhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
    rawUri: vscode.Uri,
    findAll: boolean,
): vscode.Location[] | null {
    const p: TGui2ndParamEx | null = getGuiParam(rawAhkTokenLine);
    if (p === null || p.GuiName === null || !p.GuiName.range.contains(position)) return null;

    return findAll
        ? findAllRefGuiNameStr(p.GuiName.wordUp)
        : gotoGuiNameDefWithStr(p.GuiName.wordUp, position, rawUri);
}
