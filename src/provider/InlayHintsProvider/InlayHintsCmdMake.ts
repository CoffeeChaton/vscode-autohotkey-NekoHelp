import * as vscode from 'vscode';
import { type TCmdMsg } from '../../tools/Built-in/6_command/Command.tools';
import { CMemo } from '../../tools/CMemo';

const memoInlayHintsCmdMake = new CMemo<TCmdMsg, readonly vscode.InlayHintLabelPart[]>(
    (meta: TCmdMsg): readonly vscode.InlayHintLabelPart[] => {
        const need: vscode.InlayHintLabelPart[] = [];

        const { link, _param, cmdSignLabel } = meta;
        for (const { name, paramDoc } of _param) {
            const col: number = cmdSignLabel.indexOf(name) ?? 0;
            const space: string = ' '.repeat(col - 1);
            const repeat: string = '^'.repeat(name.length);
            const arr: string[] = [
                '```ahk',
                cmdSignLabel,
                `;${space}${repeat}`,
                '```',
                '---',
                `[(ReadDoc)](${link})`,
                '',
                ...paramDoc,
            ];
            const tooltip: vscode.MarkdownString = new vscode.MarkdownString(arr.join('\n'));
            const d = new vscode.InlayHintLabelPart(`${name}:`);
            d.tooltip = tooltip;
            need.push(d);
        }

        return need;
    },
);

export function InlayHintsCmdMake(meta: TCmdMsg): readonly vscode.InlayHintLabelPart[] {
    return memoInlayHintsCmdMake.up(meta);
}
