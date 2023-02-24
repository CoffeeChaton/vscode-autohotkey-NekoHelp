import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../../globalEnum';
import { EDetail } from '../../../globalEnum';
import { Ahk2exeMdMap } from '../../../tools/Built-in/Ahk2exe.tools';

export function hoverAhk2exe(AhkTokenLine: TAhkTokenLine, position: vscode.Position): vscode.Hover | null {
    if (!AhkTokenLine.detail.includes(EDetail.inComment)) return null;

    const { lStr, textRaw } = AhkTokenLine;
    const lStrLen: number = lStr.length;
    const commentStr: string = textRaw.slice(lStrLen);
    const maAhk2exe: RegExpMatchArray | null = commentStr.match(/^;@ahk2exe-(\S+)/iu);
    if (maAhk2exe !== null) {
        const col = lStrLen + maAhk2exe[0].length;
        if (position.character > lStrLen && position.character < col) {
            const upKey = maAhk2exe[1].toUpperCase();
            const md: vscode.MarkdownString | undefined = Ahk2exeMdMap.get(upKey);
            if (md !== undefined) return new vscode.Hover(md);

            // if (%)
            // .log('maAhk2exe', maAhk2exe[0]);
            // .log('maAhk2exe', maAhk2exe[1]);
            // return new vscode.Hover(maAhk2exe[1]);
        }

        return null;
    }

    return null;
}
