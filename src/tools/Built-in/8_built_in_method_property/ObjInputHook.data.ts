/* eslint-disable max-lines */
export type TObjInputHook = {
    keyRawName: string,
    insert: string,
    uri: `https://www.autohotkey.com/docs/v1/lib/InputHook.htm#${string}`,
    doc: readonly string[],
    exp: readonly string[],
};

// https://www.autohotkey.com/docs/v1/lib/InputHook.htm#object
//
// The InputHook function returns an InputHook object, which has the following methods and properties.
//
// - [Methods](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Methods):
//     - [KeyOpt](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#KeyOpt): Sets options for a key or list of keys.
//     - [Start](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Start): Starts collecting input.
//     - [Stop](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Stop): Terminates the Input and sets EndReason to the word Stopped.
//     - [Wait](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Wait): Waits until the Input is terminated (InProgress is false).
// - [General Properties](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#General_Properties):
//     - [EndKey](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndKey): Returns the name of the end key which was pressed to terminate the Input.
//     - [EndMods](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndMods): Returns a string of the modifiers which were logically down when Input was terminated.
//     - [EndReason](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndReason): Returns an EndReason string indicating how Input was terminated.
//     - [InProgress](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#InProgress): Returns 1 (true) if the Input is in progress, otherwise 0 (false).
//     - [Input](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Input): Returns any text collected since the last time Input was started.
//     - [Match](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Match): Returns the _MatchList_ item which caused the Input to terminate.
//     - [OnEnd](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnEnd): Retrieves or sets the function object which is called when Input is terminated.
//     - [OnChar](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnChar): Retrieves or sets the function object which is called after a character is added to the input buffer.
//     - [OnKeyDown](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnKeyDown): Retrieves or sets the function object which is called when a notification-enabled key is pressed.
//     - [OnKeyUp](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnKeyUp): Retrieves or sets the function object which is called when a notification-enabled key is released.
// - [Option Properties](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Option_Properties):
//     - [BackspaceIsUndo](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#BackspaceIsUndo): Controls whether the Backspace key removes the most recently pressed character from the end of the Input buffer.
//     - [CaseSensitive](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#CaseSensitive): Controls whether _MatchList_ is case-sensitive.
//     - [FindAnywhere](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#FindAnywhere): Controls whether each match can be a substring of the input text.
//     - [MinSendLevel](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#MinSendLevel): Retrieves or sets the minimum send level of input to collect.
//     - [NotifyNonText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#NotifyNonText): Controls whether the OnKeyDown and OnKeyUp callbacks are called whenever a non-text key is pressed.
//     - [Timeout](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Timeout): Retrieves or sets the timeout value in seconds.
//     - [VisibleNonText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleNonText): Controls whether keys or key combinations which do not produce text are visible (not blocked).
//     -[VisibleText](https:;//www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleText): Controls whether keys or key combinations which produce text are visible (not blocked).

