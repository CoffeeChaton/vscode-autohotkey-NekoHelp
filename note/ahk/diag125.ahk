Var := ">=======<"
style1 := 0

; EXAMPLE #1:
style1 =
( c ; use c-flag
" Var"  %Var% ; OK
%Var% ; OK
% Var ; diag 125 '`%` miss to closed'
    )

MsgBox, % style1

