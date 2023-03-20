fn_exp_diag107()

fn_exp_diag107() {
    A := "val1"
    Switch A {
        Case "val1":            MsgBox, % "v1"
        Case "val2", "val3":    MsgBox, % "v2"
        Default :               MsgBox, % "Default"
    }
    ListVars
    MsgBox, % "use ':=' , A is " . A

    B = "val1"
    Switch B {
        Case "val1":            MsgBox, % "v1"
        Case "val2", "val3":    MsgBox, % "v2"
        Default :               MsgBox, % "Default"
    }

    ListVars
    MsgBox, % "use '=' , B is " . B
}