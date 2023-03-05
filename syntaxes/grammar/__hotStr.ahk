; normal
::ts,,::TypeScript
::ts(::TypeScript()
;   ^Avoid vscode automatic bracket matching, here if it is Str

;;X-flag
; https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/CHANGELOG.md#00252023-02-26

;-----------
::case0,,::foo() ; "send foo()"
:X:case1,,::foo()  ; call foo() function

::case2,,::  ; call foo() function
    foo()
Return

foo() {
    MsgBox, % "i am foo"
}
;-----------

;-----------
name_copied := "XX"
:X:name1,,::Send, % "name 1 is " name_copied
;                                 ^^^^^^^^^^^var
;          ^^^^Send key https://www.autohotkey.com/docs/v1/lib/Send.htm
;^ X-flag https://www.autohotkey.com/docs/v1/Hotstrings.htm#Options

;....
name_copied := "XX"
:XB0:name2,,::Send % "name 2 is " name_copied
:X B0:name3,,::Send % "name 3 is " name_copied
; ^ has space does not affect.
:B0X:name1,,::Send % "name 4 is " name_copied
;-----------

~F12::Reload

