type TBiVElement = {
    keyRawName: string,
    link: `https://www.autohotkey.com/docs/v1/${string}`,
    doc: string,
    exp: readonly string[],
};

/**
 * built-in variables
 *
 * after initialization clear
 */
export const BiVariables: TBiVElement[] = [
    {
        keyRawName: 'Clipboard',
        link: 'https://www.autohotkey.com/docs/v1/misc/Clipboard.htm',
        doc: '_Clipboard_ is a built-in [variable](https://www.autohotkey.com/docs/v1/Variables.htm) that reflects the current contents of the Windows clipboard if those contents can be expressed as text. By contrast, _[ClipboardAll](https://www.autohotkey.com/docs/v1/misc/Clipboard.htm#ClipboardAll)_ contains everything on the clipboard, such as pictures and formatting.',
        exp: [
            'clipboard := "my text"   ; Give the clipboard entirely new contents.',
            'clipboard := ""   ; Empty the clipboard.',
            'clipboard := clipboard   ; Convert any copied files, HTML, or other formatted text to plain text.',
            'clipboard := clipboard " Text to append."   ; Append some text to the clipboard.',
            'StringReplace, clipboard, clipboard, ABC, DEF, All   ; Replace all occurrences of ABC with DEF (also converts the clipboard to plain text).',
        ],
    },
    {
        keyRawName: 'ClipboardAll',
        link: 'https://www.autohotkey.com/docs/v1/misc/Clipboard.htm#ClipboardAll',
        doc: '_ClipboardAll_ contains everything on the clipboard (such as pictures and formatting). It is most commonly used to save the clipboard\'s contents so that the script can temporarily use the clipboard for an operation.',
        exp: [
            'ClipSaved := ClipboardAll   ; Save the entire clipboard to a variable of your choice.',
            '; ... here make temporary use of the clipboard, such as for pasting Unicode text via Transform Unicode ...',
            'Clipboard := ClipSaved   ; Restore the original clipboard. Note the use of Clipboard (not ClipboardAll).',
            'ClipSaved := ""   ; Free the memory in case the clipboard was very large.',
        ],
    },
    {
        keyRawName: 'ComSpec',
        link: 'https://www.autohotkey.com/docs/v1/Variables.htm#ComSpec',
        doc: 'Contains the same string as the environment\'s ComSpec variable. Often used with [Run/RunWait](https://www.autohotkey.com/docs/v1/lib/Run.htm). For example: `C:\\Windows\\system32\\cmd.exe`',
        exp: [
            ';Runs the dir command in minimized state and stores the output in a text file. After that, the text file and its properties dialog will be opened.',
            '',
            '#Persistent',
            'RunWait, %ComSpec% /c dir C:\\ >>C:\\DirTest.txt, , Min',
            'Run, C:\\DirTest.txt',
            'Run, properties C:\\DirTest.txt',
        ],
    },
    {
        keyRawName: 'ErrorLevel',
        link: 'https://www.autohotkey.com/docs/v1/misc/ErrorLevel.htm',
        doc: 'This is a built-in variable that is set to indicate the success or failure of some of the commands (not all commands change the value of ErrorLevel). A value of 0 usually indicates success, and any other value usually indicates failure. You can also set the value of ErrorLevel yourself.',
        exp: [
            '; Waits a maximum of 1 second until MyWindow exists. If WinWait times out, ErrorLevel is set to 1, otherwise to 0.',
            '',
            'WinWait, MyWindow,, 1',
            'if (ErrorLevel != 0)   ; i.e. it\'s not blank or zero.',
            '    MsgBox, The window does not exist.',
            'else',
            '    MsgBox, The window exists.',
        ],
    },
    {
        keyRawName: 'False',
        doc: '`0` to represent `false`. They can be used to make a script more readable. For details, see [Boolean Values](https://www.autohotkey.com/docs/v1/Concepts.htm#boolean).',
        link: 'https://www.autohotkey.com/docs/v1/Variables.htm#misc',
        exp: [
            'False',
            'false',
        ],
    },
    {
        keyRawName: 'ProgramFiles',
        link: 'https://www.autohotkey.com/docs/v1/Variables.htm#ProgramFiles',
        doc: [
            'The Program Files directory (e.g. `C:\\Program Files` or `C:\\Program Files (x86)`). This is usually the same as the _ProgramFiles_ [environment variable](https://www.autohotkey.com/docs/v1/Concepts.htm#environment-variables).',
            '',
            'On [64-bit systems](https://www.autohotkey.com/docs/v1/Variables.htm#Is64bitOS) (and not 32-bit systems), the following applies:',
            '',
            '- If the executable (EXE) that is running the script is 32-bit, A_ProgramFiles returns the path of the "Program Files (x86)" directory.',
            '- For 32-bit processes, the _ProgramW6432_ environment variable contains the path of the 64-bit Program Files directory. On Windows 7 and later, it is also set for 64-bit processes.',
            '- The _ProgramFiles(x86)_ environment variable contains the path of the 32-bit Program Files directory.',
            '',
            '[[v1.0.43.08+]](https://www.autohotkey.com/docs/v1/ChangeLogHelp.htm#Older_Changes "Applies to AutoHotkey v1.0.43.08 and later"): The A_ prefix may be omitted, which helps ease the transition to [#NoEnv](https://www.autohotkey.com/docs/v1/lib/_NoEnv.htm).',
        ].join('\n'),
        exp: [
            'ProgramFiles or A_ProgramFiles',
            '',
            '; Retrieves the version of the file "AutoHotkey.exe" located in AutoHotkey\'s installation directory and stores it in Version.',
            '',
            'FileGetVersion, Version, % A_ProgramFiles "\\AutoHotkey\\AutoHotkey.exe"',
            'MsgBox % "ahk Version is " Version',
        ],
    },
    {
        keyRawName: 'True',
        doc: '`1` to represent `true`. They can be used to make a script more readable. For details, see [Boolean Values](https://www.autohotkey.com/docs/v1/Concepts.htm#boolean).',
        link: 'https://www.autohotkey.com/docs/v1/Variables.htm#misc',
        exp: [
            'true',
            'True',
        ],
    },
    {
        keyRawName: 'this',
        doc: 'this ... i can\'t find documentation for "this"',
        link: 'https://www.autohotkey.com/docs/v1/Objects.htm#Custom_NewDelete',
        exp: [
            'm1 := new GMem(0, 20)',
            '',
            'class GMem',
            '{',
            '    __New(aFlags, aSize)',
            '    {',
            '        this.ptr := DllCall("GlobalAlloc", "UInt", aFlags, "Ptr", aSize, "Ptr")',
            '        if !this.ptr',
            '            return ""',
            '        MsgBox % "New GMem of " aSize " bytes at address " this.ptr "."',
            '        return this  ; This line can be omitted when using the \'new\' operator.',
            '    }',
            '',
            '    __Delete()',
            '    {',
            '        MsgBox % "Delete GMem at address " this.ptr "."',
            '        DllCall("GlobalFree", "Ptr", this.ptr)',
            '    }',
            '}',
        ],
    },
];
