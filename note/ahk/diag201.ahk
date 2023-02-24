caseA := 5
Loop, caseA { ; 0 -> jump this...
    MsgBox, % "caseA loop: " A_Index
}
;

caseB := 3
Loop, %caseB% { ; loop 3
    MsgBox, % "caseB loop: " A_Index
}


caseC := 1
Loop, % caseC + 1 { ; loop 2
    MsgBox, % "caseC loop: " A_Index
}