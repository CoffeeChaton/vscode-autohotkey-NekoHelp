export function ahkValDefRegex(valName: string): RegExp {
    return new RegExp(
        `(?<=[%!"/&'()*+,\\-:;<=>?[\\^\\]{|}~ \\t]|^)${valName}[ \\t]*:=`,
        //         ^  without .` and #$@
        'iu',
    );
}
