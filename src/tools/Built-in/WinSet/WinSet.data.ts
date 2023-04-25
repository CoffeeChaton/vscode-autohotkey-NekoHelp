/* eslint-disable no-template-curly-in-string */

/**
 * <https://www.autohotkey.com/docs/v1/lib/WinSet.htm>
 */
export type TWinSetCmdElement = Readonly<{
    SubCommand: string,
    // WinSet, SubCommand, Value , WinTitle, WinText, ExcludeTitle, ExcludeText
    body: `WinSet, ${string}`,
    doc: string,
    link: `https://www.autohotkey.com/docs/v1/lib/WinSet.htm#${string}`,
    exp: readonly string[],
}>;

/*
AlwaysOnTop: Makes a window stay on top of all other windows.
Bottom: Sends a window to the bottom of stack; that is, beneath all other windows.
Top: Brings a window to the top of the stack without explicitly activating it.
Disable: Disables a window.
Enable: Enables a window.
Redraw: Redraws a window.
Style: Changes the style of a window.
ExStyle: Changes the extended style of a window.
Region: Changes the shape of a window to be the specified rectangle, ellipse, or polygon.
Transparent: Makes a window semi-transparent.
TransColor: Makes all pixels of the chosen color invisible inside the target window.
*/

/**
 * after initialization clear
 */
export const WinSetSubCmdList: TWinSetCmdElement[] = [
    // normal
    {
        SubCommand: 'AlwaysOnTop',
        body:
            'WinSet, AlwaysOnTop [, ${1:OnOffToggle}, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: 'Makes a window stay on top of all other windows.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinSet.htm#AlwaysOnTop',
        exp: [
            'WinSet, AlwaysOnTop [, OnOffToggle, WinTitle, WinText, ExcludeTitle, ExcludeText',
            '',
            'WinSet, AlwaysOnTop, Off, My Splash Window Title',
        ],
    },
    {
        SubCommand: 'Bottom',
        body: 'WinSet, Bottom [,, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: 'Sends a window to the bottom of stack; that is, beneath all other windows.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinSet.htm#Bottom',
        exp: [
            'WinSet, Bottom [,, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Top',
        body: 'WinSet, Top [,, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: 'Brings a window to the top of the stack without explicitly [activating](https://www.autohotkey.com/docs/v1/lib/WinActivate.htm) it.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinSet.htm#Top',
        exp: [
            'WinSet, Top [,, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Disable',
        body: 'WinSet, Disable [,, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: 'Disables a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinSet.htm#Disable',
        exp: [
            'WinSet, Disable [,, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Enable',
        body: 'WinSet, Enable [,, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: 'Enables a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinSet.htm#Enable',
        exp: [
            'WinSet, Enable [,, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Redraw',
        body: 'WinSet, Redraw [,, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: 'Redraws a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinSet.htm#Redraw',
        exp: [
            'WinSet, Redraw [,, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Style',
        body: 'WinSet, Style, ${1:N} [, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: 'Changes the style of a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinSet.htm#Style',
        exp: [
            'WinSet, Style, N [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'ExStyle',
        body: 'WinSet, ExStyle, ${1:N} [, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: 'Changes the extended style of a window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinSet.htm#ExStyle',
        exp: [
            'WinSet, ExStyle, N [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Region',
        body: 'WinSet, Region, [${1:50-0 W200 H250}, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: 'Changes the shape of a window to be the specified rectangle, ellipse, or polygon.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinSet.htm#Region',
        exp: [
            'WinSet, Region [, options , WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Transparent',
        body: 'WinSet, Transparent , [${1:0-255}, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: 'Makes a window semi-transparent.\nSpecify for _N_ a number between 0 and 255 to indicate the degree of transparency: 0 makes the window invisible while 255 makes it opaque.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinSet.htm#Transparent',
        exp: [
            'WinSet, Transparent [, N , WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
            'WinSet, Transparent, 200, Untitled - Notepad',
        ],
    },
    {
        SubCommand: 'TransColor',
        body: 'WinSet, TransColor , ${1:Color_RGB}, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText}]',
        doc: 'Makes all pixels of the chosen color invisible inside the target window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/WinSet.htm#TransColor',
        exp: [
            'WinSet, TransColor , Color [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
            'WinSet, TransColor, EEAA99 150, WinTitle.',
            ';                   ^RGB   ^0-255 transparency level',
        ],
    },
];

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// https://www.autohotkey.com/docs/v1/lib/WinSet.htm#ExTransColor
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
