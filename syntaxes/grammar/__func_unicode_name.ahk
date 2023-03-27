

/**
* - [ ] part 8-1-1: add `ToUpCase()` of Case sensitivity <https://www.autohotkey.com/docs/v1/Concepts.htm#names>
* >
* > 1. None for ASCII characters. For example, CurrentDate is the same as currentdate.
* > 2. However, uppercase non - ASCII characters such as 'Ä' are not considered equal to their lowercase counterparts
*/
foooÄ(paramA) {
    MsgBox, % "fnA -> foooÄ say " paramA
}

foooä(paramB) {
    MsgBox, % "fnB -> foooä say " paramB
}

foooäÄ(paramC) {
    MsgBox, % "fnC -> foooä say " paramC
}

foooÄä(paramD) {
    MsgBox, % "fnD -> foooä say " paramD
}

foooÄä(paramD)
foooäÄ(paramC)

foooÄ("A")
foooä("B")

g#fn() {
    g#fn()
}

#fn() {
    #fn()
}