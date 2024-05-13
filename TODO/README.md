# TODO TODO list

- [diag of `If Var op Value`](https://www.autohotkey.com/docs/v1/Language.htm#if-statement)
- add diag auto check of `catch{} ;null catch`
- add hover of `;@ahk-neko-ignore`

- check this mean [A_EventInfo](https://www.autohotkey.com/docs/v1/Variables.htm#EventInfo)
  >
  > - add diag `OnMessage(MsgNumber , fn)` fn-param-lint
  > - The OnClipboardChange label
  > - Mouse wheel hotkeys (WheelDown/Up/Left/Right)
  > - OnMessage()
  > - RegisterCallback()
  > - Regular Expression Callouts
  > - GUI events, namely GuiContextMenu, GuiDropFiles, ListBox, ListView, TreeView, and StatusBar. If there is no additional information for an event, A_EventInfo contains 0.

- [info magic of `,`](https://www.autohotkey.com/docs/v1/Variables.htm#comma) ex: `x:=1, y=2, a=b=c` or `x:=1, %y%=2`
- Parser: -> AST
- Scanner: -> Token
- test: add vscode.test
- auto-fix of code107

```ahk
a = %i%
a = 0
a =
a = -5
a = 0x25
```

```ahk
Loop, Parse, clipboard, `n, `r
{
    MsgBox, 4, ,% "File number " A_Index " is " A_LoopField ".`n`nContinue?"
    IfMsgBox, No, break
    ;______________^
}
```

// TODO obj fn()

// -------
// ComObjEnwrap()',
// ComObjMissing()',
// ComObjParameter()',
// ComObjUnwrap()',
// Object()',
// ObjClone()
// ObjCount()
// ObjDelete()
// ObjGetAddress()
// ObjGetCapacity()
// ObjHasKey()
// ObjInsert()
// ObjInsertAt()
// ObjLength()
// ObjMaxIndex()
// ObjMinIndex()
// ObjNewEnum()
// ObjPop()
// ObjPush()
// ObjRemove()
// ObjRemoveAt()
// ObjSetCapacity()
// These functions are equivalent to built-in methods of the Object type. It is usually recommended to use the corresponding method instead.
<https://www.autohotkey.com/docs/v1/lib/index.htm>

Object
<https://www.autohotkey.com/docs/v1/lib/RegExMatch.htm#MatchObject>

<!-- - not add file Watcher!
  >
  > - The file watcher only real purpose is to watch for files that might change outside of VSCode.<https://github.com/Gruntfuggly/todo-tree/issues/636#issuecomment-1343341793>
  > - Even M$, it took a lot of time to announce the use of<https://devblogs.microsoft.com/typescript/announcing-typescript-4-9-beta/#file-watching-changes> -->

<!-- - [not use switch in js](https://github.com/microsoft/TypeScript/pull/50225) -->
<!-- - more diag of `fn()` or `label:` are using but not find def, _Deprecated_ now, ahk's diagnostics at startup, seems to be enough -->

<https://github.com/microsoft/vscode/wiki/Virtual-Workspaces>
<https://github.com/microsoft/language-server-protocol/issues/1264>

- lint : Limit foc complementary positions ( `if` `for` `else` )
