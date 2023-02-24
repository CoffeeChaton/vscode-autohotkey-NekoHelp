~F1:: ; call f1 -> f2 -> f3
    f1()

~F2:: ; call f2 -> f3
    f2()


~F3:: f3() ; call -> f3


f1() {
    MsgBox, % "f1"
}

f2() {
    MsgBox, % "f2"
}

f3() {
    MsgBox, % "f3"
}