import type { TLineFnCallRaw } from '../../globalEnum';

export function fnRefLStrCore(lStr: string): TLineFnCallRaw[] {
    if (!lStr.includes('(')) {
        return [];
    }

    const arr: TLineFnCallRaw[] = [];

    for (const ma of lStr.matchAll(/(?<=[@$#!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)([#$@\w\u{A1}-\u{FFFF}]+)\(/giu)) {
        // -----------------------------------^ without .`%                          ^funcName(      of lStr
        const col: number = ma.index;

        if ((/(?<=[.%!"/&'()*+,\-:;<=>?\u{5B}-\u{60}\u{7B}-\u{7E} \t]|^)new$/iu).test(lStr.slice(0, col).trimEnd())) {
            // ^ all case mock \b
            // +foo()
            // fn_name is foo, not "+foo"

            // new bar()
            // ^ bar is class name, not fn_name
            continue;
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
