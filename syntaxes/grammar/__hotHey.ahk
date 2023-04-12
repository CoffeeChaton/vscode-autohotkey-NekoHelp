#Warn All, MsgBox

(:: foo("case (")
~[:: foo("case [")
;^Avoid vscode automatic bracket matching, here if it is Str

~F12::Reload

foo(case) {
    MsgBox, % "i am foo, and use at " . case
}


F1::MsgBox, % A_ThisHotkey

w & s::
    MsgBox, % A_ThisHotkey
return

a Up::
    MsgBox, % A_ThisHotkey
return

c & b::
    MsgBox, % A_ThisHotkey
return

F10 & F11 Up::
    MsgBox, % A_ThisHotkey
return

