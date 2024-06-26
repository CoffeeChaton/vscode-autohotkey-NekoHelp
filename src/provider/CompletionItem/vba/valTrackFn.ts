import type { TApiMeta } from '../../../../script/make_vba_json';
import type { TTokenStream } from '../../../globalEnum';
import { ahkValDefRegex } from '../../../tools/regexTools';
import { getVbaData } from './getVbaData';
import type { TVba2Map } from './type';
import { vbaApiFileMap } from './vbaApiFileMap';
import { vbaCompletion } from './vbaCompletion';

function valTrackFnCore(
    ChapterArr: readonly string[],
    AhkTokenList: TTokenStream,
): string[] {
    const Head: string = ChapterArr[0];

    const reg: RegExp = ahkValDefRegex(Head);
    const classNameList: string[] = []; // value name
    for (const { lStr, textRaw } of AhkTokenList) {
        const col: number = lStr.search(reg);
        if (col === -1) continue;

        const strPart2: string = textRaw
            .slice(col + Head.length, textRaw.length)
            .replace(/^\s*:=\s*/u, '');

        const name0: string | undefined = strPart2.match(/^ComObjActive\("([\w.]+)"\)/iu)?.[1]; //  ComObjActive;
        if (name0 !== undefined) classNameList.push(name0);
    }

    return classNameList;
}

export type TVbaDataLast = {
    filePath: string,
    Vba2Map: TVba2Map,
    api_list: TApiMeta[],
};

export function valTrackAllowFnCall(
    ChapterArr: readonly string[],
    AhkTokenList: TTokenStream,
): TVbaDataLast | null {
    const nameList: string[] = valTrackFnCore(ChapterArr, AhkTokenList);

    for (const name of nameList) {
        const fileUpName: string = name.replace(/\..*/u, '').toUpperCase();
        const filePath: string | undefined = vbaApiFileMap.get(fileUpName);
        if (filePath !== undefined) {
            const api_list_F2: TApiMeta[][] = vbaCompletion(filePath, name.toUpperCase(), ChapterArr);
            const Vba2Map: TVba2Map = getVbaData(filePath);
            const last: TApiMeta[] = api_list_F2.at(-1) ?? [];
            // itemS.push(...vbaCompletionDeep1(last, Vba2Map));
            return {
                filePath,
                Vba2Map,
                api_list: last,
            };
        }
    }
    return null;
}
