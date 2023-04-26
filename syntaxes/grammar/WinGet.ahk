
; ID
WinGet, OutputVar , ID, WinTitle, WinText, ExcludeTitle, ExcludeText

WinGet, active_id, ID, A
WinMaximize, ahk_id %active_id%
MsgBox, "The active window's ID is " active_id

; IDLast
WinGet, OutputVar , IDLast, WinTitle, WinText, ExcludeTitle, ExcludeText


; PID
WinGet, OutputVar , PID, WinTitle, WinText, ExcludeTitle, ExcludeText


; ProcessName
WinGet, OutputVar , ProcessName, WinTitle, WinText, ExcludeTitle, ExcludeText


; ProcessPath
WinGet, OutputVar , ProcessPath, WinTitle, WinText, ExcludeTitle, ExcludeText


; Count
WinGet, OutputVar , Count, WinTitle, WinText, ExcludeTitle, ExcludeText


; List
WinGet, OutputVar , List, WinTitle, WinText, ExcludeTitle, ExcludeText


WinGet, id_list, List,,, Program Manager
Loop, %id_list%
{
    i := A_Index
    this_id := id_list%A_Index%
    WinActivate, ahk_id %this_id%
    WinGetClass, this_class, ahk_id %this_id%
    WinGetTitle, this_title, ahk_id %this_id%
    MsgBox, 4, ,
        (LTrim
            Visiting All Windows
            %i% of %id_list%
            ahk_id %this_id%
            ahk_class %this_class%
            %this_title%

            Continue?
        )

    IfMsgBox, NO
        break
}

; MinMax
WinGet, OutputVar , MinMax, WinTitle, WinText, ExcludeTitle, ExcludeText


; ControlList
WinGet, OutputVar , ControlList, WinTitle, WinText, ExcludeTitle, ExcludeText

WinGet, ActiveControlList, ControlList, A
Loop, Parse, ActiveControlList, `n
{
    MsgBox, 4,, % "Control #" A_Index " is [" A_LoopField "]`nContinue?"
    IfMsgBox, No
        break
}

; ControlListHwnd
WinGet, OutputVar , ControlListHwnd, WinTitle, WinText, ExcludeTitle, ExcludeText


; Transparent
WinGet, OutputVar , Transparent, WinTitle, WinText, ExcludeTitle, ExcludeText

MouseGetPos,,, MouseWin
WinGet, Transparent_var, Transparent, ahk_id %MouseWin% ; Transparency of window under the mouse cursor.

; TransColor
WinGet, OutputVar , TransColor, WinTitle, WinText, ExcludeTitle, ExcludeText


; Style
WinGet, OutputVar , Style, WinTitle, WinText, ExcludeTitle, ExcludeText


; ExStyle
WinGet, OutputVar , ExStyle, WinTitle, WinText, ExcludeTitle, ExcludeText

