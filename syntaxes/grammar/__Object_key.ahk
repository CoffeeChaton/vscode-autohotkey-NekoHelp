xyz := ""
obj := [foo, bar, baz, continue]
;                      ^^^^^^^^^ fix
obj := { foo: true, bar: xyz, baz: 000, continue: "string" }
;                                       ^^^^^^^^ fix
obj := { true: "Yes", false: "No", null: ""}
;        ^^^^         ^^^^^ Shouldn't be Highlighted
obj := { Click: "", MsgBox: "" }
;        ^^^^^ Shouldn't be Highlighted

obj := { local: "OK" }
;        ^^^^^ fix
obj := { global : "NOT OK"}
;        ^^^^^^ fix