MsgBox % "This message appears in both the compiled and unCompiled script"
;@Ahk2Exe-IgnoreBegin
MsgBox % "This message does NOT appear in the compiled script"
;@Ahk2Exe-IgnoreEnd
MsgBox % "This message appears in both the compiled and unCompiled script"
MsgBox % "This message appears in both the compiled and unCompiled script"


;@Ahk2Exe-IgnoreBegin
MsgBox % "This message does NOT appear in the compiled script"
;@Ahk2Exe-IgnoreEnd
MsgBox % "This message appears in both the compiled and unCompiled script"


;Example 1: To replace the standard icons (other than the main icon):
;@Ahk2Exe-AddResource Icon1.ico, 160  ; Replaces 'H on blue'
;@Ahk2Exe-AddResource Icon2.ico, 206  ; Replaces 'S on green'
;@Ahk2Exe-AddResource Icon3.ico, 207  ; Replaces 'H on red'
;@Ahk2Exe-AddResource Icon4.ico, 208  ; Replaces 'S on red'

;Example 2: [v1.1.34+] To include another script as a separate RCDATA resource (see Embedded Scripts):
;@Ahk2Exe-AddResource MyScript1.ahk, #2
;@Ahk2Exe-AddResource MyScript2.ahk, MYRESOURCE
;@Ahk2Exe-Bin  [Path]Name [, [Exe_path][Name], Codepage] ; Deprecated
;@Ahk2Exe-Base [Path]Name [, [Exe_path][Name], Codepage] ; [v1.1.33.10+]
;@Ahk2Exe-Bin  [Path]Name [, [Exe_path][Name], Codepage] ; Deprecated
;@Ahk2Exe-Base [Path]Name [, [Exe_path][Name], Codepage] ; [v1.1.33.10+]
;@Ahk2Exe-ConsoleApp
;@Ahk2Exe-Cont Text
;@Ahk2Exe-Debug
;@Ahk2Exe-Obey U_bits, = %A_PtrSize% * 8
;@Ahk2Exe-Obey U_type, = "%A_IsUnicode%" ? "Unicode" : "ANSI"
;@Ahk2Exe-ExeName %A_ScriptName~\\.[^\\.]+$%_%U_type%_%U_bits%
;@Ahk2Exe-Let Name = Value , Name = Value, ...
;@Ahk2Exe-Let U_company = %A_PriorLine~U)^(.+"){3}(.+)".*$~$2%
;@Ahk2Exe-Let U_version = %A_PriorLine~U)^(.+"){1}(.+)".*$~$2%


Ver := A_AhkVersion "" ; If quoted literal not empty, do \'SetVersion\'
;@Ahk2Exe-Obey U_V, = "%A_PriorLine~U)^(.+")(.*)".*$~$2%" ? "SetVersion" : "Nop"
;              ->                                        ->                 ^^^
;@Ahk2Exe-%U_V%        %A_AhkVersion%%A_PriorLine~U)^(.+")(.*)".*$~$2%
;           ^ "Nop" or "SetVersion"


;@Ahk2Exe-Obey U_date, FormatTime U_date`, R D2 T2
;@Ahk2Exe-Obey U_type, = "%A_IsUnicode%" ? "Unicode" : "ANSI"
;@Ahk2Exe-Obey U_bits, U_bits := %A_PtrSize% * 8

;@Ahk2Exe-Obey U_au, = "%A_IsUnicode%" ? 2 : 1 ; Script ANSI or Unicode?
;@Ahk2Exe-Obey U_bits, = %A_PtrSize% * 8
;@Ahk2Exe-Obey U_bits, U_bits := %A_PtrSize% * 8
;@Ahk2Exe-Obey U_date, FormatTime U_date`, R D2 T2
;@Ahk2Exe-Obey U_type, = "%A_IsUnicode%" ? "Unicode" : "ANSI"
;@Ahk2Exe-Obey U_V, = "%A_PriorLine~U)^(.+")(.*)".*$~$2%" ? "SetVersion" : "Nop"
;@Ahk2Exe-Obey U_au, = "%A_IsUnicode%" ? 2 : 1 ; Script ANSI or Unicode?
;@Ahk2Exe-PostExec "BinMod.exe" "%A_WorkFileName%"
;@Ahk2Exe-Cont  "%U_au%2.>AUTOHOTKEY SCRIPT<. DATA      

;@Ahk2Exe-PostExec "BinMod.exe" "%A_WorkFileName%"
;@Ahk2Exe-Cont  "11.UPX." "1.UPX!.", 2
;@Ahk2Exe-ResourceID Name
;@Ahk2Exe-SetMainIcon IcoFile
;@Ahk2Exe-SetMainIcon AhkXXX.ico
;@Ahk2Exe-SetMainIcon cat.ico
;@Ahk2Exe-SetCompanyName Value
;@Ahk2Exe-SetCompanyName neko-help
;@Ahk2Exe-SetCopyright Value
;@Ahk2Exe-SetCopyright Copyright (c) since 2022
;@Ahk2Exe-SetDescription Value
;@Ahk2Exe-SetDescription AutoHotkey Script Compiler
;@Ahk2Exe-SetFileVersion Value
;@Ahk2Exe-SetFileVersion 0.0.18
;@Ahk2Exe-SetInternalName Value
;@Ahk2Exe-SetLanguage Value
;@Ahk2Exe-SetLegalTrademarks Value
;@Ahk2Exe-SetName Value
;@Ahk2Exe-SetOrigFilename Value
;@Ahk2Exe-SetOrigFilename XXX.ahk
;@Ahk2Exe-SetProductName Value
;@Ahk2Exe-SetProductName DllExportViewer
;@Ahk2Exe-SetProductVersion Value
;@Ahk2Exe-SetProductVersion 1.1.36
;@Ahk2Exe-SetVersion Value
;@Ahk2Exe-SetVersion     2022.12.17
;@Ahk2Exe-Set Prop, Value
;@Ahk2Exe-UpdateManifest RequireAdmin , Name, Version, UIAccess
;@Ahk2Exe-UseResourceLang LangCode



;https://www.autohotkey.com/docs/v1/misc/Ahk2ExeDirectives.htm#IgnoreKeep
/*@Ahk2Exe-Keep
MsgBox This message appears only in the compiled script
*/
MsgBox % "This message appears in both the compiled and uncompiled script"