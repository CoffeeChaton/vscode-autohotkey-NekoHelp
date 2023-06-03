/* eslint-disable sonarjs/no-duplicate-string */
import * as vscode from 'vscode';
import type { TCmdMsg } from '../../tools/Built-in/6_command/Command.tools';
import { getHoverCommand2 } from '../../tools/Built-in/6_command/Command.tools';

/**
 * ```ahk
 * MsgBox
 * Random
 * Hotkey
 * IniRead
 * IniWrite
 * SplashImage
 * Progress
 * WinMove
 * WinSetTitle
 * ```
 */
export const SignatureCmdOverloadMap: ReadonlyMap<string, readonly TCmdMsg[]> = (
    (): ReadonlyMap<string, readonly TCmdMsg[]> => {
        const arrAll: readonly TCmdMsg[] = [
            // https://www.autohotkey.com/docs/v1/lib/MsgBox.htm
            // MsgBox [, Options, Title, Text, Timeout_Sec]
            {
                md: getHoverCommand2('MsgBox'.toUpperCase()) ?? new vscode.MarkdownString(),
                cmdSignLabel: 'MsgBox [, Options, Title, Text, Timeout_Sec]',
                keyRawName: 'MsgBox',
                _param: [
                    // https://github.com/AutoHotkey/AutoHotkeyDocs/blob/v1/docs/static/source/data_index.js#L876
                    {
                        name: 'Options',
                        sign: 'S',
                        isOpt: true,
                        paramDoc: [
                            '[Group #1: Buttons](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Group_1_Buttons)',
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
                            '[Group #2: Icon](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Group_2_Icon)',
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
                            '[Group #3: Default Button](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Group_3_Default_Button)',
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
                            '[Group #4: Modality](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Group_4_Modality)',
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
                            '[Group #5: Other Options](https://www.autohotkey.com/docs/v1/lib/MsgBox.htm#Group_5_Other_Options)',
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
            // https://www.autohotkey.com/docs/v1/lib/Random.htm
            // Random, (blank), NewSeed
            {
                md: getHoverCommand2('Random'.toUpperCase()) ?? new vscode.MarkdownString(),
                cmdSignLabel: 'Random, (blank), NewSeed',
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
                cmdSignLabel: 'Hotkey, IfWinActive|IfWinExist|IfWinNotActive|IfWinNotExist [, WinTitle, WinText]',
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
                cmdSignLabel: 'Hotkey, If [, Expression]',
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
                cmdSignLabel: 'Hotkey, If, % FunctionObject',
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
            // https://www.autohotkey.com/docs/v1/lib/IniRead.htm
            // IniRead, OutputVarSection, Filename, Section
            // IniRead, OutputVarSectionNames, Filename
            {
                md: getHoverCommand2('IniRead'.toUpperCase()) ?? new vscode.MarkdownString(),
                cmdSignLabel: 'IniRead, OutputVarSection, Filename, Section',
                keyRawName: 'IniRead',
                _param: [
                    {
                        name: 'OutputVarSection',
                        sign: 'O',
                        isOpt: false,
                        paramDoc: [
                            '[\\[v1.0.90+\\]:](https://www.autohotkey.com/docs/v1/AHKL_ChangeLog.htm#L57 "Applies to:',
                            'AutoHotkey_L Revision 57 and later',
                            'AutoHotkey v1.0.90.00 and later") Omit the _Key_ parameter to read an entire section. Comments and empty lines are omitted. Only the first 65,533 characters of the section are retrieved.',
                            '',
                            '```ini',
                            '[SectionName]',
                            'Key=Value',
                            '```',
                        ],
                    },
                    {
                        name: 'Filename',
                        sign: 'S',
                        isOpt: false,
                        paramDoc: [
                            'The name of the .ini file, which is assumed to be in [%A\\_WorkingDir%](https://www.autohotkey.com/docs/v1/Variables.htm#WorkingDir) if an absolute path isn\'t specified.',
                            '',
                            '```ini',
                            '[SectionName]',
                            'Key=Value',
                            '```',
                        ],
                    },
                    {
                        name: 'Section',
                        sign: 'S',
                        isOpt: false,
                        paramDoc: [
                            'The section name in the .ini file, which is the heading phrase that appears in square brackets (do not include the brackets in this parameter).',
                            '',
                            '```ini',
                            '[SectionName]',
                            'Key=Value',
                            '```',
                        ],
                    },
                ],
            },
            {
                md: getHoverCommand2('IniRead'.toUpperCase()) ?? new vscode.MarkdownString(),
                cmdSignLabel: 'IniRead, OutputVarSectionNames, Filename',
                keyRawName: 'IniRead',
                _param: [
                    {
                        name: 'OutputVarSectionNames',
                        sign: 'O',
                        isOpt: false,
                        paramDoc: [
                            '[\\[v1.0.90+\\]:](https://www.autohotkey.com/docs/v1/AHKL_ChangeLog.htm#L57 "Applies to:',
                            'AutoHotkey_L Revision 57 and later',
                            'AutoHotkey v1.0.90.00 and later") Omit the _Key_ and _Section_ parameters to retrieve a linefeed (`` `n``) delimited list of section names.',
                            '',
                            '```ini',
                            '[SectionName]',
                            'Key=Value',
                            '```',
                        ],
                    },
                    {
                        name: 'Filename',
                        sign: 'S',
                        isOpt: false,
                        paramDoc: [
                            'The name of the .ini file, which is assumed to be in [%A\\_WorkingDir%](https://www.autohotkey.com/docs/v1/Variables.htm#WorkingDir) if an absolute path isn\'t specified.',
                            '',
                            '```ini',
                            '[SectionName]',
                            'Key=Value',
                            '```',
                        ],
                    },
                ],
            },
            // https://www.autohotkey.com/docs/v1/lib/IniWrite.htm
            // IniWrite, Pairs, Filename, Section
            {
                md: getHoverCommand2('IniWrite'.toUpperCase()) ?? new vscode.MarkdownString(),
                cmdSignLabel: 'IniWrite, Pairs, Filename, Section',
                keyRawName: 'IniWrite',
                _param: [
                    {
                        name: 'Pairs',
                        sign: 'S',
                        isOpt: false,
                        paramDoc: [
                            'The complete content of a section to write to the .ini file, excluding the \\[SectionName\\] header. _Key_ must be omitted. _Pairs_ must not contain any blank lines. If the section already exists, everything up to the last key=value pair is overwritten. _Pairs_ can contain lines without an equal sign (=), but this may produce inconsistent results. Comments can be written to the file but are stripped out when they are read back by [IniRead](https://www.autohotkey.com/docs/v1/lib/IniRead.htm).',
                            '',
                            '```ini',
                            '[SectionName]',
                            'Key=Value',
                            '```',
                        ],
                    },
                    {
                        name: 'Filename',
                        sign: 'S',
                        isOpt: false,
                        paramDoc: [
                            'The name of the .ini file, which is assumed to be in [%A\\_WorkingDir%](https://www.autohotkey.com/docs/v1/Variables.htm#WorkingDir) if an absolute path isn\'t specified.',
                        ],
                    },
                    {
                        name: 'Section',
                        sign: 'S',
                        isOpt: false,
                        paramDoc: [
                            'The section name in the .ini file, which is the heading phrase that appears in square brackets (do not include the brackets in this parameter).',
                            '',
                            '```ini',
                            '[SectionName]',
                            'Key=Value',
                            '```',
                        ],
                    },
                ],
            },
            // https://www.autohotkey.com/docs/v1/lib/Progress.htm
            // SplashImage, Off
            {
                md: getHoverCommand2('SplashImage'.toUpperCase()) ?? new vscode.MarkdownString(),
                cmdSignLabel: 'SplashImage, Off',
                keyRawName: 'SplashImage',
                _param: [
                    {
                        name: 'Off',
                        sign: 'S',
                        isOpt: false,
                        paramDoc: [
                            'If this is the word OFF, the window is destroyed.',
                        ],
                    },
                ],
            },
            // https://www.autohotkey.com/docs/v1/lib/Progress.htm
            // Progress, Off
            {
                md: getHoverCommand2('Progress'.toUpperCase()) ?? new vscode.MarkdownString(),
                cmdSignLabel: 'Progress, Off',
                keyRawName: 'Progress',
                _param: [
                    {
                        name: 'Off',
                        sign: 'S',
                        isOpt: false,
                        paramDoc: [
                            'If this is the word OFF, the window is destroyed.',
                        ],
                    },
                ],
            },
            // https://www.autohotkey.com/docs/v1/lib/WinMove.htm
            // WinMove, X, Y
            {
                md: getHoverCommand2('WinMove'.toUpperCase()) ?? new vscode.MarkdownString(),
                cmdSignLabel: 'WinMove, X, Y',
                keyRawName: 'WinMove',
                _param: [
                    {
                        name: 'X',
                        sign: 'S',
                        isOpt: false,
                        paramDoc: [
                            'The X and Y coordinates (in pixels) of the upper left corner of the target window\'s new location, which can be [expressions](https://www.autohotkey.com/docs/v1/Variables.htm#Expressions). The upper-left pixel of the screen is at 0, 0.',
                            '',
                            'If these are the only parameters given with the command, the [Last Found Window](https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#LastFoundWindow) will be used as the target window.',
                            '',
                            'Otherwise, X and/or Y can be omitted, in which case the current position is used.',
                        ],
                    },
                    {
                        name: 'Y',
                        sign: 'S',
                        isOpt: false,
                        paramDoc: [
                            'The X and Y coordinates (in pixels) of the upper left corner of the target window\'s new location, which can be [expressions](https://www.autohotkey.com/docs/v1/Variables.htm#Expressions). The upper-left pixel of the screen is at 0, 0.',
                            '',
                            'If these are the only parameters given with the command, the [Last Found Window](https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#LastFoundWindow) will be used as the target window.',
                            '',
                            'Otherwise, X and/or Y can be omitted, in which case the current position is used.',
                        ],
                    },
                ],
            },
            // https://www.autohotkey.com/docs/v1/lib/WinSetTitle.htm
            // WinSetTitle, NewTitle
            {
                md: getHoverCommand2('WinSetTitle'.toUpperCase()) ?? new vscode.MarkdownString(),
                cmdSignLabel: 'WinSetTitle, NewTitle',
                keyRawName: 'WinSetTitle',
                _param: [
                    {
                        name: 'NewTitle',
                        sign: 'S',
                        isOpt: false,
                        paramDoc: [
                            'The new title for the window. If this is the only parameter given, the [Last Found Window](https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#LastFoundWindow) will be used.',
                        ],
                    },
                ],
            },
        ];

        const map = new Map<string, TCmdMsg[]>();
        for (const v of arrAll) {
            const { keyRawName } = v;
            const upName: string = keyRawName.toUpperCase();
            const arr0: TCmdMsg[] = map.get(upName) ?? [];
            arr0.push(v);
            map.set(upName, arr0);
        }

        return map;
    }
)();
