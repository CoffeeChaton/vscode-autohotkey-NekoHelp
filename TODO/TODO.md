# 2023-03 plan

- check ahk-v1 `1e3` is not `1.e3`
  >
  > 1. _option_ diag-1 : case `0 + 1e3` , this not `1 + 1000` , If the user does not set 1e3 as a variable, maybe it is directly used as a number, I need to warn the user that this is not a number, because of the missing decimal point <https://www.autohotkey.com/docs/v1/Concepts.htm#numbers>
  > 2. _option_ diag-2 : case `1e3 := 999` , avoid variable name very much like numbers, this can cause problems for code audits.

  ```ahk
  MsgBox, % 1e3 ; space , Because `1e3 `is not 1000
  MsgBox, % 0 + 1e3 + 0 ; space , Because `1e3 `is not 1000
  ;             ^^^  **diag-1**
  1e3 := "9999"
  MsgBox, % 1e3 ; show 9999 ... **diag-2**
  ```

- diag codeXXXX: Object syntactic errors
  >
  > 1. Remarks neko-help can only work on the legal subset of ahk-v1, if there is an illegal obj, it will cause indentation errors and function scope exceptions
  > 2. The following error will directly cause ahk-v1 not to work, but to provide automatic repair, need to study for the time being.
  > 3. And, I intend to abide by my own format policy of only adjusting the blank space at the beginning of the line by default, even if the alpha option is turned on, I do not add `\n` arbitrarily and do not intend to use format to fix any syntactic errors.
  > 4. [read ahk-v1 document](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation)

  ```ahk
  ;err-case 1

  obj := {
      a:0 ;ahk-v1 say Error: This line does not contain a recognized action.
  }
  MsgBox, % obj.a
  ```

  ```ahk
  ;err-case 2

  obj := { ;ahk-v1 say Error:  Missing "}"
      ,a:0
  }
  MsgBox, % obj.a
  ```

  ```ahk
  ;err-case 3

  obj := { b:0
      ,a:0 ;ahk-v1 say Error:  Missing "}"
  }
  MsgBox, % obj.a
  ```

  ```ahk
  ; OK case

  obj := { b:0   ; obj open "{" , Looks like it can't be at the end of a line.
          , a:0  ; line need to start with "," 
      ,c:0}      ; obj close "}" It seems that it cannot be at the beginning of the line, it seems to be related to the continuation.
  ;---^line start with ","   -> Indicates that this line is a continuation of the previous line
  MsgBox, % obj.a ; show 0 ^_^
  ```

- [x] more information
  - [Gui GuiName](https://www.autohotkey.com/docs/v1/lib/Gui.htm#New)
  - [Menu, MenuName](https://www.autohotkey.com/docs/v1/lib/Menu.htm)
  - [GuiControl , MyGui:Show](https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Remarks)

- <https://eslint.org/docs/latest/rules/>
- check OTB <https://www.autohotkey.com/boards/viewtopic.php?f=76&t=129753> , avoid the One True Brace (OTB, K&R style) because AHK 1.1 ignores such braces where not permitted.
