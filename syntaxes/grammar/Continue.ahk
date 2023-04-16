;@ahk-neko-format-ignore-start

continue Label1
continue, Label1
continue, Label1 ;
continue ;
continue, ;  

    continue Label1
    continue, Label1
    continue, Label1 ;
    continue ;
    continue, ;  

xyz := ""
obj := [foo, bar, baz, continue]
;                      ^^^^^^^^^ fix
obj := { foo: true, bar: xyz, baz: 000, continue: "string" }
;                                       ^^^^^^^^ fix

;@ahk-neko-format-ignore-end