export type TFmtCore = {
    line: number,
    oldText: string,
    newText: string,
    hasOperatorFormat: boolean,
};

export type TFmtCoreMap = ReadonlyMap<number, TFmtCore>;
