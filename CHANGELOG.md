# Changelog

- [Changelog](#changelog)
  - [v0.0.56(2023-05-XX)](#v00562023-05-xx)
  - [v0.0.55(2023-04-26)](#v00552023-04-26)
  - [v0.0.54(2023-04-10)](#v00542023-04-10)
  - [\<= 0.0.53(before 2024)](#-0053before-2024)

## v0.0.56(2023-05-XX)

<!-- pnpm 9.1.0 iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- TODO: hover at `;@ahk-neko-format-inline-spacing-ignore-end`
- feat: better Completion of `MsgBox`
- feat: better gotoDef of `global var :=`
- feat: ([#48](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/48)) show var1 ref of `global var1 :=` (via CodeLens)
- feat: ([#49](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/48)) diag global `var1` is assigned but never used `global var1 :=`
- feat: ([#45](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/45)) goto `;@ahk2exe-set` def-json
- fix: hover at `;@Ahk2Exe-SetLegalTrademarks` if has space before `;` case.
- fix: ([#51](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/45)) core parser error class has `#Directives` case
- feat: ([#50](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/50)) colorProvider (color-picker)

> ![alt text](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-56--issuse-50--color-picker.jpg)
>
> <https://www.youtube.com/watch?v=Vi1AQxeKF2Y>

## v0.0.55(2023-04-26)

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

## v0.0.54(2023-04-10)

<!-- pnpm 8.10.2 -->
<!-- dprint 0.41.0 -->

- fix:([#41](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/41))
  1. inlint hint not follow leading 0's at `cmd` case.

- feat: ([#43](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/43)) InlayHint add padding
- feat: ([#44](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/44)) add Chinese support.

## <= 0.0.53(before 2024)

> [CHANGELOG-2023](./CHANGELOG-2023.md)
