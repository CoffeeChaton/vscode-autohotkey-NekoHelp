/* eslint-disable no-template-curly-in-string */

type TAhk2exeDataElement = {
    keyRawName: string,
    body: string,
    link: `https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#${string}`,
    doc: string,
    exp: readonly string[],
};

// TODO /*@Ahk2Exe-Keep\n$0\n*/
// const _keep = {
//     keyRawName: 'Keep',
//     link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#IgnoreKeep',
//     doc: 'The reverse is also possible, i.e. marking a code section to only be executed in the compiled script:',
//     body: '/*@Ahk2Exe-Keep\n$0\n*/',
//     exp: [
//         '/*@Ahk2Exe-Keep',
//         'MsgBox This message appears only in the compiled script',
//         '*/',
//         'MsgBox This message appears in both the compiled and unCompiled script',
//     ],
// };

/**
 * after initialization clear
 */
export const Ahk2exeData: TAhk2exeDataElement[] = [
    {
        keyRawName: 'IgnoreBegin',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#IgnoreKeep',
        doc: 'It is possible to remove code sections from the compiled script by wrapping them in directives:',
        body: ';@Ahk2Exe-IgnoreBegin\n;@Ahk2Exe-IgnoreEnd',
        exp: [
            'MsgBox This message appears in both the compiled and unCompiled script',
            ';@Ahk2Exe-IgnoreBegin',
            'MsgBox This message does NOT appear in the compiled script',
            ';@Ahk2Exe-IgnoreEnd',
            'MsgBox This message appears in both the compiled and unCompiled script',
        ],
    },
    {
        keyRawName: 'IgnoreEnd',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#IgnoreKeep',
        doc: 'It is possible to remove code sections from the compiled script by wrapping them in directives:',
        body: ';@Ahk2Exe-IgnoreEnd',
        exp: [
            'MsgBox This message appears in both the compiled and unCompiled script',
            ';@Ahk2Exe-IgnoreBegin',
            'MsgBox This message does NOT appear in the compiled script',
            ';@Ahk2Exe-IgnoreEnd',
            'MsgBox This message appears in both the compiled and unCompiled script',
        ],
    },
    {
        keyRawName: 'AddResource',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#AddResource',
        doc: 'Adds a resource to the compiled executable. (Also see [UseResourceLang](https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#UseResourceLang) below)',
        body: ';@Ahk2Exe-AddResource ${1:FileName} [, ${2:ResourceName}]',
        exp: [
            ';Example 1: To replace the standard icons (other than the main icon):',
            ';@Ahk2Exe-AddResource Icon1.ico, 160  ; Replaces \'H on blue\'',
            ';@Ahk2Exe-AddResource Icon2.ico, 206  ; Replaces \'S on green\'',
            ';@Ahk2Exe-AddResource Icon3.ico, 207  ; Replaces \'H on red\'',
            ';@Ahk2Exe-AddResource Icon4.ico, 208  ; Replaces \'S on red\'',
            '',
            ';Example 2: [v1.1.34+] To include another script as a separate RCDATA resource (see Embedded Scripts):',
            ';@Ahk2Exe-AddResource MyScript1.ahk, #2',
            ';@Ahk2Exe-AddResource MyScript2.ahk, MYRESOURCE',
        ],
    },
    {
        keyRawName: 'Bin',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#Bin',
        doc: 'Specifies the base version of AutoHotkey to be used to generate the .exe file. This directive may be overridden by a base file parameter specified in the GUI or CLI. This directive can be specified many times if necessary, but only in the top level script file (i.e. not in an [#Include](https://www.autohotkey.com/docs/v1/lib/_Include.htm) file). The compiler will be run at least once for each Bin/Base directive found. (If an actual comment is appended to this directive, it must use the `;` flag. To truly comment out this directive, insert a space after the first comment flag.)',
        body: ';@Ahk2Exe-Bin',
        exp: [
            ';@Ahk2Exe-Bin  [Path]Name [, [Exe_path][Name], Codepage] ; Deprecated',
            ';@Ahk2Exe-Base [Path]Name [, [Exe_path][Name], Codepage] ; [v1.1.33.10+]',
        ],
    },
    {
        keyRawName: 'Base',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#Bin',
        doc: 'Specifies the base version of AutoHotkey to be used to generate the .exe file. This directive may be overridden by a base file parameter specified in the GUI or CLI. This directive can be specified many times if necessary, but only in the top level script file (i.e. not in an [#Include](https://www.autohotkey.com/docs/v1/lib/_Include.htm) file). The compiler will be run at least once for each Bin/Base directive found. (If an actual comment is appended to this directive, it must use the `;` flag. To truly comment out this directive, insert a space after the first comment flag.)',
        body: ';@Ahk2Exe-Base ${1:path_name} [,${2:Exe_path} ,${3:Codepage} ]',
        exp: [
            ';@Ahk2Exe-Bin  [Path]Name [, [Exe_path][Name], Codepage] ; Deprecated',
            ';@Ahk2Exe-Base [Path]Name [, [Exe_path][Name], Codepage] ; [v1.1.33.10+]',
        ],
    },
    {
        keyRawName: 'ConsoleApp',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#ConsoleApp',
        doc: 'Changes the executable subsystem to Console mode.',
        body: ';@Ahk2Exe-ConsoleApp',
        exp: [
            ';@Ahk2Exe-ConsoleApp',
        ],
    },
    {
        keyRawName: 'Cont',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#Cont',
        doc: 'Specifies a continuation line for the preceding directive. This allows a long-lined directive to be formatted so that it is easy to read in the source code.',
        body: ';@Ahk2Exe-Cont ${1:text}',
        exp: [
            ';@Ahk2Exe-Cont Text',
        ],
    },
    {
        keyRawName: 'Debug',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#Debug',
        doc: 'Shows a message box with the supplied text, for debugging purposes.',
        body: ';@Ahk2Exe-Debug',
        exp: [';@Ahk2Exe-Debug'],
    },
    {
        keyRawName: 'ExeName',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#ExeName',
        doc: 'Specifies the location and name given to the generated .exe file. (Also see the [Base](https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#Bin) directive.) This directive may be overridden by an output file specified in the GUI or CLI.',
        body: ';@Ahk2Exe-ExeName ${1:Path\\name}',
        exp: [
            ';@Ahk2Exe-Obey U_bits, = %A_PtrSize% * 8',
            ';@Ahk2Exe-Obey U_type, = "%A_IsUnicode%" ? "Unicode" : "ANSI"',
            ';@Ahk2Exe-ExeName %A_ScriptName~\\.[^\\.]+$%_%U_type%_%U_bits%',
        ],
    },
    {
        keyRawName: 'Let',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#Let',
        doc: 'Creates (or modifies) one or more user variables which can be accessed by `%U__Name_%`, similar to the built-in variables (see above).',
        body: ';@Ahk2Exe-Let ${1:Name} = ${2:Value} ,$0 ${3:[Name = Value]}',
        exp: [
            ';@Ahk2Exe-Let Name = Value , Name = Value, ...',
            ';@Ahk2Exe-Let U_company = %A_PriorLine~U)^(.+"){3}(.+)".*$~$2%',
            ';@Ahk2Exe-Let U_version = %A_PriorLine~U)^(.+"){1}(.+)".*$~$2%',
        ],
    },
    {
        keyRawName: 'Nop',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#Nop',
        doc: 'Does nothing.',
        body: ';@Ahk2Exe-Nop ${1:Text}',
        exp: [
            'Ver := A_AhkVersion "" ; If quoted literal not empty, do \'SetVersion\'',
            ';@Ahk2Exe-Obey U_V, = "%A_PriorLine~U)^(.+")(.*)".*$~$2%" ? "SetVersion" : "Nop"',
            ';              ->                                        ->                 ^^^',
            ';@Ahk2Exe-%U_V%        %A_AhkVersion%%A_PriorLine~U)^(.+")(.*)".*$~$2%',
            ';           ^ "Nop" or "SetVersion"',
        ],
    },
    {
        keyRawName: 'Obey',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#Obey',
        doc: 'Obeys isolated AutoHotkey commands or expressions, with result in `U__Name_`.',
        body: ';@Ahk2Exe-Obey ${1:Name}, ${2:CmdOrExp} [, ${3:Extra}]',
        exp: [
            ';@Ahk2Exe-Obey U_date, FormatTime U_date`, R D2 T2',
            ';@Ahk2Exe-Obey U_type, = "%A_IsUnicode%" ? "Unicode" : "ANSI"',
            ';@Ahk2Exe-Obey U_bits, U_bits := %A_PtrSize% * 8',
            '',
            ';@Ahk2Exe-Obey U_au, = "%A_IsUnicode%" ? 2 : 1    ; Script ANSI or Unicode?',
            ';@Ahk2Exe-Obey U_bits, = %A_PtrSize% * 8',
            ';@Ahk2Exe-Obey U_bits, U_bits := %A_PtrSize% * 8',
            ';@Ahk2Exe-Obey U_date, FormatTime U_date`, R D2 T2',
            ';@Ahk2Exe-Obey U_type, = "%A_IsUnicode%" ? "Unicode" : "ANSI"',
            ';@Ahk2Exe-Obey U_V, = "%A_PriorLine~U)^(.+")(.*)".*$~$2%" ? "SetVersion" : "Nop"',
        ],
    },
    {
        keyRawName: 'PostExec',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#PostExec',
        doc: 'Specifies a program to be executed after a successful compilation, before (or after) any [Compression](https://www.autohotkey.com/docs/v1/Scripts.htm#mpress) is applied to the .exe. This directive can be present many times and will be executed in the order encountered by the compiler, in the appropriate queue as specified by the _When_ parameter.',
        body:
            ';@Ahk2Exe-PostExec ${1:Program} ${2:[parameters]} [, ${3:When}, ${4:WorkingDir}, ${5:Hidden}, ${6:IgnoreErrors}]',
        exp: [
            ';@Ahk2Exe-Obey U_au, = "%A_IsUnicode%" ? 2 : 1    ; Script ANSI or Unicode?',
            ';@Ahk2Exe-PostExec "BinMod.exe" "%A_WorkFileName%"',
            ';@Ahk2Exe-Cont  "%U_au%2.>AUTOHOTKEY SCRIPT<. DATA      ',
            '',
            ';@Ahk2Exe-PostExec "BinMod.exe" "%A_WorkFileName%"',
            ';@Ahk2Exe-Cont  "11.UPX." "1.UPX!.", 2',
        ],
    },
    {
        keyRawName: 'ResourceID',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#ResourceID',
        doc: 'Assigns a non-standard resource ID to be used for the main script for compilations which use an [.exe base file](https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#Bin) (see [Embedded Scripts](https://www.autohotkey.com/docs/v1/Program.htm#embedded-scripts)). This directive may be overridden by a Resource ID specified in the GUI or CLI. This directive is ignored if it appears in a script inserted by the [AddResource](https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#AddResource) directive.',
        body: ';@Ahk2Exe-ResourceID ${1:Name}',
        exp: [
            ';@Ahk2Exe-ResourceID Name',
        ],
    },
    {
        keyRawName: 'SetMainIcon',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetMainIcon',
        doc: 'Overrides the custom EXE icon used for compilation. (To change the other icons, see the [AddResource](https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#AddResource) example.) This directive may be overridden by an icon file specified in the GUI or CLI. The new icon might not be immediately visible in Windows Explorer if the compiled file existed before with a different icon, however the new icon can be shown by selecting `Refresh Windows Icons` from the Ahk2Exe `File` menu.',
        body: ';@Ahk2Exe-SetMainIcon ${1:IcoFile}',
        exp: [
            ';@Ahk2Exe-SetMainIcon IcoFile',
            ';@Ahk2Exe-SetMainIcon AhkXXX.ico',
            ';@Ahk2Exe-SetMainIcon cat.ico',
        ],
    },
    {
        keyRawName: 'SetCompanyName',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the company name.',
        body: ';@Ahk2Exe-SetCompanyName ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetCompanyName Value',
            ';@Ahk2Exe-SetCompanyName neko-help',
        ],
    },
    {
        keyRawName: 'SetCopyright',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the legal copyright information.',
        body: ';@Ahk2Exe-SetCopyright ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetCopyright Value',
            ';@Ahk2Exe-SetCopyright Copyright (c) since 2022',
        ],
    },
    {
        keyRawName: 'SetDescription',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the legal copyright information.',
        body: ';@Ahk2Exe-SetDescription ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetDescription Value',
            ';@Ahk2Exe-SetDescription AutoHotkey Script Compiler',
        ],
    },
    {
        keyRawName: 'SetFileVersion',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the file version, in both text and raw binary format. (See Version below, for more details.)',
        body: ';@Ahk2Exe-SetFileVersion ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetFileVersion Value',
            ';@Ahk2Exe-SetFileVersion 0.0.18',
        ],
    },
    {
        keyRawName: 'SetInternalName',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the internal name.',
        body: ';@Ahk2Exe-SetInternalName ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetInternalName Value',
        ],
    },
    {
        keyRawName: 'SetLanguage',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the [language code](https://www.autohotkey.com/docs/v1/misc/Languages.htm). Please note that hexadecimal numbers must have an `0x` prefix.',

        body: ';@Ahk2Exe-SetLanguage ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetLanguage Value',
        ],
    },
    {
        keyRawName: 'SetLegalTrademarks',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the legal trademarks information.',
        body: ';@Ahk2Exe-SetLegalTrademarks ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetLegalTrademarks Value',
        ],
    },
    {
        keyRawName: 'SetName',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the product name and the internal name.',
        body: ';@Ahk2Exe-SetName ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetName Value',
        ],
    },
    {
        keyRawName: 'SetOrigFilename',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the original filename information.',
        body: ';@Ahk2Exe-SetOrigFilename ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetOrigFilename Value',
            ';@Ahk2Exe-SetOrigFilename XXX.ahk',
        ],
    },
    {
        keyRawName: 'SetProductName',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the product name.',
        body: ';@Ahk2Exe-SetProductName ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetProductName Value',
            ';@Ahk2Exe-SetProductName DllExportViewer',
        ],
    },
    {
        keyRawName: 'SetProductVersion',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the product version, in both text and raw binary format. (See Version below, for more details.)',
        body: ';@Ahk2Exe-SetProductVersion ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetProductVersion Value',
            ';@Ahk2Exe-SetProductVersion 1.1.36',
        ],
    },
    {
        keyRawName: 'SetVersion',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp',
        doc: 'Changes the file version and the product version, in both text and raw binary format.\nAhk2Exe fills the binary version fields with the period-delimited numbers (up to four) that may appear at the beginning of the version text. Unfilled fields are set to zero. For example, `1.3-alpha` would produce a binary version number of `1.3.0.0`. If this property is not modified, it defaults to the AutoHotkey version used to compile the script.',
        body: ';@Ahk2Exe-SetVersion ${1:Value}',
        exp: [
            ';@Ahk2Exe-SetVersion Value',
            ';@Ahk2Exe-SetVersion     2022.12.17',
        ],
    },
    {
        keyRawName: 'Set',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#Set',
        doc: 'Changes other miscellaneous properties in the compiled executable\'s version information not covered by the [SetProp](https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#SetProp) directive. Note that all properties are processed in alphabetical order, regardless of the order they are specified. This directive is for specialised use only.',
        body: ';@Ahk2Exe-Set ${1:Prop}, ${2:Value}',
        exp: [
            ';@Ahk2Exe-Set Prop, Value',
        ],
    },
    {
        keyRawName: 'UpdateManifest',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#UpdateManifest',
        doc: 'Changes details in the .exe\'s manifest. This directive is for specialised use only.',
        body: ';@Ahk2Exe-UpdateManifest ${1:RequireAdmin} [, ${2:Name}, ${3:Version}, ${4:UIAccess}]',
        exp: [
            ';@Ahk2Exe-UpdateManifest RequireAdmin , Name, Version, UIAccess',
        ],
    },
    {
        keyRawName: 'UseResourceLang',
        link: 'https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#UpdateManifest',
        doc: 'Changes the resource language used by [AddResource](https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#AddResource). This directive is positional and affects all [AddResource](https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#AddResource) directives that follow it.',
        body: ';@Ahk2Exe-UseResourceLang LangCode',
        exp: [
            ';@Ahk2Exe-UseResourceLang LangCode',
        ],
    },
];
