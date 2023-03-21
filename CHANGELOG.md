# Changelog

- [Changelog](#changelog)
  - [Next v0.0.31(2023-03-xx)](#next-v00312023-03-xx)
  - [v0.0.30(2023-03-19)](#v00302023-03-19)
  - [v0.0.29(2023-03-15)](#v00292023-03-15)
  - [0.0.28(2023-03-13)](#00282023-03-13)
  - [0.0.27(2023-03-11)](#00272023-03-11)
  - [0.0.26(2023-03-04)](#00262023-03-04)
  - [0.0.25(2023-02-26)](#00252023-02-26)
  - [0.0.24(2023-02-24)](#00242023-02-24)
  - [\<= 0.0.23(2023-02-17)](#-00232023-02-17)

## Next v0.0.31(2023-03-xx)

- feat:add diag code507, avoid set `number` as variable [note](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/code507.md)

  ```ahk
  #Warn, All, MsgBox

  Transform, 0x23, BitNot, 0xf0f
  ;          ^ show warn message at this, When the code review is tired, this kind of code may be accidentally approved to enter the official code
  MsgBox, % 0x23 ;0x23
  MsgBox, %0x23% ;4294963440 ;If this is after 2000 lines, this will be a happy trap

  Transform, num, BitNot, 0xf0f
  MsgBox, % num ;4294963440
  MsgBox, %num% ;4294963440


  0x21 := "AA" 
  ;^ show warn message at this
  MsgBox, % 0x21 ;0x21
  MsgBox, % 0x21 +0 ;0x21 +0 -> 33 +0 -> 33
  MsgBox, % 0x21 "BB" ;0x21BB
  MsgBox, %0x21% ;AA
  ```

  ![code507](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/note/img/code507.png)

- feat: add `/*@ahk-neko-format-ignore-block` to not format block, I think this will reduce the interference with git-diff.
- feat: at simple case ,the Legacy Assignment `a = str` , use syntax-highlight replace [v0.0.29(2023-03-15)](#v00292023-03-15) semantic-highlight.
  1. fix: use syntax-highlight, vscode to correctly match the brackets. [Bracket pair](https://code.visualstudio.com/blogs/2021/09/29/bracket-pair-colorization)
  2. fix: use syntax-highlight, vscode can use it at `hover markdown code-block` or any scene where [semantic-highlight](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide) is not called
  3. perf: in most cases syntax-highlight comes faster than i provide-semantic-highlight. [vscode optimizations](https://code.visualstudio.com/blogs/2017/02/08/syntax-highlighting-optimizations)
  4. fix: use syntax-highlight, can display the builtin_variable (`A_var`) ,escaped_char , and numbers (`0`) at the right of the equal sign.
     ![img to show](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-31-legacy-assignment.png)
  5. try it now <https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/syntaxes/grammar/__legacy_assignment.ahk>
  6. semantic-highlight will only work when syntax-highlight does not hit now.

- feat: set Var By Legacy Assignment `a = str`
- fix: multi-line has \`-flag (by semantic-highlight)
  ![multi-line-semantic-highlight has `-flag](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-31-multi-line-semantic-highlight.jpg)
  <details>
    <summary>try it</summary>

  ```ahk
  ::a1::
          ( ` LTrim
              F4U5$4qIVVJ7S4uj`%F5QM6gS3yY4*
          ) ; F4U5$4qIVVJ7S4uj`%F5QM6gS3yY4*
      ;                       ^ has `
  Return

  ::a2::
          ( LTrim ; with out `flag
              F4U5$4qIVVJ7S4uj`%F5QM6gS3yY4*
          ) ; F4U5$4qIVVJ7S4uj%F5QM6gS3yY4*
      ;                      ^ miss `

  Return

  ~F1::
      MsgBox, % "
          ( LTrim
              F4U5$4qIVVJ7S4uj`%F5QM6gS3yY4*
          )" ; F4U5$4qIVVJ7S4uj%F5QM6gS3yY4*
  Return ;                    ^ miss `

  ~F2::
      MsgBox,
          ( LTrim
              F4U5$4qIVVJ7S4uj`%F5QM6gS3yY4*
          ) ; F4U5$4qIVVJ7S4uj%F5QM6gS3yY4*
  Return ;                   ^ miss `

  ~F3::
      MsgBox, % "
          ( ` LTrim
              F4U5$4qIVVJ7S4uj`%F5QM6gS3yY4*
          )" ;F4U5$4qIVVJ7S4uj`%F5QM6gS3yY4*
  Return ;                    ^ has `

  ~F4::
      MsgBox,
          ( LTrim ` %
              F4U5$4qIVVJ7S4uj`%F5QM6gS3yY4*
          ) ; F4U5$4qIVVJ7S4uj`%F5QM6gS3yY4*
  Return ;                    ^ has `
  ```

  </details>

- fix: format multi-line
  1. with open `c-flag` && `LTrim-flag`
  2. in multi-line block has `^\s*;` only comment line, this line indent level will be `1` level to the left compared to other lines.
  3. <<https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/ahk/format/multi-line-with-c-flag-fmt.ahk>>

## v0.0.30(2023-03-19)

- fix: format `Alpha test options`
  1. avoid working at `SecondWordUp` line.
  2. fix avoid `!==` -> `!= =` now
- fix: [#7](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/7)
  - [x] part 1, parsing error of Command OutputVar
  - [x] ~~part 3-1, need some time to fix unit-test, Help users tab to `$0`~~, `$0` is need to use at part 4-2
  - [x] part 3-2, add select CodeAction(_yellow light bulb_) to format it
  - [x] part 4-1, fix `ListLines` now
  - [ ] part 4-2, let `[` -> `,[$0` , this helps users to tab to delete this, and using unit-test.
  - [x] part 5, fix `WinGetTitle`
  - [x] part 6-1, fix `ControlFocus` , and add unit_test
  - [x] part 6-2, fix `SetTimer`, `FileAppend`, `SetKeyDelay`
  - [x] part 6-3, fix `OutputDebug` and `#Requires` now.

- fix: about part 3-2 [#7](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/7)
  > in v1.1 the initial comma after a command is optional

  add select CodeAction(_yellow light bulb_) to format like it.

  1. for default-format, users generally do not check whether the results of formatting changes are normal, so for the sake of conservatism , my default configuration is to adjust only the indent (the blank symbol in front)
  2. for `Alpha test options` format, I want to think about how to stitch this command to the format function ().
  3. Now only provide a small light bulb for formatting, and output some logs.

  exp: mp4 is at <https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/7#issuecomment-1475112828>

## v0.0.29(2023-03-15)

- fix: multiline parse error [#6](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/6)
- fix: `Local Static Global` with `comment` highlight
- fix: `GuiControl` SubCommand syntax-highlight
- fix: not format `/*@Ahk2Exe-Keep` block
- feat: add `/*@Ahk2Exe-Keep` _hover_ && _CompletionItem_
- feat: add semantic-highlight of `MyString = This is a literal string.` equal sign operator (=)

  ```ahk
  #Requires AutoHotkey v1.1.33

  MyNumber = 123
  MyString = This is a literal string.
  Var := "hi~"
  CopyOfVar = var say %Var% ! ; With the = operator, percent signs are required to retrieve a variable's contents.
  CopyOfVar = var say % Var " !"
  ```

  ![img](./image/Changelog/v0-0-29-fix-old-set-var.png)

## 0.0.28(2023-03-13)

- feat: add config with file-rename-event [#4](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/4) and [#5](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/5)

## 0.0.27(2023-03-11)

- fix: remove misdiagnosis of Infinite loop

  ```ahk
  loop ; <------not any parameter, not need to check c201
  {
      MsgBox % "Infinite loop at " A_index
  }
  ```

- fix: identify variable ![exp](image/Changelog/v0-0-27-fix-identify-variable.jpg)
- fix: cmd after `Else` `Finally`

  ```ahk
  If False {
      MsgBox % "True"
  } Else MsgBox % "Else"
  ;     ^^^^^^^after Else Cmd
  If False {
      MsgBox % "True"
  } Else , MsgBox % "Else"
  ;      ^ ,

  If True { ;<------ check "Else"
      MsgBox % "True"
  } Else MsgBox % "Else"
  ;     ^

  If True { ;<------ check "Else"
      MsgBox % "True"
  } Else, MsgBox % "Else"
  ;     ^
  ```

- feat: add hoverMultiLine `LTrim` `Join` `C` flag
- fix: format `Alpha test options` - `"AhkNekoHelp.format.textReplace"` don't format at `#Directives` line

  ```ahk
  #Hotstring EndChars -()[]{}':;"/\,.?!`n `t
  ;                           ^ don't add \s at `#Directives`
  #Include c:\DEV\XX\ahk_test,XX.ahk
  ;                          ^ don't add \s at `#Directives`
  ```

- fix: [diag201](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/code201.md)

## 0.0.26(2023-03-04)

- add: hover at `Menu` / `Gui` / `GuiControl` SubCommand , exp: `Menu DeleteAll`
  ![hover at menu sub-cmd](image/Changelog/v0-0-26-hover-at-menu-sub-cmd.png)
- add: more Completion of `Sub-commands` && provide config control `"AhkNekoHelp.snippets.expandSubCommand"` [(Preview it)](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/config/snippets.expandSubCommand.md)
- fix: some uri from old-packages to new-packages
- fix: limit completion of `Menu` / `Gui` / `GuiControl` sub-command
- fix: CodeLens `'Analyze this ahk file'` if the file <= 1 line, there is a flickering problem.

## 0.0.25(2023-02-26)

- fix: `HotString` has [X-flag](https://www.autohotkey.com/docs/v1/Hotstrings.htm#Options) case\
  if `HotString` has X-flag, then it look like

  ```ahk
  ::case0,,::foo() ; "send foo()"


  :X:case1,,::foo()  ; call foo() function

  ::case2,,::  ; call foo() function
    foo()
  Return
  ```

  other exp

  ```ahk
  name_copied := "XX"
  :X:name,,::Send, % "The name is " name_copied
  ;                                 ^^^^^^^^^^^var
  ;          ^^^^Send key https://www.autohotkey.com/docs/v1/lib/Send.htm
  ;^ X-flag https://www.autohotkey.com/docs/v1/Hotstrings.htm#Options

  ;....
  name_copied := "XX"
  :XB0:name,,::Send % "The name is " name_copied
  :X B0:name,,::Send % "The name is " name_copied
  ; ^ has space does not affect.
  :B0X:name,,::Send % "The name is " name_copied
  ```

- feat: add more format config in file

  ```ahk
  ;@ahk-neko-format-ignore-start
  ;@ahk-neko-format-ignore-end 
  ;@ahk-neko-format-inline-spacing-ignore-start ;pairing `AhkNekoHelp.format.textReplace`
  ;@ahk-neko-format-inline-spacing-ignore-end
  ```

- feat: add Comment Completion

  ```ahk
  ;@ahk-neko-ignore 1 line
  ;@ahk-neko-ignore-fn 1 line

  ;@ahk-neko-format-ignore-start
  ;@ahk-neko-format-ignore-end
  ;@ahk-neko-format-inline-spacing-ignore-start
  ;@ahk-neko-format-inline-spacing-ignore-end
  ```

## 0.0.24(2023-02-24)

- fix: `1.e3` syntax-highlight

- perf: format 3X~10X
  - if all files not changed

  | ms       | 0.0.23    | 0.0.24  | x   |
  | -------- | --------- | ------- | --- |
  | 88-files | 1600~1800 | 450~600 | 3X  |
  | 29-files | 700~800   | 50~80   | 10X |

  - if all files changed

  | ms       | 0.0.23    | 0.0.24    | x  |
  | -------- | --------- | --------- | -- |
  | 88-files | 1600~1800 | 1600~1800 | 1X |
  | 29-files | 700~800   | 700~800   | 1X |

  > use command `format All File`

## <= 0.0.23(2023-02-17)

> <https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp-Old/blob/master/CHANGELOG.md>
