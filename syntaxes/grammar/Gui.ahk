Gui, Add, UpDown, vMyUpDown Range1-10, 5
; https://www.autohotkey.com/docs/v1/lib/GuiControls.htm#UpDown
Gui, Add, UpDown, vMyUpDown Range1-1000, 5
Gui, Add, UpDown, vMyUpDown Range-50-50, 5
Gui, Add, UpDown, vMyUpDown Range-10--5, 5

; Range(?:-)?\d
; https://www.autohotkey.com/docs/v1/lib/GuiControls.htm#UpDown_Options

Gui, 2: + Minimize
Gui, 2: - Minimize
Gui, 2: -Minimize
Gui, 2: -Minimize
Gui, 2: Add
;    2: color should be variable.other.constant.gui.name.ahk

Gui, guiName: + Minimize
Gui, guiName: - Minimize
Gui, guiName: -Minimize
Gui, guiName: Add
;    guiName: color should be variable.other.constant.gui.name.ahk

; Gui, add https://www.autohotkey.com/docs/v1/lib/GuiControls.htm
Gui, add, Text
Gui, add, Edit
Gui, add, UpDown
Gui, add, Picture
Gui, add, Button
Gui, add, Checkbox
Gui, add, Radio
Gui, add, DropDownList
Gui, add, ComboBox
Gui, add, ListBox
Gui, add, ListView
Gui, add, TreeView
Gui, add, Link
Gui, add, Hotkey
Gui, add, DateTime
Gui, add, MonthCal
Gui, add, Slider
Gui, add, Progress
Gui, add, GroupBox
Gui, add, Tab
Gui, add, StatusBar
Gui, add, ActiveX
Gui, add, Custom