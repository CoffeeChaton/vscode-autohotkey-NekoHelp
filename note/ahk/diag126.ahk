obj := {a:999, " b":"1000"}
Var := ">=======<"
style1 := 0

; error exp #1
style1 =
( c ; use c-flag
" Var"  %Var% ; OK
case1 %Var% ; OK
;`%` variable name contains an illegal character
case2 % Var% ; beacuse ahk can't find var name like " Var"  <---space
case3 %obj.a% ; beacuse ahk can't find var name like "obj.a"  <---.
case4 %obj[" b"]% ; beacuse ahk can't find var name like "obj[" b"]"  <---.
    )

MsgBox, % style1

; original from https://github.com/AutoHotkey/Ahk2Exe/blob/master/Update.ahk#L145
; The original code has no errors, I just couldn't find a complex demonstration, so I added an error at this exp.
;
; if Multiline is very big, this diagnostic can help you find errors faster.

; error at Loop Read, % UpdDir%\Script3c.csv
;                      ^ error

;@ahk-neko-ignore 999 line;remove this line to use auto-diag https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag126

style2 := 0

style2 = 
(
#NoTrayIcon`nPar = %Par%`nwk := []
Loop Files, %UpdDir%\*.exe
	txt .= "``n``t" A_LoopFileName, fail .= (fail ? "|" : "") A_LoopFileName
IfExist %UpdDir%\Script3c.csv
{	Loop Read, %A2D%..\UX\installed-files.csv
	{	if (A_Index = 1)
		{	hdr := A_LoopReadLine
			for k, v in StrSplit(Hdr,",")
				if (v = "path")
					break
		}	else wk[StrSplit(A_LoopReadLine,",")[k]] := A_LoopReadLine
	}
	Loop Read, % UpdDir%\Script3c.csv
		if !(fail && A_LoopReadLine ~= "i)(" StrReplace(fail,".","\.") ")""")
			if StrSplit(A_LoopReadLine,"|").2 = "Delete"
				wk.Delete(StrSplit(A_LoopReadLine,"|").1)
			else wk[StrSplit(A_LoopReadLine,"|").1] := StrSplit(A_LoopReadLine,"|").2
	FileDelete             %A2D%..\UX\installed-files.csv
	FileAppend `%hdr`%``n, %A2D%..\UX\installed-files.csv
	for k, v in wk
		FileAppend `%v`%``n, %A2D%..\UX\installed-files.csv
}
IfNotExist %A2D%Ahk2Exe.exe
	Mess := "``n``nAhk2Exe deleted. To reinstall:``n v1 - run the AHK installer
	,``n v2 - press 'Windows/Start', find & run 'AutoHotkey', select 'Compile'."
if txt
	MsgBox 48, Ahk2Exe Updater, Failed to update:`%txt`%``n`%Mess`%
else MsgBox 64, Ahk2Exe Updater, Update completed successfully. `%Mess`%
IfExist %A2D%Ahk2Exe.exe
	RunAsUser("%A2D%Ahk2Exe.exe", "/Restart " Par, A_WorkingDir)

RunAsUser(target, args:="", workdir:="") {
	try ShellRun(target, args, workdir)
	catch e
		Run `% args="" ? target : target " " args, `% workdir
}
ShellRun(prms*)
{	shellWindows := ComObjCreate("Shell.Application").Windows
	VarSetCapacity(_hwnd, 4, 0)
	desktop := shellWindows.FindWindowSW(0, "", 8, ComObj(0x4003, &_hwnd), 1)
	if ptlb := ComObjQuery(desktop
		, "{4C96BE40-915C-11CF-99D3-00AA004AE837}"  ; SID_STopLevelBrowser
		, "{000214E2-0000-0000-C000-000000000046}") ; IID_IShellBrowser
	{	if DllCall(NumGet(NumGet(ptlb+0)+15*A_PtrSize),"ptr",ptlb,"ptr*", psv:=0) =0
		{	VarSetCapacity(IID_IDispatch, 16)
			NumPut(0x46000000000000C0, NumPut(0x20400,IID_IDispatch,"int64"), "int64")
			DllCall(NumGet(NumGet(psv+0)+15*A_PtrSize), "ptr", psv
				, "uint", 0, "ptr", &IID_IDispatch, "ptr*", pdisp:=0)
			shell := ComObj(9,pdisp,1).Application
			shell.ShellExecute(prms*)
			ObjRelease(psv)
		}
		ObjRelease(ptlb)
}	}
    )

MsgBox, % style2