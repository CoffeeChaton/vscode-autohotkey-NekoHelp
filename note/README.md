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

It is expected to remove this jump list in 2023/5/1

### diag107

Moved to new page [[jump]](./code107.md)

### diag121

Moved to new page [[jump]](./code121.md)

### diag122

Moved to new page [[jump]](./code122.md)

### diag124

Moved to new page [[jump]](./code124.md)

### diag125

Moved to new page [[jump]](./code125.md)

### diag126

Moved to new page [[jump]](./code126.md)

### diag201

Moved to new page [[jump]](./code201.md)

### diag506

Moved to new page [[jump]](./code506.md)

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
