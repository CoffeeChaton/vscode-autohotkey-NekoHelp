; #Warn All, MsgBox
~F11:: foo(1)
~F12:: Reload
~F10::
    GoSub, Label1
Return

foo(key) {
    Switch key {
        Case 1:
            MsgBox, % "key is 1 `n" key

        Case 2, 3:
            MsgBox, % "key is 2/3 `n" key

        Default: ;< not label
            MsgBox, % "Default:" key
    }
    MsgBox, % "is fn 1"
} Label1:
; ^^^^^^^ is label 1
MsgBox, % "is lab 1"
Return

Label2:
    MsgBox, % "is lab 2"
Return

