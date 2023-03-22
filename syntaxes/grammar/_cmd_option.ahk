;https://www.autohotkey.com/docs/v1/lib/Send.htm#keynames

~F11:: foo()

foo() {
    Send, {}}
    GoSub, Label1
}

Label1:
    Send, {{}
Return

