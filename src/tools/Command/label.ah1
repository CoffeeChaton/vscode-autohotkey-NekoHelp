#Requires AutoHotkey v1.1.33+


GroupAdd, Explorer, ahk_exe Telegram.exe,, Label
;                                          ^^^^^
; WinActivate, ahk_group Explorer
; GroupActivate, Explorer ;<-- calc Label

Gui, Add, Text, cBlue gLabel, Click here to launch Google.
;                        ^^^^^ -> g Gosub (g-label) https://www.autohotkey.com/docs/v1/lib/Gui.htm#Events

Hotkey, ~F1, Label
;            ^^^^^
; // OK Hotkey, KeyName, Label, Options
; //                        ^
; // NG Hotkey, IfWinActive/Exist, WinTitle, WinText
; // NG Hotkey, If, Expression
; // NG Hotkey, If, % FunctionObject

Menu, MenuName, add, MenuItemName , Label
;                                   ^^^^^

SetTimer , Label, PeriodOnOffDelete, Priority
;          ^^^^^

Label:
    MsgBox, % "this is Label"
Return
