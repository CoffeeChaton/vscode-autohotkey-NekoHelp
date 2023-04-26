/* eslint-disable no-template-curly-in-string */

type TSubCmdList =
    | 'ControlList'
    | 'ControlListHwnd'
    | 'Count'
    | 'ExStyle'
    | 'ID'
    | 'IDLast'
    | 'List'
    | 'MinMax'
    | 'PID'
    | 'ProcessName'
    | 'ProcessPath'
    | 'Style'
    | 'TransColor'
    | 'Transparent';

/**
 * <https://www.autohotkey.com/docs/v1/lib/WinGet.htm>
 */
export type TWinGetCmdElement = Readonly<{
    SubCommand: TSubCmdList,
    // WinGet, OutputVar, SubCommand, WinTitle, WinText, ExcludeTitle, ExcludeText
    // WinGet, OutputVar [, SubCommand, WinTitle, WinText, ExcludeTitle, ExcludeText]

    body:
        `WinGet, \${1:OutputVar}, [${TSubCmdList}, \${2:WinTitle}, \${3:WinText}, \${4:ExcludeTitle}, \${5:ExcludeText}]`,
    doc: string,
    link: `https://www.autohotkey.com/docs/v1/lib/WinGet.htm#${TSubCmdList}`,
    exp: readonly string[],
}>;

/*
ID: Retrieves the unique ID number of a window.
IDLast: Retrieves the unique ID number of the last/bottommost window if there is more than one match.
PID: Retrieves the Process ID number of a window.
ProcessName: Retrieves the name of the process that owns a window.
ProcessPath [v1.1.01+]: Retrieves the full path and name of the process that owns a window.
Count: Retrieves the number of existing windows that match the title/text parameters.
List: Retrieves the unique ID numbers of all existing windows that match the title/text parameters.
MinMax: Retrieves the minimized/maximized state for a window.
ControlList: Retrieves the control name for each control in a window.
ControlListHwnd [v1.0.43.06+]: Retrieves the unique ID number for each control in a window.
Transparent: Retrieves the degree of transparency of a window.
TransColor: Retrieves the color that is marked transparent in a window.
Style: Retrieves an 8-digit hexadecimal number representing the style of a window.
ExStyle: Retrieves an 8-digit hexadecimal number representing the extended style of a window.
*/

/**
 * after initialization clear
 */
export const WinGetSubCmdList: TWinGetCmdElement[] = [
    {
        SubCommand: 'ID',
        body: 'WinGet, ${1:OutputVar}, [ID, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the unique ID number of a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#ID',
        exp: [
            'WinGet, OutputVar [, ID, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
            'WinGet, active_id, ID, A',
            'WinMaximize, ahk_id %active_id%',
            'MsgBox, "The active window\'s ID is " active_id',
        ],
    },
    {
        SubCommand: 'IDLast',
        body: 'WinGet, ${1:OutputVar}, [IDLast, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the unique ID number of the last/bottommost window if there is more than one match.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#IDLast',
        exp: [
            'WinGet, OutputVar [, IDLast, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'PID',
        body: 'WinGet, ${1:OutputVar}, [PID, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the [Process ID number](https://www.autohotkey.com/docs/v1/lib/Process.htm) of a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#PID',
        exp: [
            'WinGet, OutputVar [, PID, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'ProcessName',
        body: 'WinGet, ${1:OutputVar}, [ProcessName, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the name of the process that owns a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#ProcessName',
        exp: [
            'WinGet, OutputVar [, ProcessName, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'ProcessPath',
        body: 'WinGet, ${1:OutputVar}, [ProcessPath, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the full path and name of the process that owns a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#ProcessPath',
        exp: [
            'WinGet, OutputVar [, ProcessPath, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Count',
        body: 'WinGet, ${1:OutputVar}, [Count, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the number of existing windows that match the title/text parameters.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#Count',
        exp: [
            'WinGet, OutputVar [, Count, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'List',
        body: 'WinGet, ${1:OutputVar}, [List, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the unique ID numbers of all existing windows that match the title/text parameters.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#List',
        exp: [
            'WinGet, OutputVar [, List, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
            '',
            'WinGet, id_list, List,,, Program Manager',
            'Loop, %id_list%',
            '{',
            '    i := A_Index',
            '    this_id := id_list%A_Index%',
            '    WinActivate, ahk_id %this_id%',
            '    WinGetClass, this_class, ahk_id %this_id%',
            '    WinGetTitle, this_title, ahk_id %this_id%',
            '    MsgBox, 4, ,',
            '        (LTrim',
            '            Visiting All Windows',
            '            %i% of %id_list%',
            '            ahk_id %this_id%',
            '            ahk_class %this_class%',
            '            %this_title%',
            '',
            '            Continue?',
            '        )',
            '',
            '    IfMsgBox, NO',
            '        break',
            '}',
        ], // https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/11#issuecomment-1497266471
    },
    {
        SubCommand: 'MinMax',
        body: 'WinGet, ${1:OutputVar}, [MinMax, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the minimized/maximized state for a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#MinMax',
        exp: [
            'WinGet, OutputVar [, MinMax, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'ControlList',
        body: 'WinGet, ${1:OutputVar}, [ControlList, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the control name for each control in a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#ControlList',
        exp: [
            'WinGet, OutputVar [, ControlList, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
            'WinGet, ActiveControlList, ControlList, A',
            'Loop, Parse, ActiveControlList, `n',
            '{',
            '    MsgBox, 4,, % "Control #" A_Index " is [" A_LoopField "]`nContinue?"',
            '    IfMsgBox, No',
            '        break',
            '}',
        ],
    },
    {
        SubCommand: 'ControlListHwnd',
        body:
            'WinGet, ${1:OutputVar}, [ControlListHwnd, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the unique ID number for each control in a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#ControlListHwnd',
        exp: [
            'WinGet, OutputVar [, ControlListHwnd, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Transparent',
        body: 'WinGet, ${1:OutputVar}, [Transparent, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the degree of transparency of a window. \n...Otherwise, a number between 0 and 255 is stored, where 0 indicates an invisible window and 255 indicates an opaque window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#Transparent',
        exp: [
            'WinGet, OutputVar [, Transparent, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
            'MouseGetPos,,, MouseWin',
            'WinGet, Transparent_var, Transparent, ahk_id %MouseWin% ; Transparency of window under the mouse cursor.',
        ],
    },
    {
        SubCommand: 'TransColor',
        body: 'WinGet, ${1:OutputVar}, [TransColor, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves the color that is marked transparent in a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#TransColor',
        exp: [
            'WinGet, OutputVar [, TransColor, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Style',
        body: 'WinGet, ${1:OutputVar}, [Style, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves an 8-digit hexadecimal number representing the style of a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#Style',
        exp: [
            'WinGet, OutputVar [, Style, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'ExStyle',
        body: 'WinGet, ${1:OutputVar}, [ExStyle, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: ' Retrieves an 8-digit hexadecimal number representing the extended style of a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinGet.htm#ExStyle',
        exp: [
            'WinGet, OutputVar [, ExStyle, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
];
