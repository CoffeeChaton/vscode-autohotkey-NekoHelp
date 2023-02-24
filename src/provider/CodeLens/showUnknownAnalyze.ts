import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { log } from '../vscWindows/log';

export function showUnknownAnalyze(DA: CAhkFunc): void {
    const { textMap, uri, name } = DA;
    const { fsPath } = uri;

    const msgList: string[] = [
        '\n',
        ';---------------------------------------------',
        `;show Unknown text of ${name}()`,
    ];

    for (const TextMetaOut of textMap.values()) {
        msgList.push(TextMetaOut.keyRawName);
        for (const range of TextMetaOut.refRangeList) {
            const { line, character } = range.start;
            msgList.push(`    at line ${line + 1} ;${fsPath}:${line + 1}:${character + 1}`);
        }
    }
    msgList.push(';---------------------------------------------');
    log.info(msgList.join('\n'));
    log.show();
}
