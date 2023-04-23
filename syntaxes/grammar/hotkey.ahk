;@ahk-neko-format-ignore-start

;cmd, param
hotkey, #x           , toggle_follow
hotkey, +$LButton    , click_through
Hotkey, IfWinActive , WinTitle, WinText
Hotkey, IfWinExist , WinTitle, WinText
Hotkey, If , Expression
Hotkey, If, % FunctionObject


;cmd ,param
hotkey ,#x           , toggle_follow
hotkey ,+$LButton    , click_through
Hotkey ,IfWinActive , WinTitle, WinText
Hotkey ,IfWinExist , WinTitle, WinText
Hotkey ,If , Expression
Hotkey ,If, % FunctionObject

;cmd   ,    param
hotkey   ,  #x           , toggle_follow
hotkey  ,    +$LButton    , click_through
Hotkey   ,     IfWinActive , WinTitle, WinText
Hotkey   ,          IfWinExist , WinTitle, WinText
Hotkey      ,      If , Expression
Hotkey    ,    If, % FunctionObject


;cmd param (without,)
hotkey #x           , toggle_follow
hotkey +$LButton    , click_through
Hotkey IfWinActive , WinTitle, WinText
Hotkey IfWinExist , WinTitle, WinText
Hotkey If , Expression
Hotkey If, % FunctionObject

;cmd           param (without,)
hotkey       #x           , toggle_follow
hotkey    +$LButton    , click_through
Hotkey   IfWinActive , WinTitle, WinText
Hotkey           IfWinExist , WinTitle, WinText
Hotkey      If , Expression
Hotkey      If, % FunctionObject

;@ahk-neko-format-ignore-end