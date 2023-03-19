Random(Min = "", Max = "") {
    Random, v, %Min%, %Max%
    Return, v
}

fn_hot_strings_error_line() {
    local
    OutputVar := Random(0, 99)
    ;@ahk-neko-ignore 1 line
    el_error_line = text := "--------------%A_Sec%--%A_MSec%--%OutputVar%------------->>> " A_ThisFunc `nfn_print(text) ; comment
    SendInput {Text}%el_error_line%

    Sleep, 1000
    c := 0
    el_error_line_arr0 := ""
    ;@ahk-neko-ignore 1 line
    el_error_line_arr%c% = text := "--------------%A_Sec%--%A_MSec%--%OutputVar%--01----------->>> " A_ThisFunc `nfn_print(text) ; comment
    MsgBox, % "el_error_line%c% is `n" el_error_line_arr%c%
    MsgBox, % "el_error_line_arr0 is `n" el_error_line_arr0

    0_err := ""
    ;@ahk-neko-ignore 1 line
    %c%_err = text := "--------------%A_Sec%--%A_MSec%--%OutputVar%--01----------->>> " A_ThisFunc `nfn_print(text) ; comment
    MsgBox, % "%c%_err is `n" %c%_err
    MsgBox, % "0_err `n" 0_err

    ListLines
}

::el,,::
    fn_hot_strings_error_line()
Return
