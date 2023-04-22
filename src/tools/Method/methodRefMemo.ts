import type { TAhkTokenLine } from '../../globalEnum';
import { getObjChapterArr } from '../Obj/getObjChapterArr';
import type { TMethodRef } from './fileMethodRef';

const methodRefMemoN2 = new WeakMap<TMethodRef, readonly string[] | null>();
export function methodRefMemo(
    ref: TMethodRef,
    AhkTokenLine: TAhkTokenLine,
): readonly string[] | null {
    const cache: readonly string[] | null | undefined = methodRefMemoN2.get(ref);

    if (cache !== undefined) {
        return cache;
    }

    const position = ref.range.start;
    const { textRaw } = AhkTokenLine;
    const _chapterArr: readonly string[] | null = getObjChapterArr(textRaw, position.character);
    if (_chapterArr === null) {
        methodRefMemoN2.set(ref, null);
        return null;
    }
    const ChapterArrFull: readonly string[] = [..._chapterArr, ref.upName];
    //
    methodRefMemoN2.set(ref, ChapterArrFull);
    return ChapterArrFull;
}
