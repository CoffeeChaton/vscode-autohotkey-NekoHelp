/* eslint-disable no-template-curly-in-string */

type TControlGetSubCmd =
    | 'Checked'
    | 'Choice'
    | 'CurrentCol'
    | 'CurrentLine'
    | 'Enabled'
    | 'ExStyle'
    | 'FindString'
    | 'Hwnd'
    | 'Line'
    | 'LineCount'
    | 'List'
    | 'Selected'
    | 'Style'
    | 'Tab'
    | 'Visible';

/**
 * <https://www.autohotkey.com/docs/v1/lib/ControlGet.htm>
 * ControlGet, OutputVar, SubCommand
 */
export type TControlGetCmdElement = Readonly<{
    SubCommand: TControlGetSubCmd,
    body:
        `ControlGet, \${1:OutputVar}, ${TControlGetSubCmd} [, \${2:Value}, \${3:Control}, \${4:WinTitle}, \${5:WinText}, \${6:ExcludeTitle}, \${7:ExcludeText}]`,
    // ControlGet, OutputVar, SubCommand [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]
    doc: string,
    link: `https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#${TControlGetSubCmd}`,
    exp: readonly string[],
}>;

// List: Retrieves a list of items from a ListView, ListBox, ComboBox, or DropDownList.
// Checked: Retrieves 1 if the checkbox or radio button is checked or 0 if not.
// Enabled: Retrieves 1 if the control is enabled, or 0 if disabled.
// Visible: Retrieves 1 if the control is visible, or 0 if hidden.
// Tab: Retrieves the tab number of a SysTabControl32 control.
// FindString: Retrieves the entry number of a ListBox or ComboBox that is an exact match for the string.
// Choice: Retrieves the name of the currently selected entry in a ListBox or ComboBox.
// LineCount: Retrieves the number of lines in an Edit control.
// CurrentLine: Retrieves the line number in an Edit control where the caret resides.
// CurrentCol: Retrieves the column number in an Edit control where the caret resides.
// Line: Retrieves the text of the specified line number in an Edit control.
// Selected: Retrieves the selected text in an Edit control.
// Style: Retrieves an 8-digit hexadecimal number representing the style of the control.
// ExStyle: Retrieves an 8-digit hexadecimal number representing the extended style of the control.
// Hwnd: Retrieves the window handle(HWND) of the control.

/**
 * after initialization clear
 */
export const ControlGetSubCmdList: TControlGetCmdElement[] = [
    {
        SubCommand: 'List',
        body:
            'ControlGet, ${1:OutputVar}, List [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves a list of items from a ListView, ListBox, ComboBox, or DropDownList.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#List',
        exp: [
            'ControlGet, OutputVar, List [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Checked',
        body:
            'ControlGet, ${1:OutputVar}, Checked [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves 1 if the checkbox or radio button is checked or 0 if not.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#Checked',
        exp: [
            'ControlGet, OutputVar, Checked [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Enabled',
        body:
            'ControlGet, ${1:OutputVar}, Enabled [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves 1 if the control is enabled, or 0 if disabled.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#Enabled',
        exp: [
            'ControlGet, OutputVar, Enabled [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Visible',
        body:
            'ControlGet, ${1:OutputVar}, Visible [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves 1 if the control is visible, or 0 if hidden.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#Visible',
        exp: [
            'ControlGet, OutputVar, Visible [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Tab',
        body:
            'ControlGet, ${1:OutputVar}, Tab [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves the tab number of a SysTabControl32 control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#Tab',
        exp: [
            'ControlGet, OutputVar, Tab [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'FindString',
        body:
            'ControlGet, ${1:OutputVar}, FindString [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves the entry number of a ListBox or ComboBox that is an exact match for the string.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#FindString',
        exp: [
            'ControlGet, OutputVar, FindString [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Choice',
        body:
            'ControlGet, ${1:OutputVar}, Choice [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves the name of the currently selected entry in a ListBox or ComboBox.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#Choice',
        exp: [
            'ControlGet, OutputVar, Choice [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'LineCount',
        body:
            'ControlGet, ${1:OutputVar}, LineCount [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves the number of lines in an Edit control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#LineCount',
        exp: [
            'ControlGet, OutputVar, LineCount [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'CurrentLine',
        body:
            'ControlGet, ${1:OutputVar}, CurrentLine [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves the line number in an Edit control where the caret resides.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#CurrentLine',
        exp: [
            'ControlGet, OutputVar, CurrentLine [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'CurrentCol',
        body:
            'ControlGet, ${1:OutputVar}, CurrentCol [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves the column number in an Edit control where the caret resides.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#CurrentCol',
        exp: [
            'ControlGet, OutputVar, CurrentCol [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Line',
        body:
            'ControlGet, ${1:OutputVar}, Line [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves the text of the specified line number in an Edit control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#Line',
        exp: [
            'ControlGet, OutputVar, Line [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Selected',
        body:
            'ControlGet, ${1:OutputVar}, Selected [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves the selected text in an Edit control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#Selected',
        exp: [
            'ControlGet, OutputVar, Selected [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Style',
        body:
            'ControlGet, ${1:OutputVar}, Style [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves an 8-digit hexadecimal number representing the style of the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#Style',
        exp: [
            'ControlGet, OutputVar, Style [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'ExStyle',
        body:
            'ControlGet, ${1:OutputVar}, ExStyle [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves an 8-digit hexadecimal number representing the extended style of the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#ExStyle',
        exp: [
            'ControlGet, OutputVar, ExStyle [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    {
        SubCommand: 'Hwnd',
        body:
            'ControlGet, ${1:OutputVar}, Hwnd [, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText}]',
        doc: 'Retrieves the window handle (HWND) of the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/ControlGet.htm#Hwnd',
        exp: [
            'ControlGet, OutputVar, Hwnd [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
];
