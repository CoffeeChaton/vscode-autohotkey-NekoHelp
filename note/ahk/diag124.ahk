Var := ">3<"
; error exp #1
style1 := "
    (Ltrim
        case1 %Var%
        case2 " Var "
        case3 " Var
    )"

MsgBox, % style1
