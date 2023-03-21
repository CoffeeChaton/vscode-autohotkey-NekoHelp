# code118

```js
118: {
    msg: 'This part may be skipped by ahk-1.1',
    path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/code118.md',
},
```

```ahk
#Warn, All, MsgBox

foo(4)
; 

foo(key) {
    MsgBox, % "key is " key
    i := 0
    Switch key {
        case 0: { i := 999 ; skip `i := 999` && `#Warn` not work 😡
                MsgBox, % "case0"
        }
        Case 1: { MsgBox, % "case1-1" ; skip `MsgBox, % "case1-1"` && `#Warn` not work
                MsgBox, % "case1-2"
            }
            MsgBox, % "case1-3"
    Case 2, 3: MsgBox, % "case2-1" ; normal work
            MsgBox, % "case2-2"
        Default:  { MsgBox, % "Default-0" ; skip `MsgBox, % "Default-0"` && `#Warn` not work
                MsgBox, % "Default-1"
                MsgBox, % "Default-2"
            }
    }

    ListLines
    MsgBox, % "i is " i
}
```
