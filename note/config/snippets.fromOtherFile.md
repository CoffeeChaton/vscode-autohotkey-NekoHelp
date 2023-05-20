# snippets.fromOtherFile

## options 0

never completion from other files

## options 1

completion from other files

## options 2

completion from other files, but the `function` and `class` only provide `function_name` or `class_name` startWith filename

exp1:

```ahk
;file Gdip.ahk 

;provide
Gdip_BitmapFromScreen()

;but not provide
SetSysColorToControl()
```

exp2

file `fn_img_main.ahk`

```ahk
;provide
fn_img_main_XX()
;^^^^^^^^^^ start with filename
fn_img_mainG09()
;^^^^^^^^^^ start with filename

;not provide
fn_img_ma()
calcBmp()
```

## options 3

TODO:
