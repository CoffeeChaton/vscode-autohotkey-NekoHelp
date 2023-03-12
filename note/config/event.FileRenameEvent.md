# event.FileRenameEvent

| option     | describe                         |
| ---------- | :------------------------------- |
| 0(default) | log at background                |
| 1          | log and show                     |
| 2(beta)    | log and try to Rename `#Include` |

## beta test exp

1. **warn** this option is not support at _file-path_ or `#Include` has any `special char` (like `;` or `,`).
2. In any case, please manually confirm whether there is a wrong way to change, or should be changed but no.
