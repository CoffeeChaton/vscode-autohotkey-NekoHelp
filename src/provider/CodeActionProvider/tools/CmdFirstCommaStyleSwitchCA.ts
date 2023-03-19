/* eslint-disable sonarjs/no-duplicate-string */
import * as vscode from 'vscode';
import { ECommand } from '../../../command/ECommand';
import type { CmdFirstCommaStyleSwitch } from '../../../command/tools/CmdFirstCommaStyleSwitch';
import type { TAhkFileData } from '../../../core/ProjectManager';
import { CommandMDMap } from '../../../tools/Built-in/Command.tools';

function setFmtCmdFirstCommaCA(
    AhkFileData: TAhkFileData,
    selection: vscode.Selection,
): [vscode.CodeAction] {
    const CA1 = new vscode.CodeAction('[fmt] add/Remove the first optional comma of command');
    CA1.command = {
        title: '[fmt] add/Remove the first optional comma of command',
        command: ECommand.CmdFirstCommaStyleSwitch,
        tooltip: 'by neko-help (beta)',
        arguments: [
            AhkFileData,
            selection,
        ] satisfies Parameters<typeof CmdFirstCommaStyleSwitch>,
    };
    return [CA1];
}
export function CmdFirstCommaStyleSwitchCA(
    AhkFileData: TAhkFileData,
    selection: vscode.Selection,
    // document: vscode.TextDocument,
): never[] | [vscode.CodeAction] {
    // https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/7
    // part 3-2
    const { DocStrMap } = AhkFileData;
    const { start, end } = selection;
    const s: number = start.line;
    const e: number = end.line;
    if (s === e) {
        const {
            fistWordUp,
            fistWordUpCol,
            SecondWordUp,
            SecondWordUpCol,
            lStr,
        } = DocStrMap[s];
        if (fistWordUp === '') return [];

        const a: number = start.character;
        const b: number = end.character;

        if (
            CommandMDMap.has(fistWordUp)
            && fistWordUpCol >= a && fistWordUpCol <= b
            && lStr.trimEnd().length !== fistWordUp.length + fistWordUpCol
        ) {
            return setFmtCmdFirstCommaCA(AhkFileData, selection);
        }

        if (
            CommandMDMap.has(SecondWordUp)
            && SecondWordUpCol >= a && SecondWordUpCol <= b
            && lStr.trimEnd().length !== SecondWordUp.length + SecondWordUpCol
        ) {
            return setFmtCmdFirstCommaCA(AhkFileData, selection);
        }
        return [];
    }

    for (let i = s; i <= e; i++) {
        const {
            fistWordUp,
            fistWordUpCol,
            SecondWordUp,
            SecondWordUpCol,
            lStr,
        } = DocStrMap[i];
        if (fistWordUp === '') continue;

        if (CommandMDMap.has(fistWordUp)) {
            if (lStr.trimEnd().length !== fistWordUp.length + fistWordUpCol) {
                return setFmtCmdFirstCommaCA(AhkFileData, selection);
            }
        } else if (CommandMDMap.has(SecondWordUp) && lStr.trimEnd().length !== SecondWordUp.length + SecondWordUpCol) {
            return setFmtCmdFirstCommaCA(AhkFileData, selection);
        }
    }

    return [];
}
