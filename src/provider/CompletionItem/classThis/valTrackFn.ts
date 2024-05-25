import type * as vscode from 'vscode';
import type { TTokenStream } from '../../../globalEnum';
import { ahkValDefRegex } from '../../../tools/regexTools';
import { vbaApiFileMap } from '../vba/vbaApiFileMap';
import { vbaCompletion } from '../vba/vbaCompletion';

function valTrackFnCore(
    ChapterArr: readonly string[],
    AhkTokenList: TTokenStream,
): string[] {
    const Head: string = ChapterArr[0];

    const reg: RegExp = ahkValDefRegex(Head);
    const classNameList: string[] = []; // value name
    for (
        const {
            lStr,

            textRaw,
        } of AhkTokenList
    ) {
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

export function valTrackFn(ChapterArr: readonly string[], AhkTokenList: TTokenStream): vscode.CompletionItem[] {
    const itemS: vscode.CompletionItem[] = [];

    const nameList: string[] = valTrackFnCore(ChapterArr, AhkTokenList);
    console.log('🚀 ~ nameList:', nameList);

    for (const name of nameList) {
        const fileUpName: string = name.replace(/\..*/u, '').toUpperCase();
        const filePath: string | undefined = vbaApiFileMap.get(fileUpName);
        if (filePath !== undefined) {
            itemS.push(...vbaCompletion(filePath, name.toUpperCase(), ChapterArr));
        }
    }

    return itemS;
}
