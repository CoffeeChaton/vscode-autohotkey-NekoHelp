Class C1 {
    Method() {
        MsgBox, % "A"
    }
    Class C {
        Method() {
            MsgBox, % "B"
        }
    }
}

Class C2 {
    Method() {
        MsgBox, % "C"
    }
    Class C {
        Method() {
            MsgBox, % "D"
        }
    }
}

fn_exp()

fn_exp() {
    a := new C1 ;C1 object
    a.Method() ; A
    a.C.Method() ;B

    b := new C2 ;C2 object
    b.Method() ; C
    b.C.Method() ;D

    Random, OutputVar, 0.0, 1.0
    temp := OutputVar > 0.5 ? C1 : C2 ; class object
    ListVars ; class is Global Variables
    MsgBox, % "OutputVar is " OutputVar
    a2 := new temp
    ListVars
    MsgBox, % "look of a2 is C1 object or C2 object"
    a2.Method() ; A or C
    a2.C.Method() ; B or D

    C2.Method() ;C -> static reference
}
