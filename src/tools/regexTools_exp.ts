/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-magic-numbers */

// start
const zReStart0 = /(?<=[%!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)\w+/u; // without .` and #$@

const zReEnd = /\w+(?=[.`%!"/&')*+,\-:;<=>?[\\^\]{|}~ \t]|$)/u; // without ( and #$@

// [#$@\w\x{A1}-\x{FFFF}]+
// #$@
const ascii_33_47: readonly [number, string, string][] = [
    // !"
    [33, '0x21', '!'],
    [34, '0x22', '"'],
    // [35, '0x23', '#'], // ahk-var-name
    // [36, '0x24', '$'], // ahk-var-name
    //
    [37, '0x25', '%'], // ahk
    // \u{26}-\u{2D}
    [38, '0x26', '&'],
    [39, '0x27', '\''], // string
    [40, '0x28', '('], // ahk---------------------------
    [41, '0x29', ')'],
    [42, '0x2a', '*'],
    [43, '0x2b', '+'],
    [44, '0x2c', ','],
    [45, '0x2d', '-'], // regexp
    //
    [46, '0x2e', '.'], // ahk
    //
    [47, '0x2f', '/'], // normal
];

const ascii: readonly [number, string, string][] = [
    // \u{3A}-\u{3F}
    // :;<=>?
    [58, '0x3a', ':'],
    [59, '0x3b', ';'],
    [60, '0x3c', '<'],
    [61, '0x3d', '='],
    [62, '0x3e', '>'],
    [63, '0x3f', '?'],
    // [64, '0x40', '@'], // ahk-var-name

    // \u{5B}-\u{60}
    [91, '0x5b', '['],
    [92, '0x5c', '\\'], // regexp
    [93, '0x5d', ']'], // regexp
    [94, '0x5e', '^'],
    [96, '0x60', '`'], // string

    // \u{7B}-\u{7E}
    [123, '0x7b', '{'],
    [124, '0x7c', '|'],
    [125, '0x7d', '}'],
    [126, '0x7e', '~'],
];

// const arr: [number, string, string][] = [];
// for (let i = 32; i <= 126; i++) {
//     const s = String.fromCodePoint(i);
//     if (!(/\w/u).test(s)) {
//         arr.push([i, `0x${i.toString(16)}`, s]);
//     }
// }
