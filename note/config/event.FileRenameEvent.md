# event.FileRenameEvent

| option                  | describe                         |
| ----------------------- | :------------------------------- |
| 0(default)              | log at background                |
| 1                       | log and show                     |
| 2(`Alpha test options`) | log and try to Rename `#Include` |

## option 0

1. just log at background, if you want to undo, you can try to open _OUTPUT BOX_ (default via `ctrl shift u`) to see log.

## option 1

1. log and show, if you often renamed/move files, but forgot to fix `#Include`, I recommend this.

## option 2

1. **warn** this option is not support at _file-path_ or `#Include` has any `special char` (like `;` or `,`).
2. In any case, please manually confirm whether there is a wrong way to change, or should be changed but no.

- [ ] support move/rename fold
- [ ] support move file
- [x] try to auto-edit rename file

loop exp <https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/image/event.FileRenameEvent/option2.mp4>
