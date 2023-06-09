Loop, 10 {

}

Loop Files, % A_ProgramFiles "\*.txt", R  ; Recurse into subfolders.
{
    MsgBox, 4, , Filename = %A_LoopFileFullPath%`n`nContinue?
    IfMsgBox, No
        break
}

Colors := "red,green,blue"
Loop, Parse, Colors, `,
    MsgBox, % "Color number " A_Index " is " A_LoopField "."

Loop, Parse, clipboard, `n, `r
{
    MsgBox, 4, ,% "File number " A_Index " is " A_LoopField ".`n`nContinue?"
    IfMsgBox, No
        break
}

Loop, Read, C:\Log File.txt
{
    last_line := A_LoopReadLine  ; When lo
}


Loop, Reg, HKEY_CURRENT_USER\Software\Microsoft\Windows, KVR
{
    if (A_LoopRegType = "key")
        value := ""
    else
    {
        RegRead, value
        if ErrorLevel
            value := "*error*"
    }
    MsgBox, 4, , %A_LoopRegName% = %value% (%A_LoopRegType%)`n`nContinue?
    IfMsgBox, NO
        break
}

Loop, HKEY_CURRENT_USER, Software