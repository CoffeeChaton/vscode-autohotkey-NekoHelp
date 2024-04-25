# Changelog

- [Changelog](#changelog)
  - [v0.0.55(2023-04-XX)](#v00552023-04-xx)
  - [v0.0.54(2023-04-10)](#v00542023-04-10)

## v0.0.55(2023-04-XX)

<!-- pnpm 9.0.6  iwr https://get.pnpm.io/install.ps1 -useb | iex-->
<!-- dprint 0.45.1 -->

- feat:([#47](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/47)) InlayHints Cmd-param provide hover
  ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-55--2-hover-at-cmd-param-InlayHints)

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
  ![InlayHint add padding](https://private-user-images.githubusercontent.com/63182963/307564119-7f6e97d7-8584-4c12-afdb-fd7b044fdc84.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTI3MzI1NjAsIm5iZiI6MTcxMjczMjI2MCwicGF0aCI6Ii82MzE4Mjk2My8zMDc1NjQxMTktN2Y2ZTk3ZDctODU4NC00YzEyLWFmZGItZmQ3YjA0NGZkYzg0LmpwZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA0MTAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNDEwVDA2NTc0MFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTc1YjZjMTFiZmZlNzIxNjk2OTQyMzRhNjliYmI5NjIxY2ZkY2I5MWNiOGIwYjYzZGFhNzkyOGUyMDRkZDUwMTImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.sys3HLY24Xmj2ZMC82heZBaQ34NUrLyIYPlGltjHeY8)

- feat: ([#44](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/44)) add Chinese support.
