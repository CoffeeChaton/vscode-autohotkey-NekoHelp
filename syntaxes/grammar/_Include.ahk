;https://www.autohotkey.com/docs/v1/lib/_Include.htm#Examples
#Include C:\My Documents\Scripts\Utility Subroutines.ahk ;Comment
#Include %A_ScriptDir% ;Comment
#Include C:\My Scripts ;Comment

#Include FileOrDirName
#Include <LibName>
#IncludeAgain FileOrDirName

#Include *i FileOrDirName
#Include *i <LibName>
#IncludeAgain *i FileOrDirName

#IncludeAgain %A_ScriptDir%
#IncludeAgain %A_AppData%
#IncludeAgain %A_AppDataCommon%
#IncludeAgain %A_LineFile%
