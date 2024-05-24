#Requires AutoHotkey v1.1.33.11
#SingleInstance Force
#Warn All, MsgBox
global var1 := "var1 is text"

~F12::Reload

; work `r`n`t`b ``======================================================================================================
; `r`n`t`b and ``
::d3,,:: ccccc`b`b`b ; send c*5 and Backspace*3 === "cc"
:r:r3,,:: ccccc`b`b`b ; also
:t:t3,,:: ccccc`b`b`b ; also

:*:d4,,:: cc`t ; send c*2 and Tab*1
:*r:r4,,:: cc`t ; also
:*t:t4,,:: cc`t ; also

::d5,,:: cc`ncc ; send c*2 `n and cc
:r:r5,,:: cc`ncc ; also
:t:t5,,:: cc`ncc ; also

::d6,,:: cc`rcc ; send c*2 `n and cc
:r:r6,,:: cc`rcc ; also
:t:t6,,:: cc`rcc ; also

; ``
::d11,,:: cc``cc ; just text cc`cc , the "`" is miss
:r:r11,,:: cc``cc ; also
:t:t11,,:: cc``cc ; also

; diff `v `a `f ========================================================================================================

; `v
::dv,,:: cc`vcc ;  send text cc -> in chrome it will call (ctrl+k) -> send text cc
:r:rv,,:: cc`vcc ; send text cc -> in chrome it will call (ctrl+k) -> send text cc
:t:tv,,:: cc`vcc ; **** send cccc and , the "`v" is miss *****************

; `a
::da,,:: cc`acc ;  send text cc -> in text-edit it will call jump to line (ctrl+g) -> send text cc
:r:ra,,:: cc`acc ; send text cc -> in text-edit it will call jump to line (ctrl+g) -> send text cc
:t:ta,,:: cc`acc ; **** send cccc and , the "`a" is miss *****************

; `f
::df,,:: cc`fcc ;  send text cc -> in chrome it will call (ctrl+L) -> send text cc
:r:rf,,:: cc`fcc ; send text cc -> in chrome it will call (ctrl+L) -> send text cc
:t:tf,,:: cc`fcc ; **** send cccc and , the "`f" is miss *****************

; not work %;`,:========================================================================================================

; `%
::d7,,:: cc%var1% ; just text cc%var1%
:r:r7,,:: cc%var1% ; also
:t:t7,,:: cc%var1% ; also

; `% percent -> p
::dp,,:: cc`%var1`% ; just text cc%var1% , the "`" is miss
:r:rp,,:: cc`%var1`% ; also
:t:tp,,:: cc`%var1`% ; also

; `;
::d9,,:: cc;cc ; just text cc;cc
:r:r9,,:: cc;cc ; also
:t:t9,,:: cc;cc ; also

::d10,,:: cc`;cc ; just text cc;cc , the "`" is miss
:r:r10,,:: cc`;cc ; also
:t:t10,,:: cc`;cc ; also

; `, comma
::dc,,:: cc`,cc ; just text cc`cc , the "`" is miss
:r:rc,,:: cc`,cc ; also
:t:tc,,:: cc`,cc ; also


; `:: (literal pair of colons)
::dc2,,:: cc`::cc ; just text cc::cc , the "`" is miss
:r:rc2,,:: cc`::cc ; also
:t:tc2,,:: cc`::cc ; also