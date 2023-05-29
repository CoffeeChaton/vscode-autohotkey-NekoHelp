import * as vscode from 'vscode';
import type { TCmdMsg } from '../../tools/Built-in/6_command/Command.tools';
import { getHoverCommand2 } from '../../tools/Built-in/6_command/Command.tools';

/**
 * ```ahk
 * MsgBox
 * Random
 * Hotkey
 * ; TODO
 * IniRead
 * IniWrite
 * SplashImage
 * Progress
 * WinMove
 * WinSetTitle
 * ```
 */
export const SignatureCmdOverloadArr: readonly TCmdMsg[] = [
    // MsgBox [, Options, Title, Text, Timeout]
    // https://www.autohotkey.com/docs/v1/lib/MsgBox.htm
    {
        md: getHoverCommand2('MsgBox'.toUpperCase()) ?? new vscode.MarkdownString(),
        keyRawName: 'MsgBox',
        _param: [
            // https://github.com/AutoHotkey/AutoHotkeyDocs/blob/v1/docs/static/source/data_index.js#L876
            {
                name: 'Options',
                sign: 'S',
                isOpt: true,
                paramDoc: [
                    '- [Group #1: Buttons](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Group_1_Buttons)',
                    '',
                    'To indicate the buttons displayed in the message box, add **one** of the following values:',
                    '',
                    '| Function                                     | Decimal Value | Hex Value |',
                    '| -------------------------------------------- | ------------- | --------- |',
                    '| OK (that is, only an OK button is displayed) | 0             | 0x0       |',
                    '| OK/Cancel                                    | 1             | 0x1       |',
                    '| Abort/Retry/Ignore                           | 2             | 0x2       |',
                    '| Yes/No/Cancel                                | 3             | 0x3       |',
                    '| Yes/No                                       | 4             | 0x4       |',
                    '| Retry/Cancel                                 | 5             | 0x5       |',
                    '| Cancel/Try Again/Continue                    | 6             | 0x6       |',
                    '',
                    '- [Group #2: Icon](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Group_2_Icon)',
                    '',
                    'To display an icon in the message box, add **one** of the following values:',
                    '',
                    '| Function               | Decimal Value | Hex Value |',
                    '| ---------------------- | ------------- | --------- |',
                    '| Icon Hand (stop/error) | 16            | 0x10      |',
                    '| Icon Question          | 32            | 0x20      |',
                    '| Icon Exclamation       | 48            | 0x30      |',
                    '| Icon Asterisk (info)   | 64            | 0x40      |',
                    '',
                    '- [Group #3: Default Button](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Group_3_Default_Button)',
                    '',
                    'To indicate the default button, add **one** of the following values:',
                    '',
                    '| Function                                 | Decimal Value | Hex Value |',
                    '| ---------------------------------------- | ------------- | --------- |',
                    '| Makes the 2nd button the default         | 256           | 0x100     |',
                    '| Makes the 3rd button the default         | 512           | 0x200     |',
                    '| Makes the 4th button the default         |',
                    '| (requires the Help button to be present) | 768           | 0x300     |',
                    '',
                    '- [Group #4: Modality](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Group_4_Modality)',
                    '',
                    'To indicate the modality of the dialog box, add **one** of the following values:',
                    '',
                    '| Function                                     | Decimal Value | Hex Value |',
                    '| -------------------------------------------- | ------------- | --------- |',
                    '| System Modal (always on top)                 | 4096          | 0x1000    |',
                    '| Task Modal                                   | 8192          | 0x2000    |',
                    '| Always-on-top (style WS\\_EX\\_TOPMOST)      |',
                    '| (like System Modal but omits title bar icon) | 262144        | 0x40000   |',
                    '',
                    '- [Group #5: Other Options](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Group_5_Other_Options)',
                    '',
                    'To specify other options, add **one or more** of the following values:',
                    '',
                    '| Function                                      | Decimal Value | Hex Value |',
                    '| --------------------------------------------- | ------------- | --------- |',
                    '| Adds a Help button (see remarks below)        | 16384         | 0x4000    |',
                    '| Make the text right-justified                 | 524288        | 0x80000   |',
                    '| Right-to-left reading order for Hebrew/Arabic | 1048576       | 0x100000  |',
                ],
            },
            {
                name: 'Title',
                sign: 'S',
                isOpt: true,
                paramDoc: [
                    'If blank or omitted, it defaults to the name of the script (without path). Otherwise, specify the title of the message box.',
                ],
            },
            {
                name: 'Text',
                sign: 'S',
                isOpt: true,
                paramDoc: [
                    'If all the parameters are omitted, the message box will display the text "Press OK to continue.". Otherwise, this parameter is the text displayed inside the message box to instruct the user what to do, or to present information.',
                    '',
                    '[Escape sequences](https://www.autohotkey.com/docs/v1/misc/EscapeChar.htm) can be used to denote special characters. For example, \\`n indicates a linefeed character, which ends the current line and begins a new one. Thus, using ``text1`n`ntext2`` would create a blank line between text1 and text2.',
                    '',
                    'If _Text_ is long, it can be broken up into several shorter lines by means of a [continuation section](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation), which might improve readability and maintainability.',
                ],
            },
            {
                name: 'Timeout_Sec',
                sign: 'S',
                isOpt: true,
                paramDoc: [
                    'If blank or omitted, the message box will not be automatically closed. Otherwise, specify the timeout in seconds, which can contain a decimal point but is not an expression by default. [\\[v1.1.06+\\]](https://www.autohotkey.com/docs/v1/AHKL_ChangeLog.htm#v1.1.06.00 "Applies to AutoHotkey v1.1.06 and later"): This can be a forced expression such as `% mins*60`.',
                    '',
                    'If this value exceeds 2147483 (24.8 days), it will be set to 2147483. After the timeout has elapsed the message box will be automatically closed and the [IfMsgBox](https://www.autohotkey.com/docs/v1/lib/IfMsgBox.htm) command will see the value TIMEOUT.',
                    '',
                    'The following limitation was fixed in [\\[v1.1.30.01\\]](https://www.autohotkey.com/docs/v1/AHKL_ChangeLog.htm#v1.1.30.01): If the message box contains only an OK button, [IfMsgBox](https://www.autohotkey.com/docs/v1/lib/IfMsgBox.htm) will think that the OK button was pressed if the message box times out while its own [thread](https://www.autohotkey.com/docs/v1/misc/Threads.htm) is inactive due to being interrupted by another.',
                ],
            },
        ],
    },
    // Random, , NewSeed
    // https://www.autohotkey.com/docs/v1/lib/Random.htm
    {
        md: getHoverCommand2('Random'.toUpperCase()) ?? new vscode.MarkdownString(),
        keyRawName: 'Random',
        _param: [
            {
                name: '(blank)',
                sign: 'S',
                isOpt: false,
                paramDoc: [
                    '```ahk',
                    'Random, , NewSeed',
                    '```',
                ],
            },
            {
                name: 'NewSeed',
                sign: 'S',
                isOpt: false,
                paramDoc: [
                    '```ahk',
                    'Random, , NewSeed',
                    '```',
                    '',
                    'This mode reseeds the random number generator with _NewSeed_ (which can be an [expression](https://www.autohotkey.com/docs/v1/Variables.htm#Expressions)). This affects all subsequently generated random numbers. _NewSeed_ should be an integer between 0 and 4294967295 (0xFFFFFFFF). Reseeding can improve the quality/security of generated random numbers, especially when _NewSeed_ is a genuine random number rather than one of lesser quality such as a pseudo-random number. Generally, reseeding does not need to be done more than once.',
                    '',
                    'If reseeding is never done by the script, the seed starts off as the low-order 32-bits of the 64-bit value that is the number of 100-nanosecond intervals since January 1, 1601. This value travels from 0 to 4294967295 every ~7.2 minutes.',
                    '',
                ],
            },
        ],
    },
    // https://www.autohotkey.com/docs/v1/lib/Hotkey.htm
    // Hotkey, KeyName , Label, Options
    // Hotkey, IfWinActive/Exist , WinTitle, WinText
    // Hotkey, If [, Expression]
    // Hotkey, If, % FunctionObject
    {
        md: getHoverCommand2('Hotkey'.toUpperCase()) ?? new vscode.MarkdownString(),
        keyRawName: 'Hotkey',
        _param: [
            {
                name: 'IfWinActive|IfWinExist|IfWinNotActive|IfWinNotExist',
                sign: 'S',
                isOpt: false,
                paramDoc: [
                    '',
                ],
            },
            {
                name: 'WinTitle',
                sign: 'S',
                isOpt: true,
                paramDoc: [
                    '',
                ],
            },
            {
                name: 'WinText',
                sign: 'S',
                isOpt: true,
                paramDoc: [
                    '',
                ],
            },
        ],
    },
    {
        md: getHoverCommand2('Hotkey'.toUpperCase()) ?? new vscode.MarkdownString(),
        keyRawName: 'Hotkey',
        _param: [
            {
                name: 'If',
                sign: 'S',
                isOpt: false,
                paramDoc: [
                    '',
                ],
            },
            {
                name: 'Expression',
                sign: 'S',
                isOpt: true,
                paramDoc: [
                    'If _Expression_ contains an `and`/`or` operator, it is not recognized as an existing expression. As a workaround, use the equivalent `&&`/`||` operator in both the original #If expression and the one passed to the Hotkey command.',
                ],
            },
        ],
    },
    {
        md: getHoverCommand2('Hotkey'.toUpperCase()) ?? new vscode.MarkdownString(),
        keyRawName: 'Hotkey',
        _param: [
            {
                name: 'If',
                sign: 'S',
                isOpt: false,
                paramDoc: [
                    '',
                ],
            },
            {
                name: '% FunctionObject',
                sign: 'S',
                isOpt: false,
                paramDoc: [
                    '[#7](https://www.autohotkey.com/docs/v1/lib/Hotkey.htm#ExampleIfFn) Creates a GUI that allows to register primitive three - key combination hotkeys.',
                    '',
                    '```ahk',
                    ' Gui Add, Text, xm, Prefix key:',
                    ' Gui Add, Edit, yp x100 w100 vPrefix, Space',
                    ' Gui Add, Text, xm, Suffix hotkey:',
                    ' Gui Add, Edit, yp x100 w100  vSuffix, f & j',
                    ' Gui Add, Button, Default, Register',
                    ' Gui Show',
                    ' return',
                    ' ',
                    ' ButtonRegister() {',
                    '     global',
                    '     Gui Submit, NoHide',
                    '     local fn',
                    '     fn := Func("HotkeyShouldFire").Bind(Prefix)',
                    '     Hotkey If, % fn',
                    '     Hotkey % Suffix, FireHotkey',
                    ' }',
                    ' ',
                    ' HotkeyShouldFire(prefix, thisHotkey) {',
                    '     return GetKeyState(prefix)',
                    ' }',
                    ' ',
                    ' FireHotkey() {',
                    '     MsgBox %A_ThisHotkey%',
                    ' }',
                    ' ',
                    ' GuiClose:',
                    ' GuiEscape:',
                    ' ExitApp',
                    '```',
                    '',
                ],
            },
        ],
    },
];
