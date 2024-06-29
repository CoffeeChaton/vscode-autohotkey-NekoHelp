import type { TLineFnCallRaw } from '../../globalEnum';

export function fnRefLStrCore(lStr: string): TLineFnCallRaw[] {
    if (!lStr.includes('(')) {
        return [];
    }

    const arr: TLineFnCallRaw[] = [];

    for (const ma of lStr.matchAll(/(?<=[@$#!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)([#$@\w\u{A1}-\u{FFFF}]+)\(/giu)) {
        // -----------------------------------^ without .`%                          ^funcName(      of lStr
        const col: number = ma.index;
        const s0: string = lStr.slice(0, col).trimEnd();
        if ((/new$/iu).test(s0)) {
            // eslint-disable-next-line no-magic-numbers
            const s1: string | undefined = s0.at(-4);
            if (
                s1 === undefined
                || (/^[.%!"/&'()*+,\-:;<=>?\u{5B}-\u{60}\u{7B}-\u{7E} \t]$/u).test(s1)
            ) {
                //     // ^ all case mock \b
                //     // +foo()
                //     // fn_name is foo, not "+foo"

                //     // new bar()
                //     // ^ bar is class name, not fn_name
                continue;
            }
            //
        }

        arr.push({
            col,
            fnName: ma[1],
        });
    }
    // don't search of
    // MsgBox,
    // (
    //   fnName()
    // )
    return arr;
}
