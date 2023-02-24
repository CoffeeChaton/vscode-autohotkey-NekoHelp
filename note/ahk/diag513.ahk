; code513 -> msg: 'label-var name same func-Name'

~F1:: fn_exp1()

/**
* avoid unexpected
*/
fn_exp1() {
    SetTimer,doSomething, -100
    ; The label has a higher calling order
    ; If the label has the same name, and the label is very far away,
    ; it is easy to have unexpected behavior

    ;[v1.1.20+]: If not a valid label name...
    ;   Gui        https://www.autohotkey.com/docs/v1/lib/Gui.htm#Events
    ;   Hotkey     https://www.autohotkey.com/docs/v1/lib/Hotkey.htm#Parameters
    ;   SetTimer   https://www.autohotkey.com/docs/v1/lib/SetTimer.htm#Parameters
    ;
    ;When I rewrote the file left behind by others and reconstructed the label into a func,
    ;I forgot to delete the label with the same name and debugged it for a long time,
    ;so I provide this diagnostic rule here
}

doSomething() {
    MsgBox, %  "i am function"
}




/*
* many lines
*
*
*
*/

;#Include more code .... or distance 1000+ lines
doSomething:
{
    MsgBox, % "i am label"
}
Return