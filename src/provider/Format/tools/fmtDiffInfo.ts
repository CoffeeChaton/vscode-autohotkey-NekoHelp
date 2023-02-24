import * as path from 'node:path';
import { EVersion } from '../../../Enum/EVersion';
import type { EFormatChannel } from '../../../globalEnum';
import { fmtLog } from '../../vscWindows/log';
import type { TFmtCore } from '../FormatType';

type TDiffParm = {
    newFmtMap: Map<number, TFmtCore>,
    fsPath: string,
    timeStart: number,
    from: EFormatChannel,
};

export function fmtDiffInfo(
    {
        newFmtMap,
        fsPath,
        timeStart,
        from,
    }: TDiffParm,
): void {
    const msg: string[] = [];

    for (const [line, { hasOperatorFormat, oldText, newText }] of newFmtMap) {
        if (hasOperatorFormat) {
            msg.push(
                `line : ${line}`,
                oldText,
                newText,
            );
        }
    }

    if (msg.length > 0) {
        fmtLog.info([
            '\n',
            '-----------Format Diff Start--------------------------------',
            `${from} ${EVersion.formatRange} "${path.basename(fsPath)}", ${Date.now() - timeStart} ms`,
            ...msg,
            '-----------Format Diff End----------------------------------',
        ].join('\n'));
        // do not callDiff(diffVar);
    }

    // using setTimeout call.
}
