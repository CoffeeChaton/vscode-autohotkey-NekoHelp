; https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Blank
;@ahk-neko-format-ignore-start

GuiControl , MyGui:Show , MyButton 
GuiControl , MyGui: , MyListBox , Item1|Item2

GuiControl,, MyListBox, |Red|Green|Blue
GuiControl, , MyEdit, New text line 1.`nNew text line 2.
GuiControl, , MyRadio2, 1
GuiControl, Move, OK, x100 y200
GuiControl, Focus, LastName
GuiControl, Move, MyEdit, x10 y20 w200 h100

GuiControl, 3: +AltSubmit -g +5 -0, MyListBox
GuiControl, 4: +Default, MyListBox
GuiControl, 5: +g, ControlID, % FuncObj

GuiControl, 3:+AltSubmit -g +5 -0, MyListBox
GuiControl, 4:+Default, MyListBox
GuiControl, 5:+g, ControlID, % FuncObj