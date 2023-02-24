Class Class_Report_fn_ref
{

    static source := "Gdip_all_2020_08_24.ahk"
    static sourcePath := "D:\Dev\Gdip_all_2020_08_24.ahk"

    __NEW() {
        ; nothing
    }

    Ref0() {
        MsgBox, 
            ( LTrim
                never user`n
                ;...
                Gdip_LibrarySubVersion()
                Gdip_BitmapFromBRA()
                Gdip_BitmapToBase64()
                ;...
            )
    }

    Ref1() {
        MsgBox, 
            ( LTrim
                only used in 1 place`n
                ;...
                Gdip_DrawRectangle()
                Gdip_DrawLine()
                ;...
            )
    }

    RefMore() {
        MsgBox, 
            ( LTrim
                RefMore`n
                ;...
                Gdip_FillPath() ; 3
                Gdip_DrawImage() ; 9
                ;...
            )
    }
}

MsgBox % Class_Report_fn_ref.sourcePath 

Class_Report_fn_ref.Ref0()
Class_Report_fn_ref.Ref1()
Class_Report_fn_ref.RefN()

MsgBox % "Done : " 2 " ms"
