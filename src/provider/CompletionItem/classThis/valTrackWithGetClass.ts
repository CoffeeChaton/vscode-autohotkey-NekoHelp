import type { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import type { TTokenStream } from '../../../globalEnum';
import type { TFullClassMap } from '../../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { ahkValDefRegex } from '../../../tools/regexTools';
import { ToUpCase } from '../../../tools/str/ToUpCase';

function valTrackMethodCore(
    ChapterArr: readonly string[],
    AhkTokenList: TTokenStream,
): string[] {
    const Head: string = ChapterArr[0];

    const reg: RegExp = ahkValDefRegex(Head);
    const classNameList: string[] = []; // value name
    for (const { lStr } of AhkTokenList) {
        const col: number = lStr.search(reg);
        if (col === -1) continue;
        const strPart: string = lStr
            .slice(col + Head.length, lStr.length)
            .replace(/^\s*:=\s*/u, '');

        const ahkNewClass: RegExpMatchArray | null = strPart.match(/^new[ \t]*([#$@\w\u{A1}-\u{FFFF}]+)/iu);
        if (ahkNewClass !== null) {
            classNameList.push(ahkNewClass[1]);
        }
    }

    return classNameList;
}

export function valTrackMethod(
    ChapterArr: readonly string[],
    AhkTokenList: TTokenStream,
    fullClassMap: TFullClassMap,
): readonly CAhkClass[] {
    const nameList: string[] = valTrackMethodCore(ChapterArr, AhkTokenList);

    const classList: CAhkClass[] = [];

    for (const name of nameList) {
        const c0: CAhkClass | undefined = fullClassMap.get(ToUpCase(name));
        if (c0 !== undefined) {
            classList.push(c0);
        }
    }

    return classList;
}
