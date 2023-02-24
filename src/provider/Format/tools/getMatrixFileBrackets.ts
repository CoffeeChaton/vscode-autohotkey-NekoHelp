import type { TAhkTokenLine, TTokenStream } from '../../../globalEnum';
import type { TBrackets } from '../../../tools/Bracket';
import { calcBracket } from '../../../tools/Bracket';
import { CommandMDMap } from '../../../tools/Built-in/Command.tools';

function calcLineBrackets(AhkTokenLine: TAhkTokenLine, oldBrackets: TBrackets): TBrackets {
    const {
        lStr,
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    // TODO with LStr fix like
    /**
     * MsgBox % call(a
     *  +b )
     */
    let lStrFix: string = lStr;
    if (CommandMDMap.has(fistWordUp)) {
        lStrFix = lStrFix.slice(0, fistWordUpCol);
    } else if (CommandMDMap.has(SecondWordUp)) {
        lStrFix = lStrFix.slice(0, SecondWordUpCol);
    } else if (lStrFix.trim().startsWith('#') && !(/^#if\b/iu).test(lStrFix.trim())) {
        lStrFix = '';
    }

    return calcBracket(lStrFix, oldBrackets);
}

export function getMatrixFileBrackets(DocStrMap: TTokenStream): readonly TBrackets[] {
    let brackets: TBrackets = [0, 0, 0];
    const list: TBrackets[] = [];
    list.push(brackets);
    //
    for (const AhkTokenLine of DocStrMap) {
        brackets = calcLineBrackets(AhkTokenLine, brackets);
        list.push(brackets);
    }
    list.pop();

    return list;
}
