fn_exp()

fn_exp() {
    ;                        12345
    result_err = ; 123456789012345
        (LTrim joinABCDEFGHIJKLMNOPQRSTUVWXYZ
            `n1
            `n 2
            `n  3
            `n   4
            `n    5
            `n     6
            `n      7
            `n       8
            `n        9

        )

    MsgBox % result_err

    result_ok := [
            , "`n1"
            , "`n 2"
            , "`n  3"
            , "`n   4"
            , "`n    5"
            , "`n     6"
            , "`n      7"
            , "`n       8"
            , "`n        9"
            , ""]

    MsgBox % fn_join("ABCDEFGHIJKLMNOPQRSTUVWXYZ", result_ok)
}

fn_join(separator, array) {
    /**
    * @param separator as string
    * @param array as string array
    * @return string
    */
    str := "" ;
    for _key, value in array
        str .= separator . value
    return SubStr(str, StrLen(separator)+1)
}

