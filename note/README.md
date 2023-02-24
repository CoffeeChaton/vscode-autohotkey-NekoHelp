# neko-help-note

> Personal Notes, for reference only

- [neko-help-note](#neko-help-note)
  - [Diagnostic](#diagnostic)
    - [diag107](#diag107)
    - [diag121](#diag121)
    - [diag122](#diag122)
    - [diag124](#diag124)
    - [diag125](#diag125)
    - [diag126](#diag126)
    - [diag201](#diag201)
    - [diag506](#diag506)
  - [about str or %](#about-str-or-)
  - [about ahk class](#about-ahk-class)
  - [DEV note](#dev-note)

## Diagnostic

### diag107

[SetEnv (Var = Value)](https://www.autohotkey.com/docs/v1/lib/SetEnv.htm)

> **Deprecated:** This command or a legacy assignment is not recommended for use in new scripts. Use [expression assignments](https://www.autohotkey.com/docs/v1/lib/SetExpression.htm) like `Var := Value` instead.

```js
107: {
    msg: 'assign warning',
    path: 'https://www.autohotkey.com/docs/v1/lib/SetEnv.htm',
},
```

![diag107](./img/diag107.png)

> Can you find the right option quickly?

try it [diag107](./ahk/diag107.ahk)

### diag121

```js
121: {
    msg: 'Multi-line:join > 15 characters',
    path: 'https://www.autohotkey.com/docs/v1/Scripts.htm#Join',
},
```

the word `Join` should be followed immediately by as many as `15` characters.[[Read Doc]](https://www.autohotkey.com/docs/v1/Scripts.htm#Join)

![diag121](./img/diag121.png)

some idea [diag121](./ahk/diag121.ahk)

### diag122

```js
122: {
    msg: 'ahk-neko-help not supported "," or "`" flag now.',
    path: 'https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section',
},
```

please use tell me, how to use this flag? [report](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues)

### diag124

```js
124: {
    msg: '`"` is not closed',
    path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag124',
},
```

![diag124](./img/diag124.png)

> try it [diag124](./ahk/diag124.ahk)

### diag125

```js
125: {
    msg: '`%` miss to closed',
    path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag125',
},
```

![diag125](./img/diag125.png)

> - [Multiline](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section) style1 / exp1 just support `%varName%` style.
> - at this exp `% var%` `%` has a space, this error is at line `9`, but ahk-L report this error at line `5`.
> - try it [diag125](./ahk/diag125.ahk)

### diag126

```js
126: {
    msg: '`%` variable name contains an illegal character',
    path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag126',
},
```

![diag126](./img/diag126.png)

> - [Multiline](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section) style1 / exp1 just support `%varName%` style.
> - try to write like line `11` `12` `13`, this error is at line `11`, but ahk-L report error at line `6`.
> - I know there has some highlight bug at line 12 of `.a` and line 13 of `[" b"]`. [v0.0.12(2022-10-28)](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/master/CHANGELOG.md#00122022-10-28)

if [Multiline](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section) is very big, this diagnostic can help you to find the problem more quickly.

> try it [diag126](./ahk/diag126.ahk)

### diag201

[Loop , Count](https://www.autohotkey.com/docs/v1/lib/Loop.htm#Parameters)

```js
201: {
    msg: 'If Count is a variable reference such as `%varName%` or `% expression`',
    path: 'https://www.autohotkey.com/docs/v1/lib/Loop.htm#Parameters'
},
```

```ahk
caseA := 5
Loop, caseA { ; will jump this..., so I provided diagnosis.
    MsgBox, % "caseA loop: " A_Index
}
;

caseB := 3
Loop, %caseB% { ; loop 3
    MsgBox, % "caseB loop: " A_Index
}


caseC := 1
Loop, % caseC + 1 { ; loop 2
    MsgBox, % "caseC loop: " A_Index
}
```

> try it [diag201](./ahk/diag201.ahk)

When I switch back to ahk from other languages, I often make mistakes on this example

### diag506

```js
506: {
    msg: 'ahk v1 not support of this number formats',
    path: 'https://www.autohotkey.com/docs/v1/Concepts.htm#numbers',
},
```

`c506` is diagnosis of ahk v1 not support number formats [number](https://www.autohotkey.com/docs/v1/Concepts.htm#numbers)

> base10 `99` === base2 `0o1100011` === base8 `0b143` === base16 `0x63`, but ahk v1 just support base10 base16
>
> AutoHotkey supports these number formats:
>
> - Decimal integers, such as `123`, `00123` or `-1`.
> - Hexadecimal integers, such as `0x7B`, `0x007B` or `-0x1`.
> - Decimal floating-point numbers, such as `3.14159`.

## about str or %

i love `% "str"` style.
<https://www.autohotkey.com/boards/viewtopic.php?f=7&t=48726>

## about ahk class

![class_Provider](./img/class_Provider.png)

> try it [class_Provider](./ahk/class_Provider.ahk)

- `go to def` `find all ref` just support `topClass`, only [IntelliSense](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp#4-completion-of-class) support `NestedClass` of `Method()` now.
- move to line `26` `30` `35` `44` try to `go to def`.
- move to line `1` `12` try to `find all ref`.
- if you need to use [IntelliSense](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp#4-completion-of-class) of `a2` now, you need to write `a2 := new XXX` at new line, variable tracking not supported `? :` now.
- Because the other way, for me to achieve too complicated

```ahk
if (OutputVar > 0.5){
  a2 := new C1
} else {
  a2 := new C2
}
```

## DEV note

<https://www.autohotkey.com/docs/v1/Language.htm#commands-vs-functions>

> In AutoHotkey v1, it is currently not possible to call a command from an expression, or to call a function using the command syntax.
