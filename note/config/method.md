# AhkNekoHelp.method

## loose_mode

loose and fast.
However, when different classes have the same `method()` name, the `method()` under different `class` will be provided at the same time and cannot be accurately jumped to the most suitable one, but it is suitable for cases where methods are frequently called across functions, or when initializing Objects is more complicated.

```ahk
class JSON
{
    parse(jsonStr)
    {

    }
}

class JSON5
{
    parse(jsonStr)
    {

    }
}


foo(param0){
    param0.parse()
    ;      ^^^^^ goto JSON/JSON5 , because there has the method has name `parse`
    ; goto any class has method `parse`
}

a := new JSON
a.parse()
; ^^^^^ goto `JSON.parse()` and `JSON.parse()`
```

## precision_mode

Imitate human habits and track variables, but cannot track across functions.
In addition, due to technical limitations, there is only the := symbol between the obj variable name and the new class.

like :

```ahk
class c0
{
    parse(xx)
    {

    }
}

class c1
{
    parse(xx)
    {

    }
}

foo(){
    a := new c0 ; OK
    a.parse() ; goto c0.parse()

    a1 := new c1 ; OK
    a1.parse() ; goto c1.parse()


    b := 1 > 0
        ? new c0 ; not working
        : new c1 ; not working

    b.parse()

    if (i > 0){
        b2 := new c0 ; OK
    } else {
        b2 := new c1 ; OK
    }
    b2.parse() ; goto c0.parse() and c1.parse()

    c := 2 > 1 ? new c0 : new c1 ; not working
    c.parse()

    return new c0
}

d := foo()
d.parse() ;not working
```

## precision_or_loose_mode

if [precision_mode](#precision_mode) not find, then auto switch to [loose_mode](#loose_mode) .
