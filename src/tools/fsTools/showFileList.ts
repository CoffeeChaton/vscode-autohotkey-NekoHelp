/* eslint-disable @fluffyfox/string/no-simple-template-literal */
export type TShowFileParam = {
    fsPath: string,
    ms: number,
};

export function showFileList(list: TShowFileParam[]): string {
    const listLen: number = `${list.length}`.length;
    const maxMs: number = Math.max(...list.map((v: TShowFileParam): number => v.ms));
    const msLen: number = `${maxMs}`.length;

    return [
        '[',
        '    ["index", "ms", "source"],',
        ...list
            .map(({ fsPath, ms }: TShowFileParam, i: number): string => {
                const pardStart: string = `${i + 1}`.padStart(listLen);
                const msPard: string = `${ms}`.padStart(msLen);

                return `    [${pardStart}, ${msPard}, "${fsPath}"],`;
            }),
        ']',
    ].join('\n');
}
