# Changelog

- [Changelog](#changelog)
  - [Next v0.0.45(2023-06-XX)](#next-v00452023-06-xx)
  - [v0.0.44(2023-06-12)](#v00442023-06-12)
  - [v0.0.43(2023-06-04)](#v00432023-06-04)
  - [v0.0.42(2023-05-29)](#v00422023-05-29)
  - [v0.0.41(2023-05-22)](#v00412023-05-22)
  - [v0.0.40(2023-05-09)](#v00402023-05-09)
  - [v0.0.39(2023-05-01)](#v00392023-05-01)
  - [v0.0.38(2023-04-30)](#v00382023-04-30)
  - [v0.0.37(2023-04-23)](#v00372023-04-23)
  - [v0.0.36(2023-04-23)](#v00362023-04-23)
  - [v0.0.35(2023-04-16)](#v00352023-04-16)
  - [v0.0.34(2023-04-08)](#v00342023-04-08)
  - [v0.0.33(2023-04-02)](#v00332023-04-02)
  - [v0.0.32(2023-04-01)](#v00322023-04-01)
  - [v0.0.31(2023-03-24)](#v00312023-03-24)
  - [v0.0.30(2023-03-19)](#v00302023-03-19)
  - [v0.0.29(2023-03-15)](#v00292023-03-15)
  - [0.0.28(2023-03-13)](#00282023-03-13)
  - [0.0.27(2023-03-11)](#00272023-03-11)
  - [0.0.26(2023-03-04)](#00262023-03-04)
  - [0.0.25(2023-02-26)](#00252023-02-26)
  - [0.0.24(2023-02-24)](#00242023-02-24)
  - [\<= 0.0.23(2023-02-17)](#-00232023-02-17)

## Next v0.0.45(2023-06-XX)

<!--
dprint 0.37.1
pnpm v8.6.2
-->

- feat: [#11](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/11) pseudo-array support `StringSplit`
- feat: [#16](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/16)
  1. cover more built-in variables like `%A_WinDir%`
  2. hover `#include` show may path
     ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-45-hover-include-path.png)
  3. try support `#include d:\folder\` like `#Include %A_Desktop%` and del `"AhkNekoHelp.files.tryParserIncludeLog.not_support_include_directory"`

- perf: [#20](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/20) avoid duplicate parsing
- fix: syntax-highlight of `gui,add, Control`
  ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-45-gui-add.png)

## v0.0.44(2023-06-12)

- feat: [#16](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/16)
  1. support syntax-highlight of (**\`;**).
  2. support `%A_Tab%` `%A_Space%` of gotoDef/ Completion.
  3. support `%A_Desktop%` of gotoDef/ Completion.

- feat: Directory whiteList Settings [#21](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/21)

  ```jsonc
  { // settings.json
      "AhkNekoHelp.files.alwaysIncludeFolder": [
          "D:\\Q2", // folder path
          "D:/Q3" // use Linux-style separator Char is OK
      ] // string[] as path[]
  }
  ```

- fix: core comment parsing order [#20](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/20)
  > Even `;` is wrapped by `""`, it is still parsed as a comment.

  ```ahk
  #Requires AutoHotkey v1.1.33+
  #Warn All, MsgBox
  sText := "; ;"
  ;          ^^^ this comment, not string
  sText := "; `;"
  ```

- feat: diag `c514` of [#14](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/14)
  > diag : [warn] PrefixEventName() and ComObjConnect should be in the same file.

  ```ahk
  ComObjConnect(ie, "IE_")

  IE_DocumentComplete(ieEventParam, url, ieFinalParam) {
  ;^ IE_ ---------------> Prefix
  ;  ^DocumentComplete -> EventName

  }
  ```

- feat: support [Hotkey remap](https://www.autohotkey.com/docs/v1/HotkeyFeatures.htm#easy-to-reach) && [Remapping Keys](https://www.autohotkey.com/docs/v1/misc/Remap.htm)
  1. semantic-highlight
  2. `ctrl+t` support
  3. Outline

- feat: add hover of focEx `between contains in is` or `Files Parse Read Reg`

  ```ahk
  if var between 1 and 5
  if var contains 1,3
  if var in exe,bat,com
  if var is float
  Loop, Files ; hover at Files
  Loop, Parse
  Loop, Read
  Loop, Reg
  ```

  ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-44-hover-foc-ex-param.png)

- fix: syntax-highlight of `HKEY_LOCAL_MACHINE`

  ```ahk
  Loop, Reg, HKEY_CURRENT_USER\Software\Microsoft\Windows, KVR
  { ;        ^ HKEY_LOCAL_MACHINE syntax-highlight
    /*
    'HKEY_LOCAL_MACHINE',
    'HKEY_USERS',
    'HKEY_CURRENT_USER',
    'HKEY_CLASSES_ROOT',
    'HKEY_CURRENT_CONFIG',
    */
  }
  ```

- fix : syntax-highlight of `#if ;`

  ```ahk
  #if foo() ;;===========
  WheelUp:: bar()
  #if ;;======
  ;   ^^ fix it now
  ```

- fix: key like `shift` syntax-highlight, not highlight at `MsgBox` and `expression` line

- fix: `2joy1` ~ `16joy1` syntax-highlight and parser
  > ([read doc](https://www.autohotkey.com/docs/v1/KeyList.htm#Controller))
  > **Multiple controllers**: If the computer has more than one controller and you want to use one beyond the first, include the controller number (max 16) in front of the control name. For example, 2joy1 is the second controller's first button.

- dev: generate snapshot order change
  1. `"esbuild": "^0.17.19"` -> `"esbuild": "^0.18.0"`
  2. esbuild `useDefineForClassFields` behavior has changed

## v0.0.43(2023-06-04)

- feat: add some sign of cmd
  - `"AhkNekoHelp.signatureHelp.CmdShowParamInfo"` not need to restart vscode now.
  - cover `100%` cmd sign now.
  - feat: support sing-start-with-out-cmd
    ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-43-sing-start-with-out-cmd.png)
  - fix: sign first optional comma, pin position.
  - if param > first sign , try auto switch of cmd sign. exp: `MsgBox , Options, Title, Text, Timeout`
  - overload sign, cover `100%`

    ```ahk
    ; OK
    MsgBox [, Options, Title, Text, Timeout_Sec]
    Random, (blank), NewSeed
    Hotkey, IfWinActive|IfWinExist|IfWinNotActive|IfWinNotExist [, WinTitle, WinText]
    Hotkey, If [, Expression]
    Hotkey, If, % FunctionObject
    IniRead, OutputVarSection, Filename, Section
    IniRead, OutputVarSectionNames, Filename
    IniWrite, Pairs, Filename, Section
    SplashImage, Off
    Progress, Off
    WinMove, X, Y
    WinSetTitle, NewTitle

    ; Old Syntax not plan to support
    RegDelete, RootKey, SubKey , ValueName
    RegRead, OutputVar, RootKey, SubKey , ValueName
    RegWrite, ValueType, RootKey, SubKey , ValueName, Value
    ```

- feat: `command`
  1. completion not enter `[]` , use signatureHelp replace it now.
  2. hover-doc and completion-doc, show signature like ahk-doc, not like snippet now.
     ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-43-CMD-doc.png)

- feat: add [ControlGet](https://www.autohotkey.com/docs/v1/lib/ControlGet.htm) SubCommand
  1. syntax-highlight ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-43-ControlGet.png)
  2. completion (default: `false`)
  3. hover

## v0.0.42(2023-05-29)

- api-change
  1. del `"AhkNekoHelp.customize.signatureHelp"`
  2. add

  ```jsonc
  {
      "AhkNekoHelp.signatureHelp.insertType": true, // false
      "AhkNekoHelp.signatureHelp.showParamInfo": true, // false
      "AhkNekoHelp.signatureHelp.showOtherDoc": true, // false
      "AhkNekoHelp.signatureHelp.showReturnInfo": true, // false
      "AhkNekoHelp.signatureHelp.ReturnStyle": "auto", // or "always" or "never"
      "AhkNekoHelp.signatureHelp.CmdShowParamInfo": true // false
  }
  ```

- feat: add some sign of cmd
  - cover `34%` now.
  - overload sign

    ```ahk
    ; OK
    MsgBox
    Random
    Hotkey

    ; support at v0.0.43(2023-06-04)
    IniRead
    IniWrite
    SplashImage
    Progress
    WinMove
    WinSetTitle
    ```

- feat: `func` generate `ahkDoc`
  >
  > 1. api-change `@Return` -> `@returns`
  > 2. `@param` can generate type from default value
     > ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/func_yellow_light_bulb_add_ahkDoc2.gif)

- feat: hover and snip, read ahkDoc `@param` data
- feat: add `"AhkNekoHelp.customize.signatureHelpInsertType"`, [4k 36 sec](https://youtu.be/HxjzRf7stpA)
- feat: add `Return` -> `func` def, if `func` not has `label:` then support Go-to-func-Definition on `return` Keywords
- feat: completions in `/**` JsDocTag like `"@readonly"` `"@alias"` ...etc
- feat: syntax-highlight copy `jsdoc` from [microsoft/TypeScript-TmLanguage](https://github.com/microsoft/TypeScript-TmLanguage/commit/644389aef914fc6fbc97a4dd799cc2d1431ffc87)
  > like 'inline-tags', 'brackets', 'jsdoctype', 'docblock' code
  > [copy part](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/commit/927fc95e9276fbecb7278b819a387858b82e249f#diff-4533e36eb3828b3869b9e7fd72557f24697f5916158b6d8e7529ba674fc8d7cd)
- fix: syntax-highlight of `,ByRef` or `)or`

## v0.0.41(2023-05-22)

- feat: syntax-highlight of `#include` all start with `A_` built-in variables like `A_AhkPath` etc...
  > ([doc-FileOrDirName](https://www.autohotkey.com/docs/v1/lib/_Include.htm#Parameters)) Percent signs which are not part of a valid variable reference are interpreted literally. All built-in variables are valid, except for ErrorLevel, A_Args and the numbered variables
- fix: goto def of `#include` underlined span for mouse definition hover. [#12 ex12](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/12#issuecomment-1555929041)
- feat: add triggerCharacters `\` and `.` to call Completion. [#12 ex](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/12#issuecomment-1555474420)
- fix: complete `#include path` auto del `.` or `\`
- feat: add option `"AhkNekoHelp.snippets.fromOtherFile"` to limit completion other files func/class.
- feat: add semantic-highlight of `class` reference
- fix: syntax-highlight of `new class_name` and `new class_name()`
- fix: avoid `vscode.workspace.onDidChangeTextDocument` listener `log` or `other lang` event...
- feat: [#12](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/12) part-7 , try Parser `#include` Data.
  1. via `"AhkNekoHelp.files.tryParserIncludeOpt"`
  2. Avoid infinite loop parsing
- fix: format

  ```ahk
  ;old code
  if (a = 4
          and b = 5) {
          MsgBox
      MsgBox
  }

  ;new code
  if (a = 4
      and b = 5) {
      MsgBox
      MsgBox
  }
  ```

## v0.0.40(2023-05-09)

- feat : add `Array := StrSplit()` completion
- `Func Object`
  - fix: remove `__Handle`
  - feat : add dco and exp
- `File Object`
  - fix: uri <https://www.autohotkey.com/docs/v1/objects/File.htm> -> <https://www.autohotkey.com/docs/v1/lib/File.htm>
  - feat : `WriteNumType` and `ReadNumType` streamline
- feat: try serialization fn.ahkDoc Data
- fix: [_Snippet Completions for @param JSDoc Tags_](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp#5-snippet-completions-for-param-doc-tags)
  1. Typo from `@parma` -> `@param`
  2. only provide ahkDoc not has `@param` tags. (looks gif)
  > ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/snippet_completions_for_@param_doc_tags.gif)
- feat: func yellow light bulb `add ahkDoc`
  > ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/func_yellow_light_bulb_add_ahkDoc.gif)
- feat: auto add `*` in `ahkDoc Range` (like `typescript` onEnterRules)
- [#14](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/14)
  > <https://www.autohotkey.com/docs/v1/lib/ComObjConnect.htm#Usage>

  ```ahk
  ComObjConnect(ie, "IE_")

  IE_DocumentComplete(ieEventParam, url, ieFinalParam) {
  ;^^ -----------------> Prefix
  ;  ^^^^^^^^^^^^^^^^ -> EventName
  }
  ; oh my god ... thanks for ahk = =
  ```

  - gotoDef (`"IE_"` -> `IE_DocumentComplete`)
  - findAllRef (`IE_DocumentComplete` -> `"IE_"`)
  - CodeLens of `"IE_"` (via `"AhkNekoHelp.CodeLens.showComObjConnectRegisterStrReference"`, default: `true`)
  - rename warn, just a quick warning, as it is very rare to consider the case.

## v0.0.39(2023-05-01)

- feat: add return value of `BiFunc`
- fix: `label:` findAllRef

## v0.0.38(2023-04-30)

- fix: `global Val` findAllRef with unicode case
- perf: `global Val` findAllRef
- feat: add `label:` CodeLens (via: `"AhkNekoHelp.CodeLens.showLabelReference"`)
- perf: `label:` hover/gotoDef/findAllRef
- refactor: like <https://github.com/AutoHotkey/AutoHotkeyDocs/blob/v1/docs/static/source/data_index.js> and <https://github.com/AutoHotkey/AutoHotkeyDocs/blob/v1/docs/static/content.js#L1792>
- feat: format-all-file `'select command first optional comma style'` only show if `"AhkNekoHelp.format.removeFirstCommaCommand" > 0`.
- feat: add [WinSet](https://www.autohotkey.com/docs/v1/lib/WinSet.htm) SubCommand
  1. syntax-highlight
  2. completion (default: `false`)
  3. hover
- feat: add [WinGet](https://www.autohotkey.com/docs/v1/lib/WinGet.htm#SubCommands) SubCommand
  1. syntax-highlight
  2. completion (default: `false`)
  3. hover
- feat: add [Control](https://www.autohotkey.com/docs/v1/lib/Control.htm) SubCommand
  1. syntax-highlight
  2. completion (default: `false`)
  3. hover
- feat: sub-cmd completion `[` -> `,[$0`
- fix: `hotkey, if` and `hotkey, key` syntax-highlight
  ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-38-hotkey.png)
- fix: `Gui` option `Range` syntax-highlight
  ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-38-gui-opt-range.png)
- fix: `GuiName` of `Gui, GuiName:New , Options, Title` with +-Options syntax-highlight
  ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-38-gui-gui-name.png)
- [issues #12](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/12#issuecomment-1503682757) style
  - part-8

    ```jsonc
    "AhkNekoHelp.method": {
       "gotoDef": "precision_mode", // v0.0.36(2023-04-23)
       "hover": "precision_mode", // v0.0.36(2023-04-23)
       "findAllRef": "precision_mode", // v0.0.38
       "CodeLens": "none" // v0.0.38
     }
    ```

- feat: support the `__New()` of `magic_method` - findAllRef / CodeLens support

  ```js
  let magic_method = [
      // support method
      '__New meta-function', // https://www.autohotkey.com/docs/v1/Objects.htm#Custom_NewDelete

      // not plan to support
      '__Get meta-function', // https://www.autohotkey.com/docs/v1/Objects.htm#Meta_Functions
      '__Set meta-function', // https://www.autohotkey.com/docs/v1/Objects.htm#Meta_Functions
      '__Call meta-function', // https://www.autohotkey.com/docs/v1/Objects.htm#Meta_Functions
      '__Delete meta-function', // https://www.autohotkey.com/docs/v1/Objects.htm#Custom_NewDelete
      '__Handle property (File)', // https://www.autohotkey.com/docs/v1/lib/File.htm#__Handle
      '__Init method', // 'https://www.autohotkey.com/docs/v1/Objects.htm#Custom_Classes_var'
  ];
  ```

## v0.0.37(2023-04-23)

- feat: the `@Ahk2Exe` of `;@Ahk2Exe-XXX` provide semantics as `"other.customize.keyword.comment.ahk2exe.ahk"`

  <details>
    <summary>settings.json</summary>

  ```jsonc
  // settings.json
  {
      "editor.tokenColorCustomizations": {
          "textMateRules": [
              {
                  "scope": "other.customize.keyword.comment.ahk2exe.ahk",
                  "settings": {
                      "foreground": "#C678DD"
                  }
              }
          ]
      }
  }
  ```

  > <https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/12#issuecomment-1518496989>
  </details>

## v0.0.36(2023-04-23)

- feat: add [Quick Log Msg](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp#quick-log-msg)
- feat: add _Go to Definition_ and _hover_ of `xxx.Method(` via `"AhkNekoHelp.method"` [doc](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/config/method.md)
  1. only _Completion_ support `class in class` , other not yet supported.
- feat: snippet Completions for @param JSDoc Tags
  > reference <https://devblogs.microsoft.com/typescript/announcing-typescript-5-1-beta/#snippet-completions-for-param-jsdoc-tags>
- fix: don't provide snippet completions in comment
  1. SubCommand like: `Gui` `GuiControl` `Menu` `SysGet`
  2. otherKeyword1 like: `Class` `Static` `Global` `Local`
  3. flow of control like: `Continue` `if` `else`
  4. Flow of Control plus like : `IfBetween` `LoopFiles`
  5. Special Keys like : `{Text}` `{Up}`
- fix: sign of use-function not any return value miss `}` case.
- feat: sign calc `[]` and `{}` , at function arguments.
  > `foo(a, [0,1,2,3], {k:"v",k2:"v2"}, d)`
  > ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/sign.gif)

## v0.0.35(2023-04-16)

1. api-change `AhkNekoHelp.baseScan.IgnoredList` -> `AhkNekoHelp.files.exclude`
2. license: update to LGPL-3.0 (<https://github.com/helsmy/vscode-autohotkey/issues/17>)
3. [issues #12](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/12#issuecomment-1503682757) style
   1. part-1 of #12
      - [youtube 4k 2min](https://www.youtube.com/watch?v=clvD7z7YjHM)
      - [x] user-defined-functions style, via: `"AhkNekoHelp.customize.signatureHelp"` [Read more](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/config/customize.signatureHelp.md)
      - [x] build-in-functions , (0/111)
   2. part-2 of #12 , via: `"AhkNekoHelp.customize.HoverFunctionDocStyle"`
   3. part-3 of #12 , via: `"AhkNekoHelp.SymbolProvider.showInclude"`
   4. part-4 of #12 , change to string color
   5. part-5 of #12, _Go to Definition_ of `#Include c:\DEV\dev_main_P7\ahk_test.ahk` (just support `absolute path` and start with `%A_LineFile%\` style)
   6. part-6 of #12, parsing error at via `.` completion
   7. _skip
   8. part-8
      1. [x] class : find all references && CodeLens via (`"AhkNekoHelp.CodeLens.showClassReference"`)
      2. [x] method : not support it now

4. [issues #13](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/13) object key syntax-highlight

   > 4 of 7 fixed

   ```ahk
   xyz := ""
   obj := [foo, bar, baz, continue]
   ;                      ^^^^^^^^^ fix
   obj := { foo: true, bar: xyz, baz: 000, continue: "string" }
   ;                                       ^^^^^^^^ fix
   obj := { true: "Yes", false: "No", null: ""}
   ;        ^^^^         ^^^^^ Shouldn't be Highlighted
   obj := { Click: "", MsgBox: "" }
   ;        ^^^^^ Shouldn't be Highlighted

   obj := { local: "OK" }
   ;        ^^^^^ fix
   obj := { global : "NOT OK"}
   ;        ^^^^^^ fix
   ```

5. other
   - feat: add `CLSID` hover/Completion [(youtube 4K 1min)](https://www.youtube.com/watch?v=mwzmmMJxax0)
   - feat: remove hover `numbers` to guess `winMsg`.
   - feat: find all ref of `class` use cache
   - fix: find all ref of `class` after support unicode-name
   - fix: hover the var of `some%var%` case
   - fix: via `.` completion error (with .ahk not any class/function)
   - fix: keyList Completion Data
   - fix: core hotkey line Parsing
   - fix: `hotkey` syntax-highlight, thanks of [helsmy](https://github.com/helsmy/vscode-autohotkey/issues/17)

## v0.0.34(2023-04-08)

1. api-change

   1. `AhkNekoHelp.baseScan.IgnoredList` -> `AhkNekoHelp.files.exclude`
   2. `AhkNekoHelp.snippets.blockFilesList` -> `AhkNekoHelp.snippets.exclude`
   3. `AhkNekoHelp.snippets.expandSubCommand` -> `AhkNekoHelp.snippets.subCmdPlus`

2. sign

   - feat: add sign of build-in function
   - fix: sign of func last-param is [variadic](https://www.autohotkey.com/docs/v1/Functions.htm#Variadic) case.
   - fix: sign of nested function (4k 90-sec)<https://youtu.be/WcMzNcVWcYA>
   - fix: not show sign at func/method def-range

3. fix

   - feat: not complete fn/class has `#` exp: `#foo()` need to use the `foo` call complete.
   - fix: complete of func/class starts with `#@$` duplicate insertion problem.
   - feat: `c501` ignore `isByRef` param
   - feat: `c500` ignore `PCRE_CallOut` var-name
   - feat: add [SysGet](https://www.autohotkey.com/docs/v1/lib/SysGet.htm) SubCommand
     1. syntax-highlight
     2. completion
     3. hover
   - feat: add format option as `AhkNekoHelp.format.removeFirstCommaCommand`
   - feat: cmd - `format all file` add option to select `AhkNekoHelp.format.removeFirstCommaCommand`
   - fix: support 4-style of `(?CNumber:Function)` <https://www.autohotkey.com/docs/v1/misc/RegExCallout.htm#syntax>
     1. `(?CFuncCallOut)`
     2. `(?C:FuncCallOut)`
     3. `(?CNumber:FuncCallOut)`
     4. `(?CNumber)`
        ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-34-regular-expression-call-outs.png)
   - fix: core `+= -= *= ...etc` from `ref` -> `def` , to fix `c500` case
   - fix: core switch-default
   - fix: variable reference range identification
     > ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-34-variable-reference-range-identification.png)
     > ![img2](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-34-variable-reference-range-identification-2.png)

   - fix: core command vs Assign ...

     ```ahk
     #Requires AutoHotkey v1.1.33+

     ; all is variables
     MsgBox := 1
     MsgBox += 1
     MsgBox -= 1
     MsgBox *=1
     MsgBox /=1
     MsgBox //=1
     MsgBox .= 1
     MsgBox |=1
     MsgBox &=1
     MsgBox ^=1
     MsgBox >>=1
     MsgBox <<=1
     MsgBox >>>=1
     ```

     ```ahk
     #Requires AutoHotkey v1.1.33+

     ; all is command
     MsgBox, = 1
     MsgBox, := 1
     MsgBox, += 1
     MsgBox, -= 1
     MsgBox, *=1
     MsgBox, /=1
     MsgBox, //=1
     MsgBox, .= 1
     MsgBox, |=1
     MsgBox, &=1
     MsgBox, ^=1
     MsgBox, >>=1
     MsgBox, <<=1
     MsgBox, >>>=1
     ```

## v0.0.33(2023-04-02)

- fix: syntax-highlight class unicode-name
- feat: Snapshot use min `10` ms to Reduce diff interference
- fix: if `.` Completion find `catch error` then end
- fix: param parser error (True/false)

  ```ahk
  fn_exp(ByRef a, b := false, c := true) {

  }
  ```

## v0.0.32(2023-04-01)

- feat: limit `.` Completion range of file top level
  > now it is fix, when using `.` for code completion outside the function/method Range, the situation inside the function is accidentally tracked.
- fix: `Switch Case` range error
- fix: parser `#Directives` && remove `code603` as `unknown #Directives in ahk-v1` ... because of `#1 := 2`
- feat: try to add unicode-name support [#8-1](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/8)
  - part 8-1: add unicode-name with utf-16 Plane 0 `/^[#$@\w\u{A1}-\u{FFFF}]+$/iu`
  - add `ToUpCase()` of Case sensitivity <https://www.autohotkey.com/docs/v1/Concepts.htm#names>
    >
    > 1. None for ASCII characters. For example, CurrentDate is the same as currentdate.
    > 2. However, uppercase non - ASCII characters such as 'Ä' are not considered equal to their lowercase counterparts

- feat: add `Signature` of `user-def-function` , but `built-in function` and `command` not yet.

## v0.0.31(2023-03-24)

- feat: [#7](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/7)
  - [x] part 3-3, add format opt, format the signature format for the ahk-v1.1 online documentation, by remove [#Directive](https://www.autohotkey.com/docs/v1/lib/#hash) first optional comma, read doc [removeFirstCommaDirective](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/config/format.removeFirstCommaDirective.md)
  - [x] part 3-4, fix: Adjusted completion - the part about `#Directive`, conforming to the signature of the document (meaning there is no first optional comma).
- fix: `{{}` or `{}}` bracket pair error syntax-highlight, exp [`Send {{}`](https://www.autohotkey.com/docs/v1/lib/Send.htm#keynames)
  ![fix Bracket pair](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-31-bracket-pair.png)
- fix: class/functions range

  ```ahk
  if (1 > 0){
  } else { MsgBox % "err"
  ;      ^ "{" is not end with line ...}
  }

  Try { MsgBox, % "try"
  ;   ^ "{" is not end with line ...}
  } Catch error {

  } Finally { MsgBox, % "Finally"
  ;         ^ "{" is not end with line ...}
  }
  ```

- feat: add diag [code118](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/code118.md) and auto fix it.

  ```ahk
  #Warn, All, MsgBox

  foo(4)
  ; 

  foo(key) {
      MsgBox, % "key is " key
      i := 0
      Switch key {
          Case 0: { i := 999 ; skip `i := 999` && `#Warn` not work
          ;        ^^^^^^^^^^ diag this as code118
                  MsgBox, % "case0"
          }
          Case 1: {
                  MsgBox, % "case1-2"
              }
              MsgBox, % "case1-3"
          Case 2, 3: MsgBox, % "case2-1" ; normal work
              MsgBox, % "case2-2"
          Default:
                  MsgBox, % "Default-1"
                  MsgBox, % "Default-2"
      }

      ListLines
      MsgBox, % "i is " i
  }
  ```

- feat: add diag code507, avoid set `number` as variable [note](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/code507.md)
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
- feat: devTools add `generate snapshot`

## v0.0.30(2023-03-19)

- fix: format `Alpha test options`
  1. avoid working at `SecondWordUp` line.
  2. fix avoid `!==` -> `!= =` now
- fix: [#7](https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/7)
  - [x] part 1, parsing error of Command OutputVar
  - [x] ~~part 3-1, need some time to fix unit-test, Help users tab to `$0`~~, `$0` is need to use at part 4-2
  - [x] part 3-2, add select CodeAction(_yellow light bulb_) to format it
  - [x] part 4-1, fix `ListLines` now
  - [x] part 4-2, let `[` -> `,[$0` , this helps users to tab to delete this, and using unit-test.
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

  ![img](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-29-fix-old-set-var.png)

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

- fix: identify variable ![exp](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-27-fix-identify-variable.jpg)
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
  ![hover at menu sub-cmd](https://raw.githubusercontent.com/CoffeeChaton/vscode-autohotkey-NekoHelp/main/image/Changelog/v0-0-26-hover-at-menu-sub-cmd.png)
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
