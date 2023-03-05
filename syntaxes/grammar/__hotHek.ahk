; normal

(:: foo("case (")
~[:: foo("case [")
;^Avoid vscode automatic bracket matching, here if it is Str

~F12::Reload

foo(case) {
    MsgBox, % "i am foo, and use at " . case
}
