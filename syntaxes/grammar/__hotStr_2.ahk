#Requires AutoHotkey v1.1.33.11
#SingleInstance Force
~F12::Reload

; about ctrl key
; # win
; ! Alt
; ^ Ctrl
; + Shift
::d4,,:: ^t ; ctrl + t
:t:t4,,:: ^t ; send text "^t"
:r:r4,,:: ^t ; send text "^t"

::d5-1,,:: ^t ^+   ; ctrl + t
::d5-2,,:: ^2 ^t  ;  ctrl + 2 ctrl + t
:t:t5,,:: ^t ^+ ; send text "^t ^+"
:r:r5,,:: ^t ^+ ; send text "^t ^+"
