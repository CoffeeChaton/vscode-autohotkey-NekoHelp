# code500

```js
500: {
    msg: 'var is assigned but never used.',
    path: 'https://www.autohotkey.com/docs/v1/Variables.htm',
},
```

- [code500](#code500)
  - [exception-1 of start with `"_"`](#exception-1-of-start-with-_)
  - [exception-2 of pcre](#exception-2-of-pcre)

## exception-1 of start with `"_"`

var-name is start with `"_"` , exp: `_a := 0`

## exception-2 of pcre

var-name is `"pcre_callout"` <https://www.autohotkey.com/docs/v1/misc/RegExCallout.htm#syntax>

```ahk
#Requires AutoHotkey v1.1.33+

foo()

foo() {
    pcre_callout := "FuncCallOut"

    arr := ["i)(The) (\w+)\b(?CFuncCallOut)" ; style 1 , default
            , "i)(The) (\w+)\b(?C:FuncCallOut)" ; style 2, has :
            , "i)(The) (\w+)\b(?C1:FuncCallOut)" ; style 3, has number and :
            , "i)(The) (\w+)\b(?C1)"] ; style 4, only use number

    For Key, Value in arr {
        MsgBox % "style - " Key
        RegExMatch("The quick brown fox jumps over the lazy dog.", Value)
    }
}


FuncCallOut(m) {
    ListVars
    MsgBox,
        ( LTrim C
            m=%m%
            m1=%m1% ; pseudo array
            m2=%m2% ; pseudo array
        )

    return 1
}
```

<!-- ## exception-4 of GuiControlGet

`GuiControlGet` and sub-cmd is `Pos` <https://www.autohotkey.com/docs/v1/lib/GuiControlGet.htm#Pos>

```ahk
#Requires AutoHotkey v1.1.33+
Gui Add, Tab, hwndhwTabCtrl
GuiControlGet last, Pos , %hwTabCtrl%

ListVars
; last[0 of 0]:
; lastH[3 of 3]: number
; lastW[3 of 3]: number
; lastX[2 of 3]: number
; lastY[1 of 3]: number

MsgBox % "observe ListVars"
```

## exception-5 of SysGet

`SysGet` and sub-cmd is `Monitor` or `MonitorWorkArea` <https://www.autohotkey.com/docs/v1/lib/SysGet.htm#Monitor>

```ahk
#Requires AutoHotkey v1.1.33+
SysGet OutputVar, Monitor
; SysGet OutputVar, MonitorWorkArea

ListVars
; OutputVar[0 of 0]:
; OutputVarBottom[4 of 7]:
; OutputVarLeft[1 of 3]:
; OutputVarRight[4 of 7]:
; OutputVarTop[1 of 3]:

MsgBox % "observe ListVars"
```

## exception-6 of WinGet

`WinGet` and sub-cmd is `List` <https://www.autohotkey.com/docs/v1/lib/WinGet.htm#List>

```ahk
#Requires AutoHotkey v1.1.33+
WinGet OutputVar, List ; To retrieve all windows on the entire system, omit all four title/text parameters.

ListVars
; OutputVar[0 of 0]:
; OutputVar1[0 of 0]:
; OutputVar2[0 of 0]:
; OutputVar3[0 of 0]:
; ....

MsgBox % "observe ListVars"
``` -->
