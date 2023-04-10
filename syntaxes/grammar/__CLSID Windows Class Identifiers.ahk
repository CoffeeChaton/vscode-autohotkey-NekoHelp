~F1::
    Run ::{20d04fe0-3aea-1069-a2d8-08002b30309d}  ; Opens the "My Computer" folder.
    Run ::{645ff040-5081-101b-9f08-00aa002f954e}  ; Opens the Recycle Bin.
    Run ::{450d8fba-ad25-11d0-98a8-0800361b1103}\My Folder  ; Opens a folder that exists inside "My Documents".
    Run, %A_MyDocuments%\My Folder  ; Same as the above on most systems.

    FileSelectFile, OutputVar,, ::{645ff040-5081-101b-9f08-00aa002f954e}  ; Select a file in the Recycle Bin.
    FileSelectFolder, OutputVar, ::{20d04fe0-3aea-1069-a2d8-08002b30309d}  ; Select a folder within My Computer.
Return


~F2::
Run ::{20d04fe0-3aea-1069-a2d8-08002b30309d}  ; Opens the "My Computer" folder.
Run ::{645ff040-5081-101b-9f08-00aa002f954e}  ; Opens the Recycle Bin.
Run ::{450d8fba-ad25-11d0-98a8-0800361b1103}\My Folder  ; Opens a folder that exists inside "My Documents".
Run, %A_MyDocuments%\My Folder  ; Same as the above on most systems.

FileSelectFile, OutputVar,, ::{645ff040-5081-101b-9f08-00aa002f954e}  ; Select a file in the Recycle Bin.
FileSelectFolder, OutputVar, ::{20d04fe0-3aea-1069-a2d8-08002b30309d}  ; Select a folder within My Computer.
Return

~F12:: Run, ::{20d04fe0-3aea-1069-a2d8-08002b30309d}  ; Opens the "My Computer" folder.
