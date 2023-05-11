# file.tryParserInclude

try Parser `#Include` to add `.ahk` data.

1. _warn!_ this option is allow this extension try to the get file information by `#include` without workspaces. ([ReadMore](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp#privacy-statement))
2. still respect `"AhkNekoHelp.files.exclude"`

## Privacy Statement

this option will break the privacy statement

> just scan workspaces or open file. not auto scan any file without workspaces.
> <https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp#privacy-statement>

## support

1. `Absolute path` like `#Include C:\My Documents\Scripts\Utility Subroutines.ahk`
2. `%A_LineFile% style` like `#Include %A_LineFile%\..\ahk_test.ahk`
3. try to parser `relative path`, like `#Include b.ahk`

## variables

just support `%A_LineFile%` now.
