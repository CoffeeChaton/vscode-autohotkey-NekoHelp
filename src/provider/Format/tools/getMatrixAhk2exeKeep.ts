import type { TTokenStream } from '../../../globalEnum';
import { EDetail } from '../../../globalEnum';

export function getMatrixAhk2exeKeep(DocStrMap: TTokenStream): readonly boolean[] {
    const list: boolean[] = [];

    let isAhk2exeKeep = false;
    // `/*@Ahk2Exe-Keep`
    // `/*@ahk-neko-format-ignore-block`

    for (const { detail, textRaw } of DocStrMap) {
        if (
            !isAhk2exeKeep && detail.includes(EDetail.inComment)
            && (/^\s*\/\*@(?:Ahk2Exe-Keep|ahk-neko-format-ignore-block)\b/iu).test(textRaw)
        ) {
            isAhk2exeKeep = true;
        }

        list.push(isAhk2exeKeep);
        // keep this after .push
        if (isAhk2exeKeep && (/^\s*\*\//u).test(textRaw)) {
            isAhk2exeKeep = false;
        }
    }

    return list;
}
