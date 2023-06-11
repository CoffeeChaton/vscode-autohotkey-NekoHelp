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

*LWin:: MsgBox, % A_ThisHotkey
*LWin Up:: MsgBox, % A_ThisHotkey

<^>!m::MsgBox, You pressed AltGr+m.
<^<!m::MsgBox, You pressed LeftControl+LeftAlt+m.

LControl & RAlt::MsgBox, You pressed AltGr itself.

*#c::Run, Calc.exe  ; Win+C, Shift+Win+C, Ctrl+Win+C, etc. will all trigger this hotkey.
*ScrollLock::Run, Notepad  ; Pressing ScrollLock will trigger this hotkey even when modifier key(s) are down.

~RButton::MsgBox, You clicked the right mouse button.
~RButton & C::MsgBox, You pressed C while holding down the right mouse button.

AppsKey::ToolTip, Press < or > to cycle through windows.
AppsKey Up::ToolTip
~AppsKey & <::Send, !+{Esc}
~AppsKey & >::Send, !{Esc}

*LWin::Send, {LControl down}
*LWin Up::Send, {LControl up}

LControl & F1::return  ; Make left-control a prefix by using it in front of "&" at least once.
LControl::MsgBox, You released LControl without having used it to modify any other key.

^Numpad0::
^Numpad1::
    MsgBox, Pressing either Control+Numpad0 or Control+Numpad1 will display this message.
return

RWin::return

#IfWinActive ahk_class Notepad
^a::MsgBox, You pressed Ctrl-A while Notepad is active. Pressing Ctrl-A in any other window will pass the Ctrl-A keystroke to that window.
#c::MsgBox, You pressed Win-C while Notepad is active.

#IfWinActive
#c::MsgBox, You pressed Win-C while any window except Notepad is active.

#If MouseIsOver("ahk_class Shell_TrayWnd") ; For MouseIsOver, see #If example 1.
WheelUp::Send, {Volume_Up}     ; Wheel over taskbar: increase/decrease volume.
WheelDown::Send, {Volume_Down} ;

RControl & RShift::AltTab  ; Hold down right-control then press right-shift repeatedly to move forward.
RControl & Enter::ShiftAltTab  ; Without even having to release right-control, press Enter to reverse direction.

MButton & WheelDown::MsgBox, You turned the mouse wheel down while holding down the middle button.
^!WheelUp::MsgBox, You rotated the wheel up while holding down Control+Alt.

~LControl & WheelUp::  ; Scroll left.
    ControlGetFocus, fcontrol, A
    Loop 2 ; <-- Increase this value to scroll faster.
        SendMessage, 0x0114, 0, 0, %fcontrol%, A  ; 0x0114 is WM_HSCROLL and the 0 after it is SB_LINELEFT.
return

~LControl & WheelDown::  ; Scroll right.
    ControlGetFocus, fcontrol, A
    Loop 2 ; <-- Increase this value to scroll faster.
        SendMessage, 0x0114, 1, 0, %fcontrol%, A  ; 0x0114 is WM_HSCROLL and the 1 after it is SB_LINERIGHT.
return

NumpadEnd::
Numpad1::
    MsgBox, This hotkey is launched regardless of whether NumLock is on.
return

~RButton & LButton::MsgBox, You pressed the left mouse button while holding down the right.
RButton & WheelUp::MsgBox, You turned the mouse wheel up while holding down the right button.

; https://www.autohotkey.com/docs/v1/KeyList.htm#Controller
2Joy16::
Joy2::
    if not GetKeyState("Control") ; Neither the left nor right Control key is down.
        return ; i.e. Do nothing.
    MsgBox, You pressed the first joystick's second button while holding down the Control key.
return

^!s::Send, {Delete}

^!s::
    KeyWait, Control
    KeyWait, Alt
    Send, {Delete}
return

RAlt & j::AltTab
RAlt & k::ShiftAltTab

MButton::AltTabMenu
WheelDown::AltTab
WheelUp::ShiftAltTab

LCtrl & CapsLock::AltTab
#IfWinExist ahk_group AltTabWindow  ; Indicates that the alt-tab menu is present on the screen.
*MButton::Send, {Blind}{Escape}  ; The * prefix allows it to fire whether or not Alt is held down.
#If

*F1::Send, {Alt down}{tab} ; Asterisk is required in this case.
!F2::Send, {Alt up}  ; Release the Alt key, which activates the selected window.
#IfWinExist ahk_group AltTabWindow
~*Esc::Send, {Alt up}  ; When the menu is cancelled, release the Alt key automatically.
;*Esc::Send {Esc}{Alt up}  ; Without tilde (~), Escape would need to be sent.
#If

^+o::
^+e::
    editor_open_folder() {
        WinGetTitle, path, A
        if RegExMatch(path, "\*?\K(.*)\\[^\\]+(?= [-*] )", path)
            if (FileExist(path) && A_ThisHotkey = "^+e")
                Run, explorer.exe /select`,"%path%"
        else
            Run, explorer.exe "%path1%"
    }