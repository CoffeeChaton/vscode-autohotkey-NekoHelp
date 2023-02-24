; code511 -> msg: 'var/param name "keyRawName" is the same func-Name "FnName()"'
; code512 -> msg: 'global-var name same func-Name'

~F1:: fn_exp1()
~F2:: fn_exp2()
~F3:: fn_exp3(fn)
~F4:: fn_exp3("fn")

/**
* Avoid unexpected call
*/
fn_exp1() {
    fn := func("fn_funcObjectExp").Bind("ABC", "DEF") 
    fn() ;      unexpected call "my name is fn()"   "my name is fn()"
    fn.Call() ; Correct use of func-object          "ABC and DEF"
}

/**
* Avoid Obfuscated Code
*/
fn_exp2() {
    fn := func("fn_funcObjectExp").Bind("ABC", "DEF") 
    ;                                   Before Run, can you never make mistakes when reading/writing?
    SetTimer,% fn, -1000 ; delay 1000 ms    what this line call?
    SetTimer,fn, -2000 ;   delay 2000 ms    what this line call?
    fn() ;                 delay    0 ms    what this line call?
}


/**
* switch back from another language
*/
fn_exp3(fn) {
    ; ahk-v1 not support "higher order function"
    fn() ; this line is not a function name passed with param.
    ; if you need "higher order function" suggest to switch to ahk-v2, ahk-v2 is release.
}

fn_funcObjectExp(param1, param2) {
    MsgBox % param1 " and " param2
}

/*
* many lines
*
*
*
*/

;#Include very very mony function .... or distance 1000+ lines
fn() {
    MsgBox, % "my name is fn()"
}
