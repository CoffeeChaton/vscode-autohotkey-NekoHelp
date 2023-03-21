var1 := "~~i am var1~~"

foo := "
    ( LTrim c
        a ;some comment
        ;just comment-line, next line is space-line, but not has `n

        c" var1 " str-str-str
        d-line
    )"

MsgBox, % "foo is"
MsgBox, % foo

; When the c-flag and LTrim-flag are turned on, the pure comment line will be indented one less

; foo := "
;     ( LTrim c
;         a ;some comment
;     ;just comment-line, next line is space-line, but not has `n
;     ^old-format-
;         c" var1 " str-str-str
;         d-line
;     )"