; https://www.autohotkey.com/boards/viewtopic.php?f=76&t=130159
Menus := {   "Menu1": {   "Title": "Notes", "SubMenus": "New,Open...,Save,Save As...,,Page Setup...,Print...,,Exit", "Icon":"", "IconSize": ""   }, "Menu2": {   "Title": "Text Manipulation", "SubMenus": "Undo,,Cut,Copy,Paste,Delete", "Icon": A_WinDir . "\system32\notepad.exe", "IconSize": "32"   }, "Menu3":{   "Title": "Format", "SubMenus": "Font,Word Wrap", "Icon":"", "IconSize": ""   }, "Menu4":{   "Title": "View", "SubMenus": "Zoom,StatusBar", "Icon":"", "IconSize": "32"   }, "Menu5":{   "Title": "Help", "SubMenus": "", "Icon":"C:\Windows\HelpPane.exe", "IconSize": "32"   }   }
Menus := 
	( LTrim Join Comments
		{
		"Menu1": {
		"Title": "Notes",
		"SubMenus": "New,Open...,Save,Save As...,,Page Setup...,Print...,,Exit",
		"Icon":"",
		"IconSize": ""
		},

		"Menu2": {
		"Title": "Text Manipulation",
		"SubMenus": "Undo,,Cut,Copy,Paste,Delete",
		"Icon": A_WinDir . "\system32\notepad.exe",
		"IconSize": "32"
		},

		"Menu3":{
		"Title": "Format",
		"SubMenus": "Font,Word Wrap",
		"Icon":"",
		"IconSize": ""
		},

		"Menu4":{
		"Title": "View",
		"SubMenus": "Zoom,StatusBar",
		"Icon":"",
		"IconSize": "32"
		},

		"Menu5":{
		"Title": "Help",
		"SubMenus": "",
		"Icon":"C:\Windows\HelpPane.exe",
		"IconSize": "32"
		}
		}
	)

c := new ContextMenu(Menus)
ContextMenu.MenuShow()
Exit

MenuHandler(MenuTitle) {
	MsgBox % "User Has Clicked Menu Item: " MenuTitle
}


Class ContextMenu
{
	__New(Menus) {
		Static
		this.Menus 	 := Menus
		This.CreateMenu() 
	}


	CreateMenu() {
		Static
		; Use ObjBindMethod if the MenuHandler resides within the Class
		BoundFunc := "MenuHandler" ; BoundFunc := ObjBindMethod(this,"MenuHandler")

		For each, Item in this.Menus {
			If (This.Menus[each]["SubMenus"] != "") {
				Array := StrSplit(This.Menus[each]["SubMenus"], ",")
				Loop % Array.Length() {
					Menu, % each, Add, % Array[A_Index], % BoundFunc					
				}
			}
		}

		For each, Item in this.Menus {
			If (This.Menus[each]["SubMenus"] != "") 
				Menu, % "ContextMenu", Add, % This.Menus[each]["Title"], % ":" .  each
			Else
				Menu, % "ContextMenu", Add, % This.Menus[each]["Title"], % BoundFunc
		}

		For each, Item in this.Menus {
			MenuName := this.Menus[each]["Title"]
			IconPath := this.Menus[each]["Icon"]
			IconSize := this.Menus[each]["IconSize"]

			if (MenuName != "") and (IconPath != "")
				This.AddIcon(MenuName, IconPath, IconSize) 
		}

	}

	AddIcon(MenuName, IconPath, IconSize) {
		Menu, % "ContextMenu", Icon, % MenuName, % IconPath,, % IconSize
	}

	MenuShow() {
		Menu, ContextMenu, Show
	}
}