export const ObjInputHook: readonly TObjInputHook[] = [
    // https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Methods
    {
        keyRawName: 'KeyOpt()',
        insert: 'KeyOpt(Keys, KeyOptions)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#KeyOpt',
        doc: [
            'Sets options for a key or list of keys.',
            '',
            '',
            '- Keys',
            '',
            'A list of keys. Braces are used to enclose key names, virtual key codes or scan codes, similar to the [Send](https://www.autohotkey.com/docs/v1/lib/Send.htm) command. For example, `{Enter}.{{}` would apply to <kbd>Enter</kbd>, <kbd>.</kbd> and <kbd>{</kbd>. Specifying a key by name, by `{vkNN}` or by `{scNNN}` may produce three different results; see below for details.',
            '',
            'Specify the string `{All}` (case-insensitive) on its own to apply _KeyOptions_ to all VK and all SC. KeyOpt may then be called a second time to remove options from specific keys.',
            '',
            '- KeyOptions',
            '',
            'One or more of the following single-character options (spaces and tabs are ignored).',
            '',
            '**\\-** (minus): Removes any of the options following the `-`, up to the next `+`.',
            '',
            '**+** (plus): Cancels any previous `-`, otherwise has no effect.',
            '',
            '**E:** End key. If enabled, pressing the key terminates Input, sets [EndReason](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndReason) to the word EndKey and [EndKey](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndKey) to the key\'s normalized name. Unlike the _EndKeys_ parameter, the state of <kbd>Shift</kbd> or <kbd>AltGr</kbd> is ignored. For example, `@` and `2` are both equivalent to `{vk32}` on the US keyboard layout.',
            '',
            '**I:** Ignore text. Any text normally produced by this key is ignored, and the key is treated as a non-text key (see [VisibleNonText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleNonText)). Has no effect if the key normally does not produce text.',
            '',
            '**N:** Notify. Causes the [OnKeyDown](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnKeyDown) and [OnKeyUp](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnKeyUp) callbacks to be called each time the key is pressed.',
            '',
            '**S:** Suppresses (blocks) the key after processing it. This overrides [VisibleText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleText) or [VisibleNonText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleNonText) until `-S` is used. `+S` implies `-V`.',
            '',
            '**V:** Visible. Prevents the key from being suppressed (blocked). This overrides [VisibleText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleText) or [VisibleNonText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleNonText) until `-V` is used. `+V` implies `-S`.',
        ],
        exp: [
            'InputHook.KeyOpt(Keys, KeyOptions)',
        ],
    },
    {
        keyRawName: 'Start()',
        insert: 'Start()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Start',
        doc: [
            'Starts collecting input.',
            '',
            'Has no effect if the Input is already in progress.',
            '',
            'The newly started Input is placed on the top of the [InputHook stack](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#stack), which allows it to override any previously started Input.',
            '',
            'This method installs the [keyboard hook](https://www.autohotkey.com/docs/v1/lib/_InstallKeybdHook.htm) (if it was not already).',
        ],
        exp: [
            'InputHook.Start()',
        ],
    },
    {
        keyRawName: 'Stop()',
        insert: 'Stop()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Stop',
        doc: [
            'Terminates the Input and sets [EndReason](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndReason) to the word Stopped.',
            '',
            'Has no effect if the Input is not in progress.',
        ],
        exp: [
            'InputHook.Stop()',
        ],
    },
    {
        keyRawName: 'Wait()',
        insert: 'Wait([MaxTime])',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Wait',
        doc: [
            'Waits until the Input is terminated ([InProgress](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#InProgress) is false).',
            '',
            '- MaxTime',
            '',
            'If omitted, the wait is indefinitely. Otherwise, specify the maximum number of seconds to wait. If Input is still in progress after _MaxTime_ seconds, the method returns and does not terminate Input.',
        ],
        exp: [
            'EndReason := InputHook.Wait(MaxTime)',
            '; ^ [EndReason](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndReason)',
        ],
    },
    // https://www.autohotkey.com/docs/v1/lib/InputHook.htm#General_Properties
    {
        keyRawName: 'EndKey',
        insert: 'EndKey',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndKey',
        doc: [
            'returns the name of the [end key](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndKeys) which was pressed to terminate the Input.',
            '',
            'Note that EndKey returns the "normalized" name of the key regardless of how it was written in the _EndKeys_ parameter. For example, `{Esc}` and `{vk1B}` both produce `Escape`. [GetKeyName()](https://www.autohotkey.com/docs/v1/lib/GetKey.htm) can be used to retrieve the normalized name.',
            '',
            'If the [E option](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#E) was used, EndKey returns the actual character which was typed (if applicable). Otherwise, the key name is determined according to the script\'s active keyboard layout.',
            '',
            'EndKey returns an empty string if [EndReason](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndReason) is not "EndKey".',
        ],
        exp: [
            'KeyName := InputHook.EndKey',
        ],
    },
    {
        keyRawName: 'EndMods',
        insert: 'EndMods',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndMods',
        doc: [
            'Returns a string of the modifiers which were logically down when Input was terminated.',
            '',
            'If all modifiers were logically down (pressed), the full string is:',
            '',
            '```',
            '<^>^<!>!<+>+<#>#',
            '```',
            '',
            'These modifiers have the same meaning as with [hotkeys](https://www.autohotkey.com/docs/v1/Hotkeys.htm). Each modifier is always qualified with < (left) or > (right). The corresponding key names are: LCtrl, RCtrl, LAlt, RAlt, LShift, RShift, LWin, RWin.',
            '',
            '[InStr()](https://www.autohotkey.com/docs/v1/lib/InStr.htm) can be used to check whether a given modifier (such as `>!` or `^`) is present. The following line can be used to convert _Mods_ to a string of neutral modifiers, such as `^!+#`:',
            '',
            '```ahk',
            'Mods := RegExReplace(Mods, "[<>](.)(?:>\\1)?", "$1")',
            '```',
            '',
            'Due to split-second timing, this property may be more reliable than [GetKeyState](https://www.autohotkey.com/docs/v1/lib/GetKeyState.htm) even if it is used immediately after Input terminates, or in the [OnEnd](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnEnd) callback.',
        ],
        exp: [
            'Mods := InputHook.EndMods',
        ],
    },
    {
        keyRawName: 'EndReason',
        insert: 'EndReason',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndReason',
        doc: [
            'Returns an [EndReason string](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndReasons) indicating how Input was terminated.',
            '',
            'If the Input is still in progress, an empty string is returned.',
            '',
            '',
            'The [EndReason](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndReason) property returns one of the following strings:',
            '',
            '| String  | Description                                                                                                                                                                                                                                                 |',
            '| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |',
            '| Stopped | The [Stop](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Stop) method was called or the [Start](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Start) method has not yet been called for the first time.                                       |',
            '| Max     | The Input reached the maximum allowed length and it does not match any of the items in [_MatchList_](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#MatchList).                                                                                       |',
            '| Timeout | The Input timed out.                                                                                                                                                                                                                                        |',
            '| Match   | The Input matches one of the items in [_MatchList_](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#MatchList). The [Match](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Match) property contains the matched item.                            |',
            '| EndKey  | One of the _EndKeys_ was pressed to terminate the Input. The [EndKey](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndKey) property contains the terminating key name or character without braces. If the Input is in progress, EndReason is blank. |',
        ],
        exp: [
            'Reason := InputHook.EndReason',
        ],
    },
    {
        keyRawName: 'InProgress',
        insert: 'InProgress',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#InProgress',
        doc: [
            'Returns 1 (true) if the Input is in progress, otherwise 0 (false).',
        ],
        exp: [
            'Boolean := InputHook.InProgress',
        ],
    },
    {
        keyRawName: 'Input',
        insert: 'Input',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Input',
        doc: [
            'Returns any text collected since the last time Input was started.',
            '',
            'This property can be used while the Input is in progress, or after it has ended.',
        ],
        exp: [
            'String := InputHook.Input',
        ],
    },
    {
        keyRawName: 'Match',
        insert: 'Match',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Match',
        doc: [
            'Returns the _[MatchList](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#MatchList)_ item which caused the Input to terminate.',
            '',
            'This property returns the matched item with its original case, which may differ from what the user typed if the [C option](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#option-c) was omitted, or an empty string if [EndReason](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndReason) is not "Match".',
        ],
        exp: [
            'String := InputHook.Match',
        ],
    },
    {
        keyRawName: 'OnEnd',
        insert: 'OnEnd',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnEnd',
        doc: [
            'Retrieves or sets the [function object](https://www.autohotkey.com/docs/v1/misc/Functor.htm) which is called when Input is terminated.',
            '',
            '_CurrentFunc_ is _NewFunc_ if assigned, otherwise an empty string.',
            '',
            '_NewFunc_ is the [function object](https://www.autohotkey.com/docs/v1/misc/Functor.htm) to call, e.g. `[Func](https://www.autohotkey.com/docs/v1/lib/Func.htm#Func)("MyCallback")`. An empty string means no function object.',
            '',
            'The callback accepts one parameter and can be [defined](https://www.autohotkey.com/docs/v1/Functions.htm#intro) as follows:',
            '',
            '```ahk',
            'MyCallback(InputHook) { ...',
            '```',
            '',
            'Although the name you give the parameter does not matter, it is assigned a reference to the InputHook object.',
            '',
            'You can omit the callback\'s parameter if the corresponding information is not needed.',
            '',
            'The function is called as a new [thread](https://www.autohotkey.com/docs/v1/misc/Threads.htm), so starts off fresh with the default values for settings such as [SendMode](https://www.autohotkey.com/docs/v1/lib/SendMode.htm) and [DetectHiddenWindows](https://www.autohotkey.com/docs/v1/lib/DetectHiddenWindows.htm).',
        ],
        exp: [
            'CurrentFunc := InputHook.OnEnd',
            'InputHook.OnEnd := NewFunc',
        ],
    },
    {
        keyRawName: 'OnChar',
        insert: 'OnChar',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnChar',
        doc: [
            'Retrieves or sets the [function object](https://www.autohotkey.com/docs/v1/misc/Functor.htm) which is called after a character is added to the input buffer.',
            '',
            '_CurrentFunc_ is _NewFunc_ if assigned, otherwise an empty string.',
            '',
            '_NewFunc_ is the [function object](https://www.autohotkey.com/docs/v1/misc/Functor.htm) to call, e.g. `[Func](https://www.autohotkey.com/docs/v1/lib/Func.htm#Func)("MyCallback")`. An empty string means no function object.',
            '',
            'The callback accepts two parameters and can be [defined](https://www.autohotkey.com/docs/v1/Functions.htm#intro) as follows:',
            '',
            '```ahk',
            'MyCallback(InputHook, Char) { ...',
            '```',
            '',
            'Although the names you give the parameters do not matter, the following values are sequentially assigned to them:',
            '',
            '1. A reference to the InputHook object.',
            '2. A string containing the character (or multiple characters, see below for details).',
            '',
            'You can omit one or more parameters from the end of the callback\'s parameter list if the corresponding information is not needed.',
            '',
            'The presence of multiple characters indicates that a dead key was used prior to the last keypress, but the two keys could not be transliterated to a single character. For example, on some keyboard layouts <kbd>`</kbd><kbd>e</kbd> produces `è` while <kbd>`</kbd><kbd>z</kbd> produces `` `z``.',
            '',
            'The function is never called when an end key is pressed.',
        ],
        exp: [
            'CurrentFunc := InputHook.OnChar',
            'InputHook.OnChar := NewFunc',
        ],
    },
    {
        keyRawName: 'OnKeyDown',
        insert: 'OnKeyDown',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnKeyDown',
        doc: [
            'Retrieves or sets the [function object](https://www.autohotkey.com/docs/v1/misc/Functor.htm) which is called when a notification-enabled key is pressed.',
            '',
            'Key-down notifications must first be enabled by [KeyOpt](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#KeyOpt) or [NotifyNonText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#NotifyNonText).',
            '',
            '_CurrentFunc_ is _NewFunc_ if assigned, otherwise an empty string.',
            '',
            '_NewFunc_ is the [function object](https://www.autohotkey.com/docs/v1/misc/Functor.htm) to call, e.g. `[Func](https://www.autohotkey.com/docs/v1/lib/Func.htm#Func)("MyCallback")`. An empty string means no function object.',
            '',
            'The callback accepts three parameters and can be [defined](https://www.autohotkey.com/docs/v1/Functions.htm#intro) as follows:',
            '',
            '```ahk',
            'MyCallback(InputHook, VK, SC) { ...',
            '```',
            '',
            'Although the names you give the parameters do not matter, the following values are sequentially assigned to them:',
            '',
            '1. A reference to the InputHook object.',
            '2. An integer representing the virtual key code of the key.',
            '3. An integer representing the scan code of the key.',
            '',
            'You can omit one or more parameters from the end of the callback\'s parameter list if the corresponding information is not needed.',
            '',
            'To retrieve the key name (if any), use `[GetKeyName](https://www.autohotkey.com/docs/v1/lib/GetKey.htm)([Format](https://www.autohotkey.com/docs/v1/lib/Format.htm)("vk{:x}sc{:x}", VK, SC))`.',
            '',
            'The function is called as a new [thread](https://www.autohotkey.com/docs/v1/misc/Threads.htm), so starts off fresh with the default values for settings such as [SendMode](https://www.autohotkey.com/docs/v1/lib/SendMode.htm) and [DetectHiddenWindows](https://www.autohotkey.com/docs/v1/lib/DetectHiddenWindows.htm).',
            '',
            'The function is never called when an end key is pressed.',
        ],
        exp: [
            'CurrentFunc := InputHook.OnKeyDown',
            'InputHook.OnKeyDown := NewFunc',
        ],
    },
    {
        keyRawName: 'OnKeyUp',
        insert: 'OnKeyUp',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnKeyUp',
        doc: [
            'Retrieves or sets the [function object](https://www.autohotkey.com/docs/v1/misc/Functor.htm) which is called when a notification-enabled key is released.',
            '',
            'Key-up notifications must first be enabled by [KeyOpt](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#KeyOpt) or [NotifyNonText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#NotifyNonText). Whether a key is considered text or non-text is determined when the key is pressed. If an InputHook detects a key-up without having detected key-down, it is considered non-text.',
            '',
            '_CurrentFunc_ is _NewFunc_ if assigned, otherwise an empty string.',
            '',
            '_NewFunc_ is the [function object](https://www.autohotkey.com/docs/v1/misc/Functor.htm) to call, e.g. `[Func](https://www.autohotkey.com/docs/v1/lib/Func.htm#Func)("MyCallback")`. An empty string means no function object.',
            '',
            'The callback accepts three parameters and can be [defined](https://www.autohotkey.com/docs/v1/Functions.htm#intro) as follows:',
            '',
            'MyCallback(InputHook, VK, SC) { ...',
            '',
            'Although the names you give the parameters do not matter, the following values are sequentially assigned to them:',
            '',
            '1. A reference to the InputHook object.',
            '2. An integer representing the virtual key code of the key.',
            '3. An integer representing the scan code of the key.',
            '',
            'You can omit one or more parameters from the end of the callback\'s parameter list if the corresponding information is not needed.',
            '',
            'To retrieve the key name (if any), use `[GetKeyName](https://www.autohotkey.com/docs/v1/lib/GetKey.htm)([Format](https://www.autohotkey.com/docs/v1/lib/Format.htm)("vk{:x}sc{:x}", VK, SC))`.',
            '',
            'The function is called as a new [thread](https://www.autohotkey.com/docs/v1/misc/Threads.htm), so starts off fresh with the default values for settings such as [SendMode](https://www.autohotkey.com/docs/v1/lib/SendMode.htm) and [DetectHiddenWindows](https://www.autohotkey.com/docs/v1/lib/DetectHiddenWindows.htm).',
        ],
        exp: [
            'CurrentFunc := InputHook.OnKeyUp',
            'InputHook.OnKeyUp := NewFunc',
        ],
    },
    // https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Option_Properties
    {
        keyRawName: 'BackspaceIsUndo',
        insert: 'BackspaceIsUndo',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#BackspaceIsUndo',
        doc: [
            'Controls whether <kbd>Backspace</kbd> removes the most recently pressed character from the end of the Input buffer.',
            '',
            '_CurrentSetting_ is _NewSetting_ if assigned, otherwise 1 (true) by default unless overwritten by the [B option](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#option-b).',
            '',
            '_NewSetting_ is a [boolean value](https://www.autohotkey.com/docs/v1/Concepts.htm#boolean) that enables or disables this setting.',
            '',
            'When <kbd>Backspace</kbd> acts as undo, it is treated as a text entry key. Specifically, whether the key is suppressed depends on [VisibleText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleText) rather than [VisibleNonText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleNonText).',
            '',
            '<kbd>Backspace</kbd> is always ignored if pressed in combination with a modifier key such as <kbd>Ctrl</kbd> (the logical modifier state is checked rather than the physical state).',
            '',
            '**Note:** If the input text is visible (such as in an editor) and the arrow keys or other means are used to navigate within it, <kbd>Backspace</kbd> will still remove the last character rather than the one behind the caret (insertion point).',
        ],
        exp: [
            'CurrentSetting := InputHook.BackspaceIsUndo',
            'InputHook.BackspaceIsUndo := NewSetting',
        ],
    },
    {
        keyRawName: 'CaseSensitive',
        insert: 'CaseSensitive',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#CaseSensitive',
        doc: [
            'Controls whether [_MatchList_](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#MatchList) is case-sensitive.',
            '',
            '_CurrentSetting_ is _NewSetting_ if assigned, otherwise 0 (false) by default unless overwritten by the [C option](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#option-c).',
            '',
            '_NewSetting_ is a [boolean value](https://www.autohotkey.com/docs/v1/Concepts.htm#boolean) that enables or disables this setting.',
        ],
        exp: [
            'CurrentSetting := InputHook.CaseSensitive',
            'InputHook.CaseSensitive := NewSetting',
        ],
    },
    {
        keyRawName: 'FindAnywhere',
        insert: 'FindAnywhere',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#FindAnywhere',
        doc: [
            'Controls whether each match can be a substring of the input text.',
            '',
            '_CurrentSetting_ is _NewSetting_ if assigned, otherwise 0 (false) by default unless overwritten by the [\\* option](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#asterisk).',
            '',
            '_NewSetting_ is a [boolean value](https://www.autohotkey.com/docs/v1/Concepts.htm#boolean) that enables or disables this setting. If true, a match can be found anywhere within what the user types (the match can be a substring of the input text). If false, the entirety of what the user types must match one of the _MatchList_ phrases. In both cases, one of the _MatchList_ phrases must be typed in full.',
        ],
        exp: [
            'CurrentSetting := InputHook.FindAnywhere',
            'InputHook.FindAnywhere := NewSetting',
        ],
    },
    {
        keyRawName: 'MinSendLevel',
        insert: 'MinSendLevel',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#MinSendLevel',
        doc: [
            'Retrieves or sets the minimum [send level](https://www.autohotkey.com/docs/v1/lib/SendLevel.htm) of input to collect.',
            '',
            '_CurrentLevel_ is _NewLevel_ if assigned, otherwise 0 by default unless overwritten by the [I option](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#option-i).',
            '',
            '_NewLevel_ should be an [integer](https://www.autohotkey.com/docs/v1/Concepts.htm#numbers) between 0 and 101. Events which have a send level lower than this value are ignored. For example, a value of 101 causes all input generated by [SendEvent](https://www.autohotkey.com/docs/v1/lib/Send.htm) to be ignored, while a value of 1 only ignores input at the default send level (zero).',
            '',
            'The [SendInput](https://www.autohotkey.com/docs/v1/lib/Send.htm#SendInput) and [SendPlay](https://www.autohotkey.com/docs/v1/lib/Send.htm#SendPlay) methods are always ignored, regardless of this setting. Input generated by any source other than AutoHotkey is never ignored as a result of this setting.',
        ],
        exp: [
            'CurrentLevel := InputHook.MinSendLevel',
            'InputHook.MinSendLevel := NewLevel',
        ],
    },
    {
        keyRawName: 'NotifyNonText',
        insert: 'NotifyNonText',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#NotifyNonText',
        doc: [
            'Controls whether the [OnKeyDown](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnKeyDown) and [OnKeyUp](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnKeyUp) callbacks are called whenever a non-text key is pressed.',
            '',
            '_CurrentSetting_ is _NewSetting_ if assigned, otherwise 0 (false) by default.',
            '',
            '_NewSetting_ is a [boolean value](https://www.autohotkey.com/docs/v1/Concepts.htm#boolean) that enables or disables this setting. If true, notifications are enabled for all keypresses which do not produce text, such as when pressing <kbd>←</kbd> or <kbd>Alt</kbd>+<kbd>F</kbd>. Setting this property does not affect a key\'s [options](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#KeyOpt), since the production of text depends on the active window\'s keyboard layout at the time the key is pressed.',
            '',
            'NotifyNonText is applied to key-up events by considering whether a previous key-down with a matching VK code was classified as text or non-text. For example, if NotifyNonText is true, pressing <kbd>Ctrl</kbd>+<kbd>A</kbd> will produce [OnKeyDown](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnKeyDown) and [OnKeyUp](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#OnKeyUp) calls for both <kbd>Ctrl</kbd> and <kbd>A</kbd>, while pressing <kbd>A</kbd> on its own will not call OnKeyDown or OnKeyUp unless [KeyOpt](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#KeyOpt) has been used to enable notifications for that key.',
            '',
            'See [VisibleText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleText) for details about which keys are counted as producing text.',
        ],
        exp: [
            'CurrentSetting := InputHook.NotifyNonText',
            'InputHook.NotifyNonText := NewSetting',
        ],
    },
    {
        keyRawName: 'Timeout',
        insert: 'Timeout',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Timeout',
        doc: [
            'Retrieves or sets the timeout value in seconds.',
            '',
            '_CurrentSeconds_ is _NewSeconds_ if assigned, otherwise 0 by default unless overwritten by the [T option](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#option-t).',
            '',
            '_NewSeconds_ is a [floating-point number](https://www.autohotkey.com/docs/v1/Concepts.htm#numbers) representing the timeout. 0 means no timeout.',
            '',
            'The timeout period ordinarily starts when [Start](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#Start) is called, but will restart if this property is assigned a value while Input is in progress. If Input is still in progress when the timeout period elapses, it is terminated and [EndReason](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#EndReason) is set to the word Timeout.',
        ],
        exp: [
            'CurrentSeconds := InputHook.Timeout',
            'InputHook.Timeout := NewSeconds',
        ],
    },
    {
        keyRawName: 'VisibleNonText',
        insert: 'VisibleNonText',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleNonText',
        doc: [
            'Controls whether keys or key combinations which do not produce text are visible (not blocked).',
            '',
            '_CurrentSetting_ is _NewSetting_ if assigned, otherwise 1 (true) by default. The [V option](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#vis) sets this to 1 (true).',
            '',
            '_NewSetting_ is a [boolean value](https://www.autohotkey.com/docs/v1/Concepts.htm#boolean) that enables or disables this setting. If true, keys and key combinations which do not produce text may trigger hotkeys or be passed on to the active window. If false, they are blocked.',
            '',
            'See [VisibleText](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleText) for details about which keys are counted as producing text.',
        ],
        exp: [
            'CurrentSetting := InputHook.VisibleNonText',
            'InputHook.VisibleNonText := NewSetting',
        ],
    },
    {
        keyRawName: 'VisibleText',
        insert: 'VisibleText',
        uri: 'https://www.autohotkey.com/docs/v1/lib/InputHook.htm#VisibleText',
        doc: [
            'Controls whether keys or key combinations which produce text are visible (not blocked).',
            '',
            '_CurrentSetting_ is _NewSetting_ if assigned, otherwise 0 (false) by default unless overwritten by the [V option](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#vis).',
            '',
            '_NewSetting_ is a [boolean value](https://www.autohotkey.com/docs/v1/Concepts.htm#boolean) that enables or disables this setting. If true, keys and key combinations which produce text may trigger hotkeys or be passed on to the active window. If false, they are blocked.',
            '',
            'Any keystrokes which cause text to be appended to the Input buffer are counted as producing text, even if they do not normally do so in other applications. For instance, <kbd>Ctrl</kbd>+<kbd>A</kbd> produces text if the [M option](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#option-m) is used, and <kbd>Esc</kbd> produces the control character `[Chr](https://www.autohotkey.com/docs/v1/lib/Chr.htm)(27)`.',
            '',
            'Dead keys are counted as producing text, although they do not typically produce an immediate effect. Pressing a dead key might also cause the following key to produce text (if only the dead key\'s character).',
            '',
            '<kbd>Backspace</kbd> is counted as producing text only when it [acts as undo](https://www.autohotkey.com/docs/v1/lib/InputHook.htm#BackspaceIsUndo).',
            '',
            'The [standard modifier keys](https://www.autohotkey.com/docs/v1/KeyList.htm#modifier) and <kbd>CapsLock</kbd>, <kbd>NumLock</kbd> and <kbd>ScrollLock</kbd> are always visible (not blocked).',
        ],
        exp: [
            'CurrentSetting := InputHook.VisibleText',
            'InputHook.VisibleText := NewSetting',
        ],
    },
];
