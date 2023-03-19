# code507 can't set `0xNumber` as variable

Since ahk v1.1, don't warn before running, so I provide this option.
For the 1 hour I wasted.

```ahk
#Warn, All, MsgBox

0x001 := "9999" ; Cannot set 0xNumber as variable
MsgBox, % 0x001 ; show "0x001"
MsgBox, % 0x001 + 0 ; show 0, Because "0x001" + 0    ->    0 + 0    ->   0

0x001 := 9999 ; Cannot set 0xNumber as variable
MsgBox, % 0x001 ; "0x001"
MsgBox, % 0x001 + 0 ;

0x001 := "str-str-str" ; Cannot set 0xNumber as variable
MsgBox, % 0x001 ; "0x001"
MsgBox, % 0x001 + 0 ;
```
