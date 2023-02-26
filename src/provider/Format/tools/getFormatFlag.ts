import type { TTokenStream } from '../../../globalEnum';

export type TFormatFlag = Readonly<{
    readonly mainList: readonly boolean[],
    readonly betaList: readonly boolean[],
}>;

/**
 *   ```ahk
 * ;@ahk-neko-format-ignore-start
 * ;@ahk-neko-format-ignore-end
 * ;@ahk-neko-format-inline-spacing-ignore-start
 * ;@ahk-neko-format-inline-spacing-ignore-end
 * ```
 */
export function getFormatFlag(DocStrMap: TTokenStream): TFormatFlag {
    let main = true;
    let beta = true;

    const mainList: boolean[] = [];
    const betaList: boolean[] = [];
    for (const { textRaw } of DocStrMap) {
        const s: string = textRaw.trimStart();
        if (s.startsWith(';@ahk-neko-format-')) {
            if (s.startsWith(';@ahk-neko-format-ignore-start')) {
                main = false;
            } else if (s.startsWith(';@ahk-neko-format-ignore-end')) {
                main = true;
            } else if (s.startsWith(';@ahk-neko-format-inline-spacing-ignore-start')) {
                beta = false;
            } else if (s.startsWith(';@ahk-neko-format-inline-spacing-ignore-end')) {
                beta = true;
            }
        }
        mainList.push(main);
        betaList.push(beta);
    }

    return {
        mainList,
        betaList,
    };
}
