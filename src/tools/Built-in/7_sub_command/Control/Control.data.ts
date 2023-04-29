/* eslint-disable no-template-curly-in-string */

type TSubCmdList =
    | 'Add'
    | 'Check'
    | 'Choose'
    | 'ChooseString'
    | 'Delete'
    | 'Disable'
    | 'EditPaste'
    | 'Enable'
    | 'ExStyle'
    | 'Hide'
    | 'HideDropDown'
    | 'Show'
    | 'ShowDropDown'
    | 'Style'
    | 'TabLeft'
    | 'TabRight'
    | 'Uncheck';

type TFirstParam =
    | '[,,'
    | `, \${1:${string}} [,`
    | `[, \${1:${string}},`;

/**
 * <https://www.autohotkey.com/docs/v1/lib/Control.htm>
 */
export type TControlCmdElement = Readonly<{
    SubCommand: TSubCmdList,
    // Control, SubCommand , Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText
    // Control, SubCommand [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]

    body:
        `Control, ${TSubCmdList} ${TFirstParam} \${2:Control}, \${3:WinTitle}, \${4:WinText}, \${5:ExcludeTitle}, \${6:ExcludeText}]`,
    doc: string,
    link: `https://www.autohotkey.com/docs/v1/lib/Control.htm#${TSubCmdList}`,
    exp: readonly string[],
}>;

/*
Check: Turns on (checks) a radio button or checkbox.
Uncheck: Turns off a radio button or checkbox.
Enable: Enables a control if it was previously disabled.
Disable: Disables or "grays out" a control.
Show: Shows a control if it was previously hidden.
Hide: Hides a control.
Style: Changes the style of a control.
ExStyle: Changes the extended style of a control.
ShowDropDown: Shows the drop-down list of a ComboBox control.
HideDropDown: Hides the drop-down list of a ComboBox control.
TabLeft: Moves left by one or more tabs in a SysTabControl32.
TabRight: Moves right by one or more tabs in a SysTabControl32.
Add: Adds the specified string as a new entry at the bottom of a ListBox, ComboBox (and possibly other types).
Delete: Deletes the specified entry number from a ListBox or ComboBox.
Choose: Sets the selection in a ListBox or ComboBox to be the specified entry number.
ChooseString: Sets the selection in a ListBox or ComboBox to be the first entry whose leading part matches the specified string.
EditPaste: Pastes the specified string at the caret in an Edit control.
*/

/**
 * after initialization clear
 */
export const ControlSubCmdList: TControlCmdElement[] = [
    {
        SubCommand: 'Check',
        body: 'Control, Check [,, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Turns on (checks) a radio button or checkbox.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#Check',
        exp: [
            'Control, Check [,, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Uncheck',
        body: 'Control, Uncheck [,, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Turns off a radio button or checkbox.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#Uncheck',
        exp: [
            'Control, Uncheck [,, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Enable',
        body: 'Control, Enable [,, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Enables a control if it was previously disabled.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#Enable',
        exp: [
            'Control, Enable [,, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Disable',
        body: 'Control, Disable [,, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Disables or "grays out" a control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#Disable',
        exp: [
            'Control, Disable [,, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Show',
        body: 'Control, Show [,, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Shows a control if it was previously hidden.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#Show',
        exp: [
            'Control, Show [,, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Hide',
        body: 'Control, Hide [,, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Hides a control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#Hide',
        exp: [
            'Control, Hide [,, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Style',
        body:
            'Control, Style , ${1:N} [, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Changes the style of a control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#Style',
        exp: [
            'Control, Style , N [, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'ExStyle',
        body:
            'Control, ExStyle , ${1:N} [, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Changes the extended style of a control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#ExStyle',
        exp: [
            'Control, ExStyle , N [, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'ShowDropDown',
        body:
            'Control, ShowDropDown [,, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Shows the drop-down list of a ComboBox control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#ShowDropDown',
        exp: [
            'Control, ShowDropDown [,, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'HideDropDown',
        body:
            'Control, HideDropDown [,, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Hides the drop-down list of a ComboBox control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#HideDropDown',
        exp: [
            'Control, HideDropDown [,, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'TabLeft',
        body:
            'Control, TabLeft [, ${1:Count}, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Moves left by one or more tabs in a SysTabControl32.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#TabLeft',
        exp: [
            'Control, TabLeft [, Count, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'TabRight',
        body:
            'Control, TabRight [, ${1:Count}, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Moves right by one or more tabs in a SysTabControl32.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#TabRight',
        exp: [
            'Control, TabRight [, Count, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Add',
        body:
            'Control, Add , ${1:String} [, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Adds the specified string as a new entry at the bottom of a ListBox, ComboBox (and possibly other types).',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#Add',
        exp: [
            'Control, Add , String [, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Delete',
        body:
            'Control, Delete , ${1:N} [, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Deletes the specified entry number from a ListBox or ComboBox.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#Delete',
        exp: [
            'Control, Delete , N [, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'Choose',
        body:
            'Control, Choose , ${1:N} [, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Sets the selection in a ListBox or ComboBox to be the specified entry number.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#Choose',
        exp: [
            'Control, Choose , N [, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'ChooseString',
        body:
            'Control, ChooseString , ${1:String} [, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Sets the selection in a ListBox or ComboBox to be the first entry whose leading part matches the specified string.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#ChooseString',
        exp: [
            'Control, ChooseString , String [, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
    {
        SubCommand: 'EditPaste',
        body:
            'Control, EditPaste , ${1:String} [, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: ' Pastes the specified string at the caret in an Edit control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Control.htm#EditPaste',
        exp: [
            'Control, EditPaste , String [, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
        ],
    },
];
