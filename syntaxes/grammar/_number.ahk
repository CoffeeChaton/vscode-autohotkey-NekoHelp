;https://www.autohotkey.com/docs/v1/Concepts.htm#numbers

;@ahk-neko-ignore 999 line; at 2023/3/5 https://www.autohotkey.com/docs/v1/lib/SetFormat.htm

showMore := false
if (showMore) {
    MsgBox % Max(123, 00123 -1)
    MsgBox % Min(0x7B, 0x007B -0x1)
    MsgBox % 3.14159
    MsgBox % 0x001
    MsgBox % 1.0e4 + -2.1E-4

    MsgBox, % "ln " A_LineNumber . " is " . 1
        -9223372036854775808 (-0x8000000000000000)
        +9223372036854775807 + (0x7FFFFFFFFFFFFFFF)

    MsgBox, % 0xFF + 256
    MsgBox, % 255
    MsgBox % 06.0

    Var := 11.333333
    MsgBox % 6.2

    MsgBox % 10.33
        +0.2
        +11.33 
        +06.0
        +000011

    Var -= 1
    Var += 0
    MsgBox % Var

    MsgBox % 11
    MsgBox % 0xb 
    MsgBox % Round(3.333, 1) +0.0

    MsgBox % 0.17 
    MsgBox % 0.1 + 0
    MsgBox % 0.10000000000000001 +0
    MsgBox % 0.1 + 0.2
    MsgBox % 0.30000000000000004 +0
    MsgBox % 0.3 + 0
    MsgBox % 0.29999999999999999 +0
    MsgBox % 0.1 + 0.2 = 0.3

    MsgBox % Abs((0.1 + 0.2) - (0.3)) < 0.0000000000000001
    MsgBox % Round(0.1 + 0.2, 15) = Format("{:.15f}", 0.3)
}

showSetFormat := false
if (showSetFormat) {
    ; note https://www.autohotkey.com/docs/v1/lib/SetFormat.htm#Fast
    MsgBox, % "SetFormat Fast vs. Slow Mode"
    Var := 11.333333
    SetFormat, float, 6.2
    Var -= 1 ; Sets Var to be 10.33 with one leading space because the total width is 6.
    SetFormat, float, 0.2
    Var += 1 ; Sets Var to be 11.33 with no leading spaces.
    SetFormat, float, 06.0
    Var += 0 ; Sets Var to be 000011

    ; Convert a decimal integer to hexadecimal:
    SetFormat, IntegerFast, hex
    Var += 0 ; Sets Var (which previously contained 11) to be 0xb.
    Var .= "" ; Necessary due to the "fast" mode.
    SetFormat, IntegerFast, d
}

; https://www.autohotkey.com/docs/v1/Concepts.htm#caching
MsgBox % "1.0e3    is -> " 1.0e3 ; 1.0e3
MsgBox % "1.0e3 +0 is -> " 1.0e3 + 0 ; 1000.0


; fake number
MsgBox % "=========fake number================"
MsgBox % 1e3 +0 ; 1e3 is not number, because not any `.`
MsgBox % 1e3 ; 1e3 is not number, because not any `.`
;        ^ is variable but not any value

1e2 := "HIHI"
MsgBox % 1e2 +0 ; space
MsgBox % 1e2
;        ^ variable but look like number
