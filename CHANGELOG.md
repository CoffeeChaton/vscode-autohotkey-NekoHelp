# Changelog

- [Changelog](#changelog)
  - [v0.0.63(2024-07-XX)](#v00632024-07-xx)
  - [v0.0.62(2024-06-28)](#v00622024-06-28)
  - [v0.0.61(2024-06-15)](#v00612024-06-15)
  - [v0.0.60(2024-06-09)](#v00602024-06-09)
  - [v0.0.59(2024-06-03)](#v00592024-06-03)
  - [v0.0.58(2024-05-25)](#v00582024-05-25)
  - [v0.0.57(2024-05-16)](#v00572024-05-16)
  - [v0.0.56(2024-05-13)](#v00562024-05-13)
  - [v0.0.55(2024-04-26)](#v00552024-04-26)
  - [v0.0.54(2024-04-10)](#v00542024-04-10)
  - [\<= 0.0.53(before 2024)](#-0053before-2024)

## v0.0.63(2024-07-XX)

<!-- pnpm 9.4.0 iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- feat: hover/Completion `__New()` `__Set()` etc...
- fix: Class Property Def

## v0.0.62(2024-06-28)

<!-- pnpm 9.4.0 iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- feat: `"AhkNekoHelp.format.textReplace"` support `until` space format
- feat: `#Include` gotoDef with Unknown case , use list all may file
- fix: rm `A_ScriptDir`/`A_WorkingDir` fake support.
- feat: hover `#Include` list may file
- feat: CodeAction `#Include` add file exist check
- feat: diag `code107` not warn `Like path stitching`

  ```ahk
  #Requires AutoHotkey v1.1.33+

  source  = %A_ScriptDir%\Temp.txt
  ;   not warn, because start with "%var%\"
  ```

- feat: ([#5](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/5#issuecomment-2167533567))
  - try support multiple files move event, and auto fix `#Include`
  - list all may file

  ```jsonc
  // settings.json
  {
      "AhkNekoHelp.event.FileRenameEvent": 2 // Alpha test options
  }
  ```

- fix: `#if` func-ref

  ```ahk
  #Requires AutoHotkey v1.1.33+

  #if fn_isInRange()
  ;   ^^^^^^^^^^^^ sould has ref
  #if


  fn_isInRange() {

  }
  ```

## v0.0.61(2024-06-15)

<!-- pnpm 9.3.0 iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- fix: hover `VBA++`
- feat: ([#88](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/88)) add new folding pairs

  | Language              | Start region            | End region                    |
  | --------------------- | ----------------------- | ----------------------------- |
  | C#                    | `#region`               | `#endregion`                  |
  | Coffeescript          | `#region`               | `#endregion`                  |
  | PHP                   | `#region`               | `#endregion`                  |
  | PowerShell            | `#region`               | `#endregion`                  |
  | Python                | `#region` or `# region` | `#endregion` or `# endregion` |
  | TypeScript/JavaScript | `//#region`             | `//#endregion`                |
  | ---                   | ---                     | ---                           |
  | ahk (old)             | `;[region]`             | `;[endregion]`                |
  | ahk (new)             | `;#region`              | `;#endregion`                 |

  > <https://code.visualstudio.com/docs/editor/codebasics#_folding>

  Added new folding pairs, more like other common languages, to reduce the cost of switching to ahk

  1. add hover
  2. add completion of `;#region` / `;#endregion` / `;#MARK:`

- feat: ([#5](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/5#issuecomment-2167533567))
  > youtube <https://youtu.be/mV6ziP7Vt_M>

  ```jsonc
  // settings.json
  {
      "AhkNekoHelp.event.FileRenameEvent": 2 // Alpha test options
  }
  ```

  support one file move event, and auto fix `#Include`

- feat: ([#87](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/87)) auto `utf8bom` and `quickSuggestions` in string.
- feat: ([#86](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/86)) `GroupName` completion
- feat: ([#85](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/85)) `GroupAdd` has `label`
  1. gotoDef
  2. findAllRef
  3. hover
  4. semantic-highlight

- feat: ([#82](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/82))
  1. add diag `code210` to avoid `if legacy` like `if a != b and 1 >0`
  2. fix `if a != b and 1 >0` semantic-highlight
  3. add diag `code209`, [info] always use `if ()` or `if !()` style, not allow If (Expression) variants

  ```ahk
  if a != b ;if legacy
  ; is
  if (a != "b")

  ; also
  if a != b and 1 >0 ;if legacy
  ; is
  if (a != "b and 1 >0")
  ```

- fix: core parser like `Else if ()` , lStr end has space case
- fix: ([#81](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/81)) `OnExit, Label` syntax-highlight / gotoDef/ findAllRef / hover
- feat: ([#80](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/80)) Supports `.ah1` file extension.
- feat: ColorProvider (color-picker) lint

  ```ahk
  a := "Red" ; OK start and end with ""
  friendly := "BLACK/WHITE DITHERED"
  ;            BLACK X is start with ", but not and with "
  ;            WHITE X is in string , but not start and end with ""
  ```

## v0.0.60(2024-06-09)

<!-- pnpm 9.2.0 iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- feat: `Menu` syntax-highlight / semantic-highlight / gotoDef / findAllRef / Completion
- feat: ([#78](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/78)) do not change built-in variables highlight
- feat: `#include` support `%A_WorkingDir%`
- feat: ([#74](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/74)) Path Completion
- fix: ([#75](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/75)) ColorProvider (color-picker) lint with varName
- fix: ([#76](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/76)) ColorProvider (color-picker) with BGR case
- feat: ([#77](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/77)) core ahk-class Property get/set method parser

![alt text](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-60--issuse-77--get-set-parser.jpg)

## v0.0.59(2024-06-03)

<!-- pnpm 9.1.4 iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- feat: ([#73](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/73)) `MsgBox` option add support part2
- feat: ([#72](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/72)) support hover/gotoDef at `Object Types`
- feat: use `.` to completion `InputHook()` Method/Property
- feat: ([#71](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/71)) CallHierarchyProvider (default with `shift + alt + h`)
- fix: ([#64](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/64)) `Hotkey` ref func, can not use gotoDef jump
- fix: ([#68](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/68)) core `Label:` identify with `} label_1:` case
- feat: ([#69](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/69)) `VBA++` with `ComObjActive()`

> ![alt text](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/vbaCompletion.gif)

- other: because `VBA++` pack size , 487 KB -> 2205 KB+
  ...But I think it's worth it, because just open a website and a few pictures will be 1MB.

## v0.0.58(2024-05-25)

<!-- pnpm 9.1.2 iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- feat: hover at `HotStrings` Escape_Sequences show a uri to my-github to show preview.
- fix: ([#65](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/65)) `HotStrings` without `T-flag/R-flag` highlight

> ![alt text](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-58--issuse-65--HotStrings-highlight-1.jpg)
> ![alt text](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-58--issuse-65--HotStrings-highlight-2.png)
> ![alt text](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-58--issuse-65--HotStrings-highlight-3.png)

- fix: ([#67](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/67)) `].` can not show completion
- fix: ([#66](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/66)) color-picker rm `label:` and `MsgBox` Options arg range.
- feat: ([#63](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/63)) diag 8xx is not work with Control Flow Statements
- feat: ([#62](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/62)) `DllCall()` Type Completion
- fix: ([#61](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/61)) format error
- fix: gotoDef with file Module Var
- feat: ([#60](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/60)) `ErrorLevel`
  1. auto find may value
  2. auto add ErrorLevel Template
- feat: ([#54](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/54)) Identify var def with `Gui, +HwndVarName`
- feat: ([#53](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/53)) GuiName++
  1. support `GuiControl` gotoDef/findAllRef
  2. add select and add guiName at ([#59](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/59))
- feat: ([#58](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/58)) hover `MsgBox, 16 ,Title, Text` magic-number

> ![alt text](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-58--issuse-58-hover-msgbox-magic-number.jpg)

## v0.0.57(2024-05-16)

<!-- pnpm 9.1.1 iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- fix: `CHANGELOG.md` year (tks [marius-sucan](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/discussions/25#discussioncomment-9417365))
- fix: ([#57](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/57)) not let `AhkNekoHelp.format.textReplace` work at `if in` case
- feat: ([#55](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/55)) do not change `Clipboard` and `ClipboardAll` highlight
- feat: ([#56](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/56)) `#include` support `A_ScriptDir`
- feat: ([#52](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/52)) diag `if (Expression)` mix `if in` with `c202` `c203` `c204`
- feat: ([#53](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/53)) GuiName++
  1. `3` of `3GuiClose:` highlight look like `3:` at `gui, 3:`
  2. add hover at `3GuiClose:` def pos.
  3. gotoDef findAllRef
- fix: ([#50](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/50)) add support `(0xFFFFFF` case

## v0.0.56(2024-05-13)

<!-- pnpm 9.1.0 iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- feat: better Completion of `MsgBox`
- feat: better gotoDef of `global var :=`
- feat: remove completion `Retry`
- feat: ([#48](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/48)) show var1 ref of `global var1 :=` (via CodeLens)
- feat: ([#49](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/48)) diag global `var1` is assigned but never used `global var1 :=`
- feat: ([#45](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/45)) goto `;@ahk2exe-set` def-json
- fix: hover at `;@Ahk2Exe-SetLegalTrademarks` if has space before `;` case.
- fix: ([#51](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/45)) core parser error class has `#Directives` case
- feat: ([#50](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/50)) colorProvider (color-picker)

> ![alt text](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-56--issuse-50--color-picker.jpg)
>
> <https://www.youtube.com/watch?v=Vi1AQxeKF2Y>

## v0.0.55(2024-04-26)

<!-- pnpm 9.0.6  iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- feat:([#47](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/47)) InlayHints Cmd-param provide hover
  ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-55--2-hover-at-cmd-param-InlayHints.jpg)

- feat:([#46](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/46)) add hover at Hotkeys `~F12::`.
  ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-55--1-hover-at-hotkey.jpg)

- feat:([#45](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/45))
  1. support zn-ch(中文)
  2. support goto built-in doc
  3. add new config

  ```jsonc
  {
      "AhkNekoHelp.doc.language": "en" // "zh-cn" or "auto"
  }
  ```

## v0.0.54(2024-04-10)

<!-- pnpm 8.10.2 -->
<!-- dprint 0.41.0 -->

- fix:([#41](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/41))
  1. inlint hint not follow leading 0's at `cmd` case.

- feat: ([#43](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/43)) InlayHint add padding
- feat: ([#44](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/44)) add Chinese support.

## <= 0.0.53(before 2024)

> [CHANGELOG-2023](./CHANGELOG-2023.md)
