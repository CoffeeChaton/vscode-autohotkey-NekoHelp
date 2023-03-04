/* eslint-disable no-template-curly-in-string */
/**
 * <https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Remarks>
 *
 * ```ahk
 * GuiControl, MyGui:Show, MyButton
 * ;           ^^^^^ -> name/number
 * GuiControl , MyGui: , MyListBox , Item1|Item2
 * ```
 */
export type TGuiControlCmdElement = Readonly<{
    SubCommand: string,
    body: `GuiControl, ${string}`,
    doc: string,
    link: `https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#${string}`,
    exp: readonly string[],
}>;

/**
 * after initialization clear
 */
export const GuiControlSubCmdList: TGuiControlCmdElement[] = [
    // V-------- warn
    {
        SubCommand: '(Blank)',
        body: 'GuiControl, , ${1:ControlID} [, ${2:Value}]',
        doc: 'Puts new contents into the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Blank',
        exp: [
            'GuiControl, , ControlID [, Value]',
            '',
            'GuiControl,, MyPic, *icon2 *w100 *h-1 C:\\My Application.exe',
            'GuiControl,, MyTab, |Red|Blue',
            'GuiControl,, MyListBox, |Red|Green|Blue',
            'GuiControl,, MyEdit, % "New text line 1.`nNew text line 2."',
            'GuiControl,, MyRadio2, 1',
        ],
    },
    {
        SubCommand: '(options)',
        body: 'GuiControl, +-Option1 , ${1:ControlID} [, ${2:Value}]',
        doc: 'Add or remove various [control-specific](https://www.autohotkey.com/docs/v1/lib/GuiControls.htm) or [general](https://www.autohotkey.com/docs/v1/lib/Gui.htm#OtherOptions) options and styles.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#options',
        exp: [
            'GuiControl, +/-Option1 +/-Option2 ..., ControlID , Value',
            '',
            'GuiControl, +AltSubmit -g, MyListBox',
            'GuiControl, +Default, OK',
            'GuiControl +g, ControlID, % FuncObj',
        ],
    },
    // normal
    {
        SubCommand: 'Text',
        body: 'GuiControl, Text, ${1:ControlID} [, ${2:Value}]',
        doc: 'Changes the text/caption of the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Text',
        exp: [
            'GuiControl, Text, ControlID [, Value]',
            '',
            '',
        ],
    },
    {
        SubCommand: 'Move',
        body: 'GuiControl, Move, ${1:ControlID} , ${2:x10 y20 w200 h100}',
        doc: 'Moves and/or resizes the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Move',
        exp: [
            'GuiControl, Move, ControlID, Options',
            '',
            'GuiControl, Move, MyEdit, x10 y20 w200 h100',
            'GuiControl, Move, MyEdit, % "x" VarX+10 "y" VarY+5 "w" VarW*2 "h" VarH*1.5 ; Uses an expression via "% " prefix.',
            '',
            'GuiControl, Move, OK, x100 y200',
        ],
    },
    {
        SubCommand: 'MoveDraw',
        body: 'GuiControl, MoveDraw, ${1:ControlID} [, ${2:x10 y20 w200 h100}]',
        doc: 'Moves and/or resizes the control and repaints the region of the GUI window occupied by the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#MoveDraw',
        exp: [
            'GuiControl, MoveDraw, ControlID , Options',
            '',
        ],
    },
    {
        SubCommand: 'Focus',
        body: 'GuiControl, Focus, ${1:ControlID}',
        doc: 'Sets keyboard focus to the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Focus',
        exp: [
            'GuiControl, Focus, ControlID',
            '',
            'GuiControl, Focus, LastName',
        ],
    },
    {
        SubCommand: 'Disable',
        body: 'GuiControl, Disable, ${1:ControlID}',
        doc: 'Disables (grays out) the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Disable',
        exp: [
            'GuiControl, Disable, ControlID',
        ],
    },
    {
        SubCommand: 'Enable',
        body: 'GuiControl, Enable, ${1:ControlID}',
        doc: 'Enables the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Enable',
        exp: [
            'GuiControl, Enable, ControlID',
        ],
    },
    {
        SubCommand: 'Hide',
        body: 'GuiControl, Hide, ${1:ControlID}',
        doc: 'Hides the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Hide',
        exp: [
            'GuiControl, Hide, ControlID',
        ],
    },
    {
        SubCommand: 'Show',
        body: 'GuiControl, Show, ${1:ControlID}',
        doc: 'Shows the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Show',
        exp: [
            'GuiControl, Show, ControlID',
        ],
    },
    {
        SubCommand: 'Choose',
        body: 'GuiControl, Choose, ${1:ControlID} [, ${2:Number}]',
        doc: 'Sets the selection in a ListBox, DropDownList, ComboBox, or Tab control to be the Nth entry.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Choose',
        exp: [
            'GuiControl, Choose, ControlID, N',
            '',
            'GuiControl, Choose, MyListBox, |3',
            '',
            'Gui +LastFound  ; Avoids the need to specify WinTitle below.',
            'PostMessage, 0x0185, 1, -1, ListBox1  ; Select all items. 0x0185 is LB_SETSEL.',
            'PostMessage, 0x0185, 0, -1, ListBox1  ; Deselect all items.',
            'GuiControl, Choose, ListBox1, 0  ; Deselect all items [requires v1.1.06+].',
        ],
    },
    {
        SubCommand: 'ChooseString',
        body: 'GuiControl, ChooseString, ${1:ControlID} [, ${2:String}]',
        doc: 'Sets the selection (choice) in a ListBox, DropDownList, ComboBox, or Tab control to be the entry whose leading part matches _String_.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#ChooseString',
        exp: [
            'GuiControl, ChooseString, ControlID, String',
        ],
    },
    {
        SubCommand: 'Font',
        body: 'GuiControl, Font, ${1:ControlID}',
        doc: 'Changes the control\'s font to the typeface, size, color, and style currently in effect for its window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Font',
        exp: [
            'GuiControl, Font, ControlID',
            '',
            'Gui, Font, s18 cRed Bold, Verdana  ; If desired, use a line like this to set a new default font for the window.',
            'GuiControl, Font, MyEdit  ; Put the above font into effect for a control.',
        ],
    },
];
