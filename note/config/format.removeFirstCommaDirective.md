# format.removeFirstCommaDirective

## false (default)

not format `#Directive` first optional comma, no formatting, no changes, reducing the interference of git-diff.

## true

format the signature format for the ahk-v1.1 online documentation, by remove [#Directive](https://www.autohotkey.com/docs/v1/lib/#hash) first optional comma

exp:

```ahk
;from
#Warn, All, MsgBox

; to 
#Warn All, MsgBox
;    ^ remove ","
```
