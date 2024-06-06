
Menu, Tray, Add  ; Creates a separator line.
Menu, Tray, Add, Item1, MenuHandler  ; Creates a new menu item.

; Create the popup menu by adding some items to it.
Menu, MyMenu, Add, Item1, MenuHandler
Menu, MyMenu, Add, Item2, MenuHandler
Menu, MyMenu, Add  ; Add a separator line.

; Create another menu destined to become a submenu of the above menu.
Menu, Submenu1, Add, Item1, MenuHandler
Menu, Submenu1, Add, Item2, MenuHandler

; Create a submenu in the first menu (a right-arrow indicator). When the user selects it, the second menu is displayed.
Menu, MyMenu, Add, My Submenu, :Submenu1

Menu, MyMenu, Add  ; Add a separator line below the submenu.
Menu, MyMenu, Add, Item3, MenuHandler  ; Add another menu item beneath the submenu.
return ; End of script's auto-execute section.

MenuHandler:
    MsgBox You selected %A_ThisMenuItem% from the menu %A_ThisMenu%.
return

#z::  Menu, MyMenu, Show  ; i.e. press the Win-Z hotkey to show the menu.

Menu, Tray, Add ; separator
Menu, Tray, Add, TestToggle&Check
Menu, Tray, Add, TestToggleEnable
Menu, Tray, Add, TestDefault
Menu, Tray, Add, TestStandard
Menu, Tray, Add, TestDelete
Menu, Tray, Add, TestDeleteAll
Menu, Tray, Add, TestRename
Menu, Tray, Add, Test


TestToggle&Check:
{
    Menu, Tray, ToggleCheck, TestToggle&Check
    Menu, Tray, Enable, TestToggleEnable ; Also enables the next test since it can't undo the disabling of itself.
    Menu, Tray, Add, TestDelete ; Similar to above.
}
return


Menu, Tray, ToggleEnable, TestToggleEnable
Menu, Tray, NoDefault
Menu, Tray, Default, TestDefault
Menu, Tray, NoStandard
Menu, Tray, Standard
Menu, Tray, Delete, TestDelete
Menu, Tray, DeleteAll
Menu, Tray, Rename, %OldName%, %NewName%
Menu, FileMenu, Add, Script Icon, MenuHandler
Menu, FileMenu, Add, Suspend Icon, MenuHandler
Menu, FileMenu, Add, Pause Icon, MenuHandler
Menu, FileMenu, Icon, Script Icon, %A_AhkPath%, 2 ; Use the 2nd icon group from the file
Menu, FileMenu, Icon, Suspend Icon, %A_AhkPath%, -206 ; Use icon with resource identifier 206
Menu, FileMenu, Icon, Pause Icon, %A_AhkPath%, -207 ; Use icon with resource identifier 207
Menu, MyMenuBar, Add, &File, :FileMenu
Gui, Menu, MyMenuBar
Gui, Add, Button, gExit, Exit This Example
Gui, Show



Menu MyMenu, Add, Give parameters, % BoundGivePar
Menu MyMenu, Add, Give parameters2, % BoundGivePar2
Menu MyMenu, Show

Menu, MySubmenu, Add, Item1
Menu, Tray, Add, This menu item is a submenu, :MySubmenu

Menu,                    MySubmenu, Add, Item1,LabelOrSubmenu, +P1 +Radio +Right +Break +BarBreak
Menu MySubmenu  ,Add, Item1,LabelOrSubmenu, -P2-Radio -Right -Break -BarBreak

Menu Tray, Icon, HICON:*%handle%
Menu Tray, Icon, HBITMAP:*%handle%
Menu, Tray, Icon, Shell32.dll, 174