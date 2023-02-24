export function getObjChapterArr(textRaw: string, character: number): readonly string[] | null {
    if (character === 0) return null;

    const ma: RegExpMatchArray | null = textRaw
        .slice(0, character)
        .match(/([\w.]+)$/u); // not supported className["foo"]

    if (ma === null) return null;

    const ChapterList: string[] = ma[1].split('.');
    ChapterList.pop();

    if (ChapterList.length === 0) return null;

    return (/^\d+$/u).test(ChapterList[0]) // ex: 0.5
        ? null
        : ChapterList;
}
