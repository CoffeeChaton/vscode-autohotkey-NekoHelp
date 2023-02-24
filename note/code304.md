# code304 warn avoid def-func-name look like Flow Of Control

- This is undoubtedly legal and runnable code, but extremely unfriendly to static code review, especially in the case of git diff, with syntax highlighting turned off.

  ```ahk
    else()
    GoSub()

    else(){ ; define a function name as else
      MsgBox % "i am else func..."
    }

    GoSub() { ; define a function name as GoSub
      MsgBox % "i am GoSub func..."
    }
  ```

- It is also possible that an accidental mis-definition of a function may make debugging difficult.

  ```ahk
  ; edge case
  ;ahk start


  ;@after 3000+line && edge case

  Random, a, 0, 100 ; Simulation Edge Case, exp: network instability
  MsgBox, % "a is " a
  if (a>1) {
      MsgBox, % "99% case"
  } else() { ;Unexpectedly define a function and name it "else"
      MsgBox, % "1% case" ;never run this line, with out call `esle()`
      ; do something to solve 1% case , for example, safely shut down the client, but not run
  }
  ```

- Trigger conditions

  a function defined name looks like ban name list

  ```js
  // a function defined name looks
  const banName = [
      'Break',
      'Case',
      'Catch',
      'Continue',
      'Critical',
      'Default',
      'Else',
      'Exit',
      'ExitApp',
      'Finally',
      'For',
      'GoSub',
      'Goto',
      // 'If', ahk-v1 [`IF` `While` cannot be defined as a function](https://github.com/AutoHotkey/AutoHotkey/blob/v1.1/source/script.cpp#L1404)
      'IfMsgBox',
      'Loop',
      'Pause',
      'Reload',
      'Return',
      'Switch',
      'Throw',
      'Try',
      'Until',
      // 'While', ahk-v1 [`IF` `While` cannot be defined as a function](https://github.com/AutoHotkey/AutoHotkey/blob/v1.1/source/script.cpp#L1404)
  ];
  ```
