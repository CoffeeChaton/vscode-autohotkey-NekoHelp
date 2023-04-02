export function ahkValDefRegex(valName: string): RegExp {
    // eslint-disable-next-line security/detect-non-literal-regexp
    return new RegExp(
        `(?<=[%!"/&'()*+,\\-:;<=>?[\\^\\]{|}~ \\t]|^)${valName}[ \\t]*:=`,
        //         ^  without .` and #$@
        'iu',
    );
}
