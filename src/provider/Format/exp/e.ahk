; this is a fake ahk...
; Randomly copied from some open code base, and randomly added code until it looks complicated enough
; , as a test file under complex conditions.
; if I have time, I will construct a test case that can run.
Search0(i, return := "") { ;--------------------------------------------------------------------------------------------
    while, (ff := foo()) ;----------------------------------------------------------------------------------------------
        if (ff.text=find) { ;-------------------------------------------------------------------------------------------
            if return ;-------------------------------------------------------------------------------------------------
                while, (i := foo2(i)) ;---------------------------------------------------------------------------------
                    if (ff.text=find) { ;-------------------------------------------------------------------------------
                        if return ;-------------------------------------------------------------------------------------
                            MsgBox, % "text" ff.SelectSingleNode("../" return) ;----------------------------------------
                        MsgBox, % "A" ;---------------------------------------------------------------------------------
                        MsgBox, % "B" ;---------------------------------------------------------------------------------
                        MsgBox, % "C" ;---------------------------------------------------------------------------------
                        MsgBox, % "D" ;---------------------------------------------------------------------------------
                    } ;-------------------------------------------------------------------------------------------------
            MsgBox, % "A" ;---------------------------------------------------------------------------------------------
            MsgBox, % "B" ;---------------------------------------------------------------------------------------------
            MsgBox, % "C" ;---------------------------------------------------------------------------------------------
            MsgBox, % "D" ;---------------------------------------------------------------------------------------------
        } ;-------------------------------------------------------------------------------------------------------------
    ;-------------------------------------------------------------------------------------------------------------------
    ;-------------------------------------------------------------------------------------------------------------------
    MsgBox, % "c" ;-----------------------------------------------------------------------------------------------------
    ;-------------------------------------------------------------------------------------------------------------------
} ;---------------------------------------------------------------------------------------------------------------------

AhkScript := foo() ;----------------------------------------------------------------------------------------------------
iOption := 0 ;----------------------------------------------------------------------------------------------------------
IsFirstScript := boo() ;------------------------------------------------------------------------------------------------
IfNotExist, %AhkScript% ;-----------------------------------------------------------------------------------------------
    if !iOption ;-------------------------------------------------------------------------------------------------------
        Util_Error((IsFirstScript ? "Script" : "#include") " file cannot be opened.", 0x32, """" AhkScript """") ;------
    else return ;-------------------------------------------------------------------------------------------------------
MsgBox, % "A" ;---------------------------------------------------------------------------------------------------------
MsgBox, % "D" ;---------------------------------------------------------------------------------------------------------

InputBox, OutputVar ;---------------------------------------------------------------------------------------------------

if (OutputVar == "") ;--------------------------------------------------------------------------------------------------
    OutputVar := "A" ;--------------------------------------------------------------------------------------------------
        + "B" ;---------------------------------------------------------------------------------------------------------I know this line need idennt +1
        + "C" ;---------------------------------------------------------------------------------------------------------I know this line need idennt +1
;-----------------------------------------------------------------------------------------------------------------------
