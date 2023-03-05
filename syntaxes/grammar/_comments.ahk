;https://www.autohotkey.com/docs/v1/Language.htm#comments
; This entire line is a comment.
Run Notepad ; This is a comment on the same line as a command.
Run Notepad; not comment

/*
MsgBox, This line is commented out (disabled).
MsgBox, Common mistake: */ this does not end the comment.
MsgBox, This line is commented out. 
*/

#NoEnv ;Comment
#Hotstring EndChars -()[]{}':;"/\,.?!`n `t ;Comment

#Hotstring EndChars - ()[]{}': ;Comment

MsgBox, % Abs(-1.2) ;Comment Returns 1.2
