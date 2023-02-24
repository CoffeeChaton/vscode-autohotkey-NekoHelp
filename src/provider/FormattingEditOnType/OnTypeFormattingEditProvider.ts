import * as vscode from 'vscode';
import { EFormatChannel } from '../../globalEnum';
import { FormatCore } from '../Format/FormatProvider';
import type { TFmtCore, TFmtCoreMap } from '../Format/FormatType';

export const OnTypeFormattingEditProvider: vscode.OnTypeFormattingEditProvider = {
    provideOnTypeFormattingEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        ch: string,
        options: vscode.FormattingOptions,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        if (ch === '\n') {
            const map: TFmtCoreMap = FormatCore({
                document,
                options,
                fmtStart: position.line,
                fmtEnd: position.line - 1,
                from: EFormatChannel.byFormatOnType,
                needDiff: false,
            });

            const e: TFmtCore | undefined = map.get(position.line - 1);
            if (e === undefined) return [];
            const { oldText, newText, line } = e;
            if (oldText !== newText) {
                const endCharacter: number = Math.max(newText.length, oldText.length);
                const range = new vscode.Range(line, 0, line, endCharacter);
                return [new vscode.TextEdit(range, newText)];
            }
        }
        return [];
    },
};
