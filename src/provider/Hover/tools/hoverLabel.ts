import * as vscode from 'vscode';
import type { CAhkLabel } from '../../../AhkSymbol/CAhkLine';
import type { TAhkFileData } from '../../../core/ProjectManager';
import { getDefWithLabel } from '../../Def/getDefWithLabel';

/** */
export function hoverLabel(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
    wordUp: string,
): vscode.MarkdownString | null {
    const list: readonly CAhkLabel[] | null = getDefWithLabel(
        AhkFileData,
        position,
        wordUp,
    );
    if (list === null) return null;

    const allMd = new vscode.MarkdownString('');

    const hoverAtLabelDef: CAhkLabel | undefined = list.find(
        (label: CAhkLabel): boolean => label.uri.fsPath === AhkFileData.uri.fsPath && label.range.contains(position),
    );
    if (hoverAtLabelDef?.GuiEvent !== undefined) {
        const { GuiName, EventName } = hoverAtLabelDef.GuiEvent;
        if (GuiName !== '') {
            allMd.appendMarkdown(
                `\`${GuiName.toLowerCase()}\` is [GuiName](https://www.autohotkey.com/docs/v1/lib/Gui.htm#New) \n\n`,
            );
        }
        allMd.appendMarkdown(
            `\`${EventName}\` is [Gui Window Events](https://www.autohotkey.com/docs/v1/lib/Gui.htm#Labels)\n***\n`,
        );
    }

    for (const label of list) {
        allMd
            .appendMarkdown(label.md.value)
            .appendMarkdown('\n***\n');
    }

    return allMd;
}
