# diag201/code201

[Loop , Count](https://www.autohotkey.com/docs/v1/lib/Loop.htm#Parameters)

```js
201: {
    msg: 'If Count is a variable reference such as `%varName%` or `% expression`',
    path: 'https://www.autohotkey.com/docs/v1/lib/Loop.htm#Parameters'
},
```

```ahk
caseA := 5
Loop, caseA { ; ahk jump this, but not any warn, so I provided this diagnosis.
    MsgBox, % "caseA loop: " A_Index
}


caseB := 3
Loop, %caseB% { ; loop 3 OK~
    MsgBox, % "caseB loop: " A_Index
}


caseC := 1
Loop, % caseC + 1 { ; loop 2 OK~
    MsgBox, % "caseC loop: " A_Index
}

; caseD of float
Loop, 3.0 { ; ahk jump this, but not any warn, so I provided this diagnosis.
    MsgBox, % "caseD loop: " A_Index
}

; case4
Loop, 1.0e2 { ; ahk jump this, but not any warn, so I provided this diagnosis.
    MsgBox, % "caseE loop: " A_Index
}
```

When I switch back to ahk from other languages, I often make mistakes on this example
