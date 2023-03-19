
OutputVar := "i am OutputVar now"
el_error_line = text := "--%A_Sec%--%A_MSec%--%OutputVar%-->>> " A_ThisFunc `nfn_print(text) % foo + coo() +0 ; comment
el_error_line = % OutputVar "%-->>> " A_ThisFunc "`nfn_print(text)" ; comment
el_error_line = str str %OutputVar%str--str % OutputVar "%-->>> " A_ThisFunc "`nfn_print(text)" ; comment
