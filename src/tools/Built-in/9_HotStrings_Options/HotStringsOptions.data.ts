// https://www.autohotkey.com/docs/v1/Hotstrings.htm#Options

export type THotStringsOptions =
    | '*'
    | '*0'
    | '?'
    | '?0'
    | 'b0'
    | 'C1'
    | 'C'
    | 'C0'
    | `K${string}`
    | 'O0'
    | 'O'
    | `P${string}`
    | 'R0'
    | 'R'
    | 'Si'
    | 'Se'
    | 'Sp'
    | 'T0'
    | 'T'
    | 'X'
    | 'Z'
    | 'Z0';

type THotStringsOptionsList = Readonly<{
    humanName: string,
    link: `https://www.autohotkey.com/docs/v1/Hotstrings.htm#${string}`,
    doc: string,
    exp: string,
    parseFn: (s: string) => THotStringsOptions | null,
}>;

export const HotStringsOptionsList: THotStringsOptionsList[] = [
    {
        humanName: '* (asterisk)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#Asterisk',
        doc: [
            '**\\*** (asterisk):',
            'An ending character (e.g. `Space`, `.`, or `Enter`) is not required to trigger the hotstring.',
            'The example above would send its replacement the moment you type the @ character. When using the [#Hotstring directive](https://www.autohotkey.com/docs/v1/lib/_Hotstring.htm),',
            'use **\\*0** to turn this option back off.',
        ].join('\n\n'),
        exp: [
            ':*:j@::jsmith@somedomain.com ;use * to not required to trigger the hotstring.',
            ':*0:a@::aaa@somedomain.com ;use *0 to turn this option back off.',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if (!s.startsWith('*')) return null;
            if (s.startsWith('*0')) return '*0';
            return '*';
        },
    },
    {
        humanName: '? (question mark)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#Question',
        doc: [
            '**?** (question mark): ',
            'The hotstring will be triggered even when it is inside another word; that is, when the character typed immediately before it is alphanumeric. ',
            'For example, if `:?:al::airline` is a hotstring, typing "practical " would produce "practicairline ".',
            'Use **?0** to turn this option back off.',
        ].join('\n\n'),
        exp: [
            ':?:al::Airline ; try input `catal` and `space` -> get catAirline',
            ':?0:dl::deadline ; try input `ddl` and `space`',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if (!s.startsWith('?')) return null;
            if (s.startsWith('?0')) return '?0';
            return '?';
        },
    },
    {
        humanName: '**B0** (B followed by a zero)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#b0',
        doc: [
            '**B0** (B followed by a zero):',
            'Automatic backspacing is not done to erase the abbreviation you type.',
            'Use a plain **B** to turn backspacing back on after it was previously turned off.',
            'A script may also do its own backspacing via {bs 5}, which sends `Backspace` five times. Similarly, it may send `←` five times via `{left 5}`.',
            'For example, the following hotstring produces "<em></em>" and moves the caret 5 places to the left (so that it\'s between the tags):',
        ].join('\n\n'),
        exp: [
            ':*b0:<em>::</em>{left 5}',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if (!(/^b0/iu).test(s)) return null;
            return 'b0';
        },
    },
    {
        humanName: '**C1** (C followed by a one)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#C1',
        doc: [
            '**C1:**:',
            'Do not conform to typed case. Use this option to make [auto-replace hotStrings](https://www.autohotkey.com/docs/v1/Hotstrings.htm#auto) case-insensitive and prevent them from conforming to the case of the characters you actually type.',
            'Case-conforming hotStrings (which are the default) produce their replacement text in all caps if you type the abbreviation in all caps.',
            'If you type the first letter in caps, the first letter of the replacement will also be capitalized (if it is a letter).',
            'If you type the case in any other way, the replacement is sent exactly as defined.',
            'When using the [#Hotstring directive](https://www.autohotkey.com/docs/v1/lib/_Hotstring.htm), **C0** can be used to turn this option back off, which makes hotStrings conform again.',
        ].join('\n\n'),
        exp: [
            '::OPV1:: outputVar',
            '; sent "OPV1" -> "OUTPUTVAR" (full-capital -> get full-capital)',
            '; sent "opv1" -> "outputVar"',
            '',
            ':C1:OPV2:: outputVar',
            '; sent "OPV1" -> "outputVar" (full-capital -> get exactly as defined)',
            '; sent "opv1" -> "outputVar"',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if (!(/^C1/iu).test(s)) return null;
            return 'C1';
        },
    },
    {
        humanName: '**C** (just C or C0)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#C',
        doc: [
            '**C:** Case-sensitive:',
            'When you type an abbreviation, it must exactly match the case defined in the script. Use **C0** to turn case sensitivity back off.',
        ].join('\n\n'),
        exp: [
            ':C:ts::typescript',
            ':C:TS::TypeScript',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if (!(/^C/iu).test(s)) return null;
            if ((/^C0/iu).test(s)) return 'C0';
            return 'C';
        },
    },
    {
        humanName: '**Kn** (K and number of delay ms)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#Kn',
        doc: [
            '**Kn:** Key-delay:',
            'This rarely-used option sets the delay between keystrokes produced by auto-backspacing or [auto-replacement](https://www.autohotkey.com/docs/v1/Hotstrings.htm#auto). Specify the new delay for **n**; for example, specify k10 to have a 10 ms delay and k-1 to have no delay. The exact behavior of this option depends on which [sending mode](https://www.autohotkey.com/docs/v1/Hotstrings.htm#SendMode) is in effect:',
            '',
            '- SI (SendInput): Key-delay is ignored because a delay is not possible in this mode. The exception to this is when SendInput is [unavailable](https://www.autohotkey.com/docs/v1/lib/Send.htm#SendInputUnavail), in which case hotStrings revert to SendPlay mode below (which does obey key-delay).',
            '- SP (SendPlay): A delay of length zero is the default, which for SendPlay is the same as -1 (no delay). In this mode, the delay is actually a [PressDuration](https://www.autohotkey.com/docs/v1/lib/SetKeyDelay.htm#dur) rather than a delay between keystrokes.',
            '- SE (SendEvent): A delay of length zero is the default. Zero is recommended for most purposes since it is fast but still cooperates well with other processes (due to internally doing a [Sleep 0](https://www.autohotkey.com/docs/v1/lib/Sleep.htm)). Specify k-1 to have no delay at all, which is useful to make auto-replacements faster if your CPU is frequently under heavy load. When set to -1, a script\'s process-priority becomes an important factor in how fast it can send keystrokes. To raise a script\'s priority, use `Process, Priority,, High`.',
        ].join('\n\n'),
        exp: [
            ';not exp know',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            const ma: RegExpMatchArray | null = s.match(/^K(-?\d+)/iu);
            if (ma === null) return null;
            const n: string = ma[1];
            return `K${n}`;
        },
    },
    {
        humanName: '**O** (O or O0)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#O',
        doc: [
            '**O:** Omit the ending character of [auto-replace hotStrings](https://www.autohotkey.com/docs/v1/Hotstrings.htm#auto) when the replacement is produced.',
            'This is useful when you want a hotstring to be kept unambiguous by still requiring an ending character, but don\'t actually want the ending character to be shown on the screen.',
            'For example, if `:o:ar::aristocrat` is a hotstring, typing "ar" followed by the spaceBar will produce "aristocrat" with no trailing space, which allows you to make the word plural or possessive without having to press `Backspace`.',
            'Use **O0** (the letter O followed by a zero) to turn this option back off.',
        ].join('\n\n'),
        exp: [
            '::op::OutputVar ; op and "," -> OutputVar,    ; has ","',
            ':o:ar::aristocrat ; ar and "," -> aristocrat  ;not ","',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if (!(/^O/iu).test(s)) return null;
            if ((/^O0/iu).test(s)) return 'O0';
            return 'O';
        },
    },
    {
        humanName: '**Pn** (P and number of priority)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#Pn',
        doc: [
            'The [priority](https://www.autohotkey.com/docs/v1/misc/Threads.htm) of the hotstring (e.g. P1). This rarely-used option has no effect on [auto-replace hotStrings](https://www.autohotkey.com/docs/v1/Hotstrings.htm#auto).',
        ].join('\n\n'),
        exp: [
            ';not exp know',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            const ma: RegExpMatchArray | null = s.match(/^P(-?\d+)/iu);
            if (ma === null) return null;
            const n: string = ma[1];
            return `P${n}`;
        },
    },
    {
        humanName: '**R** (raw)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#raw',
        doc: [
            'Send the replacement text [raw](https://www.autohotkey.com/docs/v1/lib/Send.htm#SendRaw);',
            'that is, without translating `{Enter}` to `Enter`, `^c` to `Ctrl c`, etc.',
            'This option is put into effect automatically for hotStrings that have a [continuation section](https://www.autohotkey.com/docs/v1/Hotstrings.htm#continuation). ',
            'Use **R0** to turn this option back off.',
            '',
            '**Note:** [Text mode](https://www.autohotkey.com/docs/v1/Hotstrings.htm#T) may be more reliable. The `R` and `T` options are mutually exclusive.',
        ].join('\n\n'),
        exp: [
            '::a1::{Enter} ;Press `Enter` key',
            '',
            ':r:a2::{Enter} ;send `{Enter}` text',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if (!(/^R/iu).test(s)) return null;
            if ((/^R0/iu).test(s)) return 'R0';
            return 'R';
        },
    },
    {
        humanName: '**Si** (SendInput)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#SendMode',
        doc: [
            'SI stands for [SendInput](https://www.autohotkey.com/docs/v1/lib/Send.htm#SendInputDetail), which typically has superior speed and reliability than the other modes.',
            'Another benefit is that like SendPlay below, SendInput postpones anything you type during a hotString\'s [auto-replacement text](https://www.autohotkey.com/docs/v1/Hotstrings.htm#auto).',
            'This prevents your keystrokes from being interspersed with those of the replacement. When SendInput is [unavailable](https://www.autohotkey.com/docs/v1/lib/Send.htm#SendInputUnavail), hotStrings automatically use SendPlay instead.',
        ].join('\n\n'),
        exp: [
            ';not exp know',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if ((/^Si/iu).test(s)) return 'Si';
            return null;
        },
    },
    {
        humanName: '**Sp** (SendPlay)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#SendMode',
        doc: [
            '- SP stands for [SendPlay](https://www.autohotkey.com/docs/v1/lib/Send.htm#SendPlayDetail), which may allow hotStrings to work in a broader variety of games.',
        ].join('\n\n'),
        exp: [
            ';not exp know',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if ((/^Sp/iu).test(s)) return 'Sp';
            return null;
        },
    },
    {
        humanName: '**Se** (SendEvent)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#SendMode',
        doc: [
            '- SE stands for [SendEvent](https://www.autohotkey.com/docs/v1/lib/Send.htm#SendEvent), which is the default in versions older than 1.0.43.',
        ].join('\n\n'),
        exp: [
            ';not exp know',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if ((/^Se/iu).test(s)) return 'Se';
            return null;
        },
    },
    {
        humanName: '**T** (Text)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#T',
        doc: [
            '**T** [\\[v1.1.27+\\]](https://www.autohotkey.com/docs/v1/AHKL_ChangeLog.htm#v1.1.27.00 "Applies to AutoHotkey v1.1.27 and later"): Send the replacement text [raw](https://www.autohotkey.com/docs/v1/Hotstrings.htm#raw), without translating each character to a keystroke.',
            'For details, see [Text mode](https://www.autohotkey.com/docs/v1/lib/Send.htm#SendText).',
            'Use **T0** or **R0** to turn this option back off, or override it with **R**.',
        ].join('\n\n'),
        exp: [
            '::a1::{Enter} ;Press `Enter` key',
            '',
            ':t:a2::{Enter} ;send `{Enter}` text',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if (!(/^T/iu).test(s)) return null;
            if ((/^T0/iu).test(s)) return 'T0';
            return 'T';
        },
    },
    {
        humanName: '**X** (Execute command/expression)',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#X',
        doc: [
            'Execute. Instead of replacement text, the hotstring accepts a command or expression to execute. ',
            'This is most useful when defining a large number of hotStrings which call functions, as it would otherwise require three lines per hotstring.',
            'When used with the [Hotstring](https://www.autohotkey.com/docs/v1/lib/Hotstring.htm) function, the X option causes the _Replacement_ parameter to be interpreted as a label or function name instead of replacement text. However, the X option has this effect only if it is specified each time the function is called.',
        ].join('\n\n'),
        exp: [
            '',
            '::mb::MsgBox, % "text" ;replace mb as text `MsgBox, % "text"`',
            '',
            '::mb1::',
            '    MsgBox, % "mb1" ; run cmd, but need 3 line',
            'Return',
            '',
            ':X:mb2:: MsgBox, % "mb2" ; run cmd, just need 1 line',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if ((/^X/iu).test(s)) return 'X';
            return null;
        },
    },
    {
        humanName: '**Z**',
        link: 'https://www.autohotkey.com/docs/v1/Hotstrings.htm#z',
        doc: [
            'This rarely-used option resets the hotstring recognizer after each triggering of the hotstring. In other words, the script will begin waiting for an entirely new hotstring, eliminating from consideration anything you previously typed.',
            'This can prevent unwanted triggerings of hotStrings. To illustrate, consider the following hotstring:',
            'Since the above lacks the Z option, typing `111` (three consecutive 1\'s) would trigger the hotstring twice because the middle 1 is the _last_ character of the first triggering but also the _first_ character of the second triggering.',
            'By adding the letter Z in front of b0, you would have to type four 1\'s instead of three to trigger the hotstring twice.',
            'Use **Z0** to turn this option back off.',
        ].join('\n\n'),
        exp: [
            ':b0*?:11::',
            '    SendInput, xx',
            '    ;11-> 11xx',
            '    ;111 -> 11xx1xx ;<- miss `1`',
            'return',
            '',
            ':zb0*?:22:: ;<---has z-flag',
            '    SendInput, yy',
            '    ;22-> 22yy',
            '    ;222 -> 22yy2',
            '    ;2222 -> 22yy22yy',
            'return',
            '',
        ].join('\n'),
        parseFn: (s: string): THotStringsOptions | null => {
            if (!(/^z/iu).test(s)) return null;
            if ((/^z0/iu).test(s)) return 'Z0';
            return 'Z';
        },
    },
];
