; not flag
::ahk,,::AutoHotkey
::AHK,,::AutoHotkey
::dx9,,::DirectX
::ts,,::TypeScript
::es,,::eslint
::pr,,::prettier ; dddddddddd
;                ^^^^^^^^^^^^ comment


; X-flag
:x:dd,,::MsgBox, % "dd" ;


; with out r/t flag
:*b0:<em1>::</em>{left 5} {Enter} ^t ;
:*b0:<em2>::</em>{left 5} {}} </em5> {{}
:*b0:a1,::{{} ; send "{"
;            ^comment
:*b0:a2,::{}} ; send "}"
::a99,,:: </em>{left 5} {Enter} ^t ;


; r/t flag
:r:<em3>::</em>{left 5}
;              ^^^^^^^ just string

:t:<em4>::</em>{left 5}
;              ^^^^^^^ just string



; r/t + x ---> only x flag
:xr:dd5,,::MsgBox, % "dd" ; show MsgBox
:xr:dd6,,::MsgBox, % "{left 5}" ; show MsgBox
