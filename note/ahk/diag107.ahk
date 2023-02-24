fn_exp_diag107()

fn_exp_diag107() {
    key := "val1"
    Switch key {
        Case "val1":            MsgBox, % "v1" ; <----
        Case "val2", "val3":    MsgBox, % "v2"
        Default :               MsgBox, % "Default"
    }
    ListVars
    MsgBox, % "use ':=' , key is " . key

    key = "val1"
    Switch key {
        Case "val1":            MsgBox, % "v1"
        Case "val2", "val3":    MsgBox, % "v2"
        Default :               MsgBox, % "Default" ; <----
    }

    ListVars
    MsgBox, % "use '=' , key is " . key
}

