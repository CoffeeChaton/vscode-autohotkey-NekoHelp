#Requires AutoHotkey v1.1.33+
#Warn All, MsgBox

autoRun()

autoRun() {
    i := 0
}

neverRun() {
    a := 0
    if (a > 0) {
        sText := "; ;"
        ;          ^^^ this comment, not string =_=, thank you ahk.
        sText := "; `;"
    }
}