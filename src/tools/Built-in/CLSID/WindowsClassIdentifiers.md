# CLSID List [(Windows Class Identifiers)](https://www.autohotkey.com/docs/v1/misc/CLSID-List.htm)

Certain special folders within the operating system are identified by unique strings. Some of these strings can be used with
[FileSelectFile](https://www.autohotkey.com/docs/v1/lib/FileSelectFile.htm),
[FileSelectFolder](https://www.autohotkey.com/docs/v1/lib/FileSelectFolder.htm),
and [Run](https://www.autohotkey.com/docs/v1/lib/Run.htm).

For example:

```ahk
FileSelectFile, OutputVar,, ::{645ff040-5081-101b-9f08-00aa002f954e} ; Select a file in the Recycle Bin.
FileSelectFolder, OutputVar, ::{20d04fe0-3aea-1069-a2d8-08002b30309d} ; Select a folder within My Computer.
```

| CLSID                                      | Location                 | Run? |
| ------------------------------------------ | ------------------------ | ---- |
| `::{d20ea4e1-3957-11d2-a40b-0c5020524153}` | Administrative Tools     |      |
| `::{85bbd920-42a0-1069-a2e4-08002b30309d}` | Briefcase                |      |
| `::{21ec2020-3aea-1069-a2dd-08002b30309d}` | Control Panel            |      |
| `::{d20ea4e1-3957-11d2-a40b-0c5020524152}` | Fonts                    |      |
| `::{ff393560-c2a7-11cf-bff4-444553540000}` | History                  |      |
| `::{00020d75-0000-0000-c000-000000000046}` | Inbox                    |      |
| `::{00028b00-0000-0000-c000-000000000046}` | Microsoft Network        |      |
| `::{20d04fe0-3aea-1069-a2d8-08002b30309d}` | My Computer              | Yes  |
| `::{450d8fba-ad25-11d0-98a8-0800361b1103}` | My Documents             | Yes  |
| `::{208d2c60-3aea-1069-a2d7-08002b30309d}` | My Network Places        | Yes  |
| `::{1f4de370-d627-11d1-ba4f-00a0c91eedba}` | Network Computers        | Yes  |
| `::{7007acc7-3202-11d1-aad2-00805fc1270e}` | Network Connections      | Yes  |
| `::{2227a280-3aea-1069-a2de-08002b30309d}` | Printers and Faxes       | Yes  |
| `::{7be9d83c-a729-4d97-b5a7-1b7313c39e0a}` | Programs Folder          |      |
| `::{645ff040-5081-101b-9f08-00aa002f954e}` | Recycle Bin              | Yes  |
| `::{e211b736-43fd-11d1-9efb-0000f8757fcd}` | Scanners and Cameras     |      |
| `::{d6277990-4c6a-11cf-8d87-00aa0060f5bf}` | Scheduled Tasks          | Yes  |
| `::{48e7caab-b918-4e58-a94d-505519c795dc}` | Start Menu Folder        |      |
| `::{7bd29e00-76c1-11cf-9dd0-00a0c9034933}` | Temporary Internet Files |      |
| `::{bdeadf00-c265-11d0-bced-00a0c90ab50f}` | Web Folders              |      |

The "Yes" entries in the last column are not authoritative: the [Run](https://www.autohotkey.com/docs/v1/lib/Run.htm) command might support different CLSIDs depending on system configuration. To open a CLSID folder via Run, simply specify the CLSID as the first parameter. For example:

```ahk
Run ::{20d04fe0-3aea-1069-a2d8-08002b30309d}  ; Opens the "My Computer" folder.
Run ::{645ff040-5081-101b-9f08-00aa002f954e}  ; Opens the Recycle Bin.
Run ::{450d8fba-ad25-11d0-98a8-0800361b1103}\My Folder  ; Opens a folder that exists inside "My Documents".
Run %A_MyDocuments%\My Folder  ; Same as the above on most systems.
```
