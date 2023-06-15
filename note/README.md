# neko-help-note

> Personal Notes, for reference only

- [neko-help-note](#neko-help-note)
  - [about str or %](#about-str-or-)
  - [about ahk class](#about-ahk-class)
  - [DEV note](#dev-note)

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
