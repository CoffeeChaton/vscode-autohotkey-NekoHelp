import * as vscode from 'vscode';
import { pm, type TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { CMemo } from '../../../tools/CMemo';
import { getGroupAddData } from '../../../tools/Command/GroupAddTools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { makeMarkDownLinkPos } from '../../../tools/MD/msgWithPos';
import { ToUpCase } from '../../../tools/str/ToUpCase';

const memoAhkGroup = new CMemo(
    (AhkFileData: TAhkFileData): readonly vscode.CompletionItem[] => {
        const need: vscode.CompletionItem[] = [];
        const set = new Set<string>();

        const { DocStrMap, uri } = AhkFileData;
        for (const AhkTokenLine of DocStrMap) {
            const scanData: TScanData | null = getGroupAddData(AhkTokenLine, false);
            if (scanData === null) continue;
            const { RawNameNew, lPos } = scanData;
            const upName: string = ToUpCase(RawNameNew);
            if (set.has(upName)) continue;

            const item = new vscode.CompletionItem(
                { label: RawNameNew, description: 'ahk_group' },
                vscode.CompletionItemKind.Text,
            );
            item.detail = 'by-neko-help';
            item.documentation = new vscode.MarkdownString(
                `from <${makeMarkDownLinkPos(uri.fsPath, AhkTokenLine.line, lPos)}>`,
            );
            item.documentation.appendCodeblock(`GroupAdd, ${RawNameNew}`, 'ahk');

            need.push(item);
            set.add(upName);
        }

        return need;
    },
);

export function ahk_group_completion(
    AhkTokenLine: TAhkTokenLine,
    position: vscode.Position,
): vscode.CompletionItem[] | null {
    const {
        textRaw,
    } = AhkTokenLine;

    const subStr: string = textRaw.slice(0, position.character).trim();
    if (
        (/\bahk_group[ \t]+\S*$/iu).test(subStr)
        || (/\b(?:GroupAdd|GroupActivate|GroupClose|GroupDeactivate)\b\s*(?:,\s*)?\S*$/iu).test(subStr)
    ) {
        const need: vscode.CompletionItem[] = [];

        for (const AhkFileData of pm.getDocMapValue()) {
            need.push(...memoAhkGroup.up(AhkFileData));
        }

        if (need.length === 0) return null;
        return need;
    }
    return null;
}
