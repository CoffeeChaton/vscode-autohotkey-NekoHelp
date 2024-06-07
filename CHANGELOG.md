# Changelog

- [Changelog](#changelog)
  - [v0.0.60(2024-06-XX)](#v00602024-06-xx)
  - [v0.0.59(2024-06-03)](#v00592024-06-03)
  - [v0.0.58(2024-05-25)](#v00582024-05-25)
  - [v0.0.57(2024-05-16)](#v00572024-05-16)
  - [v0.0.56(2024-05-13)](#v00562024-05-13)
  - [v0.0.55(2024-04-26)](#v00552024-04-26)
  - [v0.0.54(2024-04-10)](#v00542024-04-10)
  - [\<= 0.0.53(before 2024)](#-0053before-2024)

## v0.0.60(2024-06-XX)

<!-- pnpm 9.2.0 iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- TODO hover path -> show may path
- TODO `Menu` gotoDef/findAllRef
- fix: `Menu` syntax-highlight
- feat: `Menu` Completion
- feat: change default ahk-icon
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
