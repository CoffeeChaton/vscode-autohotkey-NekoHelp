# format.removeFirstCommaCommand

- [format.removeFirstCommaCommand](#formatremovefirstcommacommand)
  - [0 (default)](#0-default)
  - [1 (like v1.1 signature)](#1-like-v11-signature)
  - [2](#2)
  - [_warm_](#warm)

## 0 (default)

not format `Command` first optional comma, no formatting, no changes, reducing the interference of git-diff.

## 1 (like v1.1 signature)

format the signature format for the ahk-v1.1 online documentation, by add [Command](https://www.autohotkey.com/docs/v1/lib/index.htm) first optional comma.

exp:

```ahk
;from
MsgBox % "text"

; to 
MsgBox, % "text"
;     ^ add first optional comma
```

## 2

remove [Command](https://www.autohotkey.com/docs/v1/lib/index.htm) first optional comma.

exp:

```ahk
;from
MsgBox, % "text"

; to 
MsgBox % "text"
;     ^ remove first optional comma
```

## _warm_

> <https://www.autohotkey.com/docs/v1/Language.htm#commands>
> The comma separating the command name from its parameters is optional, except in the following cases:

1. When it's necessary to prevent the line from being interpreted as a [legacy assignment](https://www.autohotkey.com/docs/v1/lib/SetEnv.htm "Deprecated. New scripts should use Var := Value instead.") or [assignment expression](https://www.autohotkey.com/docs/v1/Variables.htm#AssignOp).
   - <https://www.autohotkey.com/docs/v1/Variables.htm#AssignOp>

   ```ahk
   #Requires AutoHotkey v1.1.33+

   MsgBox, := This would be an assignment without the comma.
   ```

   ```ahk
   #Requires AutoHotkey v1.1.33+

   ; all is variables
   MsgBox := 1
   MsgBox += 1
   MsgBox -= 1
   MsgBox *=1
   MsgBox /=1
   MsgBox //=1
   MsgBox .= 1
   MsgBox |=1
   MsgBox &=1
   MsgBox ^=1
   MsgBox >>=1
   MsgBox <<=1
   MsgBox >>>=1
   ```

   ```ahk
   #Requires AutoHotkey v1.1.33+

   ; all is command
   MsgBox, = 1
   MsgBox, := 1
   MsgBox, += 1
   MsgBox, -= 1
   MsgBox, *=1
   MsgBox, /=1
   MsgBox, //=1
   MsgBox, .= 1
   MsgBox, |=1
   MsgBox, &=1
   MsgBox, ^=1
   MsgBox, >>=1
   MsgBox, <<=1
   MsgBox, >>>=1
   ```

2. When the first parameter is blank.

   ```ahk
   Random ,   , % Epoch()
   ;       ^ first param is miss/space, this format-option, while not change this case
   ;
   ```

3. When the command is alone at the top of a [continuation section](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation).

   ```ahk
   MsgBox, ; <--- if miss , It will becomes non-working!
      ( LTrim
         str--str--str
      )
   ```
