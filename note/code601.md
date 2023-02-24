# code601 warn avoid def-func-name affect HotKey

- [`Hotkey, KeyName , Label`](https://www.autohotkey.com/docs/v1/lib/Hotkey.htm)

> **Caution:** Defining a label named On, Off, Toggle or AltTab (or any variation recognized by this command) may cause inconsistent behavior. It is strongly recommended that these values not be used as label names.

## exp

1. an ahk mini project

   ```ahk
    F1:: foo()
    ~F8:: fn_f8()


    foo() {
        MsgBox, % "i am foo()"
    }

    fn_f8() {
        Random, a, 0, 100 ; Simulate Probability Events , like read global variable
        if (a<3) {
            Random, b, 0, 100
            if (b > 50) {
                Hotkey, F1 , On ; just want to open `F1::`
            } else {
                Hotkey, F1 , Off ; just want to off `F1::`
            }
        }
    }
   ```

2. After multiple deliveries

   ```ahk
    F1:: foo()
    ~F5:: bar()
    ~F8:: fn_f8()

    foo() {
        MsgBox, % "i am foo()"
    }

    fn_f8() {
        ; Convenient for demonstration, temporarily closed probabilistic events
        ; Random, a, 0, 100 ; Simulate Probability Events, like read global variable
        ; if (a<3) {
        Random, b, 0, 100
        if (b > 50) {
            Hotkey, F1 , On ; i want to open `~F1::` but now it let `F1::` to bind function `On()` 
        } else {
            Hotkey, F1 , Off ; i want to off `~F1::` but now it let `F1::` to bind label `off:`
        } ; `F1` affected by functions/labels defined very far away
        ; }
    }

    bar() {
        ;do something
        ;...
        MsgBox, % "i am bar"
        someFunc()
    }
    ;@ 1000+ line

    someFunc() {
        MsgBox, % "i am someFunc"
        On() ; call function On
    }

    On() {
        MsgBox, % "on"
    }

    Off:
        MsgBox, % "off"
    Return
   ```

3. Remotely defined functions affect [`Hotkey, KeyName , Label`](https://www.autohotkey.com/docs/v1/lib/Hotkey.htm) behavior.

## Prohibited names are as follows

```TypeScript
const code601ErrList: readonly string[] = [
    // https://www.autohotkey.com/docs/v1/lib/Hotkey.htm
    // Hotkey, KeyName , Label, Options
    'On',
    'Off',
    'Toggle',
    'AltTab',
    // AltTab (and others): These are special Alt-Tab hotkey actions that are described here.
    // -> https://www.autohotkey.com/docs/v1/Hotkeys.htm#alttab
    'ShiftAltTab',
    'AltTabMenu',
    'AltTabAndMenu',
    'AltTabMenuDismiss',
];
```
