# code107

```js
107: {
    msg: '(legacy assignment), try to use `:=` replace',
    path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/code107.md',
},
```

> [SetEnv (Var = Value)](https://www.autohotkey.com/docs/v1/lib/SetEnv.htm)
> **Deprecated:** This command or a legacy assignment is not recommended for use in new scripts. Use [expression assignments](https://www.autohotkey.com/docs/v1/lib/SetExpression.htm) like `Var := Value` instead.

## exp

![diag107](./img/diag107.png)

> Can you find the right option quickly?

try it [diag107](./ahk/diag107.ahk)

or try edge-case with [code507](./code507.md#exp3)

## exception 1

Like path stitching

```ahk
source  = %A_ScriptDir%\Temp.txt
;   not warn, because start with "%var%\"
```

## exception 2

next line is [multiline](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section)

```ahk
Var =
(
A line of text.
By default, the hard carriage return (Enter) between the previous line and this one will be stored as a linefeed (`n).
    By default, the spaces to the left of this line will also be stored (the same is true for tabs).
By default, variable references such as %Var% are resolved to the variable's contents.
)
```
