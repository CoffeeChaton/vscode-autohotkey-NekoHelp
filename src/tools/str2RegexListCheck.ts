import { log } from '../provider/vscWindows/log';
import { CMemo } from './CMemo';

const RegexMemo = new CMemo<readonly string[], readonly RegExp[]>((strList: readonly string[]): readonly RegExp[] => {
    // "/\\.",
    // "/node_modules$",
    // "/ahk_lib$",
    // "/ahk_log$",
    // "/ahk_music$",
    // "/IMG$"
    // "/Gdip_.*\\.ahk$",
    let errRuler = '';
    const regexList: RegExp[] = [];
    try {
        for (const str of strList) {
            errRuler = str;
            // eslint-disable-next-line security/detect-non-literal-regexp
            const re = new RegExp(str, 'u');
            regexList.push(re);
        }
    } catch (error: unknown) {
        let message = 'Unknown Error';
        if (error instanceof Error) {
            message = error.message;
            log.error(error, 'AhkNekoHelp.baseScan.IgnoredList');
        }

        const msgList: string[] = [
            ';AhkNekoHelp.baseScan.IgnoredList Error Start------------',
            '"settings.json" -> "AhkNekoHelp.baseScan.IgnoredList"',
        ];
        for (const [i, str] of strList.entries()) {
            msgList.push(
                i < regexList.length
                    ? `OK -> "${str}"`
                    : `NG -> "${str}"`,
            );
        }
        msgList.push(
            `has error of this regex: "${errRuler}"`,
            message,
            ';AhkNekoHelp.baseScan.IgnoredList Error End--------------',
        );

        log.error(msgList.join('\n'));
        log.show();
    }
    return regexList;
});

export function str2RegexListCheck(strList: readonly string[]): readonly RegExp[] {
    return RegexMemo.up(strList);
}
