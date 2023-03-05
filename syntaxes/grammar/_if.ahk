; https://www.autohotkey.com/docs/v1/lib/_If.htm#Basic_Operation

MyWindowTitle := "My Window"
#If WinActive("ahk_class Notepad") or WinActive(MyWindowTitle) ;comment
#Space::MsgBox % "You pressed Win+Spacebar in Notepad or " MyWindowTitle ;comment
~F1::MsgBox % "You pressed Win+Spacebar in Notepad or " MyWindowTitle ;comment
