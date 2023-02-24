#Warn, All, MsgBox

MsgBox, % "call fnA(0)"
fnA(0) ; "A" -> B -> C

MsgBox, % "call fnA(1)"
fnA(1) ; B -> C

;  miss "," case
MsgBox, % "call fnB(0)"
fnB(0) ;C

MsgBox, % "call fnB(1)"
fnB(1) ;C

fnA(Var) {
    IfEqual, Var, 0, MsgBox "A"
        MsgBox, % "B"

    MsgBox, % "C"
}

fnB(Var) {
    ;      TODO diag    V miss,---> var !== "0 MsgBox "A""
    IfEqual, Var, 0 MsgBox "A"
        MsgBox, % "B"

    MsgBox, % "C"
}

/**
* https://www.autohotkey.com/docs/v1/Language.htm#if-statement
* Named If statements allow a command to be written on the same line, but mispelled command names are treated as literal text. Such errors may be difficult to detect.
*/