/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-template-curly-in-string */

type TStatement2Element = Readonly<{
    keyRawName: string,
    body: string,
    doc: string,
    link:
        | 'https://www.autohotkey.com/docs/v1/lib/LoopReg.htm#new'
        | `https://www.autohotkey.com/docs/v1/lib/${'If' | 'Loop'}${string}.htm`,
    exp: readonly string[],
}>;

/**
 * after initialization clear
 * FlowOfControl
 * FOC
 */
export const statement2Data: TStatement2Element[] = [
    {
        keyRawName: 'IfBetween',
        body: 'If ${1:Var} ${2|not, |} between ${3:Low} and ${4:High}',
        doc: 'Checks whether a [variable\'s](https://www.autohotkey.com/docs/v1/Variables.htm) contents are numerically or alphabetically between two values (inclusive).',
        link: 'https://www.autohotkey.com/docs/v1/lib/IfBetween.htm',
        exp: [
            'if var between 1 and 5',
            '    MsgBox, % var " is in the range 1 to 5, inclusive."',
        ],
    },
    {
        keyRawName: 'IfContains',
        body: 'If ${1:Var} ${2|not, |} contains ${3:Value,Value2}',
        doc: 'Checks whether a [variable\'s](https://www.autohotkey.com/docs/v1/Variables.htm) contents match one of the items in a list.',
        link: 'https://www.autohotkey.com/docs/v1/lib/IfIn.htm',
        exp: [
            'if var contains 1,3  ; Note that it compares the values as strings, not numbers.',
            '    MsgBox % "Var contains the digit 1 or 3 (Var could be 1, 3, 10, 21, 23, etc.)"',
        ],
    },
    {
        keyRawName: 'IfIn',
        body: 'If ${1:Var} ${2|not, |} in ${3:Value,Value2}',
        doc: 'Checks whether a [variable\'s](https://www.autohotkey.com/docs/v1/Variables.htm) contents match one of the items in a list.',
        link: 'https://www.autohotkey.com/docs/v1/lib/IfIn.htm',
        exp: [
            'if var in exe,bat,com',
            '    MsgBox % "The file extension is an executable type."',
        ],
    },
    {
        keyRawName: 'IfIs',
        body: 'If ${1:Var} is ${2|not, |} ${3|integer,float,number,digit,XDigit,alpha,upper,lower,alnum,space,time|}',
        doc: 'Checks whether a variable\'s contents are numeric, uppercase, etc.',
        link: 'https://www.autohotkey.com/docs/v1/lib/IfIs.htm',
        exp: [
            'if var is float',
            '    MsgBox, % var " is a floating point number."',
        ],
    },
    {
        keyRawName: 'LoopFiles',
        body: 'Loop, Files, ${1:FilePattern}, ${2:Mode_DRF}',
        doc: 'Retrieves the specified files or folders, one at a time.',
        link: 'https://www.autohotkey.com/docs/v1/lib/LoopFile.htm',
        exp: [
            'Loop Files, % A_ProgramFiles "\\*.txt", R  ; Recurse into subfolders.',
            '{',
            '    MsgBox, 4, , Filename = %A_LoopFileFullPath%`n`nContinue?',
            '    IfMsgBox, No',
            '        break',
            '}',
        ],
    },
    {
        keyRawName: 'LoopParse',
        body: 'Loop, Parse, ${2:InputVar} [, ${3:Delimiters_or_CSV}, ${4:OmitChars}]',
        doc: 'Retrieves substrings (fields) from a string, one at a time.',
        link: 'https://www.autohotkey.com/docs/v1/lib/LoopParse.htm',
        exp: [
            'Colors := "red,green,blue"',
            'Loop, Parse, Colors, `,',
            '    MsgBox, % "Color number " A_Index " is " A_LoopField "."',
            '',
            'Loop, Parse, clipboard, `n, `r',
            '{',
            '    MsgBox, 4, ,% "File number " A_Index " is " A_LoopField ".`n`nContinue?"',
            '    IfMsgBox, No',
            '        break',
            '}',
        ],
    },
    {
        keyRawName: 'LoopRead',
        body: 'Loop, Read, ${2:InputFile} [, ${3:OutputFile}]',
        doc: 'Retrieves the lines in a text file, one at a time (performs better than FileReadLine).',
        link: 'https://www.autohotkey.com/docs/v1/lib/LoopReadFile.htm',
        exp: [
            'Loop, Read, C:\\Log File.txt',
            '    last_line := A_LoopReadLine  ; When loop finishes, this will hold the last line.',
        ],
    },
    {
        keyRawName: 'LoopReg',
        body:
            'Loop, Reg, ${1|HKEY_LOCAL_MACHINE,HKEY_USERS,HKEY_CURRENT_USER,HKEY_CLASSES_ROOT,HKEY_CURRENT_CONFIG|}\\ $0 [, ${2:Mode_KVR}]',
        doc: 'Retrieves the contents of the specified registry subkey, one item at a time.',
        link: 'https://www.autohotkey.com/docs/v1/lib/LoopReg.htm',
        exp: [
            ';Deletes Internet Explorer\'s history of URLs typed by the user.',
            'Loop, HKEY_CURRENT_USER, Software\\Microsoft\\Internet Explorer\\TypedURLs',
            '    RegDelete',
        ],
    },
];
