#Warn, All, MsgBox

fn(A_LineNumber, 1) ; b is 1
fn(A_LineNumber, 0) ; b is 1
fn(A_LineNumber, -1) ; b is 1

fn2(A_LineNumber, 1) ; b is 1
fn2(A_LineNumber, 0) ; b is 0
fn2(A_LineNumber, -1) ; b is 0

fn(user_LineNumber, c) {
    b := 0
    if (c>0) b := 1 ; TODO diag this case at ahk-v1 allow run this `b := 1` or auto format and add \n of this ?
        MsgBox, % "always run this line"
    MsgBox, % "b is " b " at ln " user_LineNumber
}

fn2(user_LineNumber, c) {
    b := 0
    if (c>0)
        b := 1 
    MsgBox, % "always run this line"
    MsgBox, % "b is " b " at ln " user_LineNumber
}