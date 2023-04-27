type TElement = {
    body: `ahk_${string}`,
    uri: `https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_${string}`,
    tittleMD: `[${string}](https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_${string})`,
    exp: string[],
};

/**
 * after initialization clear
 */
export const WinTitleParameterData: TElement[] = [
    {
        body: 'ahk_class',
        uri: 'https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_class',
        tittleMD: '[Window Class](https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_class)',
        exp: [
            'WinActivate, ahk_class ConsoleWindowClass',
            'WinActivate, ahk_class i)^ConsoleWindowClass$',
            '',
            'Hotkey, IfWinActive, ahk_class Notepad',
            'Hotkey, ^!e, MyLabel  ; Creates a hotkey that works only in Notepad.',
            '',
            'WinShow, ahk_class AutoHotkey',
            '',
            'WinExist("ahk_class Winamp v1.x")',
        ],
    },
    {
        body: 'ahk_id',
        uri: 'https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_id',
        tittleMD: '[Unique ID/HWND](https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_id)',
        exp: [
            'WinActivate, ahk_id %VarContainingID%',
            '',
            'PostMessage, 0x0153, -1, 50,, ahk_id %hcbx%  ; Set height of selection field.',
            '',
            'ControlGetPos, x, y, w, h, %WhichControl%, ahk_id %WhichWindow%',
        ],
    },
    {
        body: 'ahk_pid',
        uri: 'https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_pid',
        tittleMD: '[Process ID](https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_pid)',
        exp: [
            'WinActivate, ahk_pid %VarContainingPID%',
            '',
            'SetTitleMatchMode, 2',
            'Run, %A_ComSpec%,,, PID  ; Run command prompt.',
            'WinWait, ahk_pid %PID%  ; Wait for it to appear.',
            'ControlSend,, ipconfig{Enter}, cmd.exe  ; Send directly to the command prompt window.',
            '',
            'WinWait ahk_pid %OutputVarPID%',
        ],
    },
    {
        body: 'ahk_exe',
        uri: 'https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_exe',
        tittleMD: '[Process Name/Path](https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_exe)',
        exp: [
            'WinActivate, ahk_exe notepad.exe',
            'WinActivate, ahk_exe i)\\\notepad\\.exe$  ; Match the name part of the full path.',
        ],
    },
    {
        body: 'ahk_group',
        uri: 'https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_group',
        tittleMD: '[Window Group](https://www.autohotkey.com/docs/v1/misc/WinTitle.htm#ahk_group)',
        exp: [
            '; Define the group: Windows Explorer windows',
            'GroupAdd, Explorer, ahk_class ExploreWClass ; Unused on Vista and later',
            'GroupAdd, Explorer, ahk_class CabinetWClass',
            '',
            '; Activate any window matching the above criteria',
            'WinActivate, ahk_group Explorer',
        ],
    },
];
