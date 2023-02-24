/* eslint-disable no-template-curly-in-string */
export type TGuiCmdElement = Readonly<{
    SubCommand: string,
    body: string,
    doc: string,
    link: `https://www.autohotkey.com/docs/v1/lib/Gui.htm#${string}`,
    exp: readonly string[],
}>;

/**
 * after initialization clear
 */
export const guiSubCommandList: TGuiCmdElement[] = [
    {
        SubCommand: 'New',
        body: 'Gui, ${1:GuiName:}New [, ${2:Options}, ${3:Title}]',
        doc: 'Creates a new window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#New',
        exp: [
            'Gui, New , Options, Title',
            'Gui, GuiName:New , Options, Title',
        ],
    },
    {
        SubCommand: 'Add',
        body:
            'Gui, Add, ${1|Text,Edit,UpDown,Picture,Button,Checkbox,Radio,DropDownList,ComboBox,ListBox,ListView,TreeView,Link,Hotkey,DateTime,MonthCal,Slider,Progress,GroupBox,Tab,StatusBar,ActiveX,Custom|} [, ${2:Options}, ${3:Text}]',
        doc: 'Creates a control such as text, button, or checkbox.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Add',
        exp: [
            'Gui, Add, ControlType , Options, Text',
            '',
            'Gui, Add, Text, , % "Please enter your name:"',
            'Gui, Add, Edit, vName',
            'Gui, Show',
        ],
    },
    {
        SubCommand: 'Show',
        body:
            'Gui, Show,[ ${1:W0 H0 X0 Y0 Center xCenter yCenter AutoSize Minimize Maximize Restore NoActivate NA Hide} , ${2:Text}]',

        doc: 'Displays the window. It can also minimize, maximize, or move the window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Show',
        exp: [
            'Gui, Show , Options, Title',
            '',
            'Gui, Show, xCenter y0',
            'Gui, Show, AutoSize Center',
            'Gui, Show, Hide x55 y66 w300 h200, New Title',
        ],
    },
    {
        SubCommand: 'Submit',
        body: 'Gui, Submit, ${1| ,NoHide|}',
        doc: 'Saves the user\'s input and optionally hides the window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Submit',
        exp: [
            'Gui, Submit [, NoHide]',
            'Gui, Submit',
            'Gui, Submit, NoHide',
        ],
    },
    {
        SubCommand: 'Cancel',
        body: 'Gui, Cancel',
        doc: 'Hides the window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Cancel',
        exp: [
            'Gui, Cancel',
        ],
    },
    {
        SubCommand: 'Hide',
        body: 'Gui, Hide',
        doc: 'Hides the window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Hide',
        exp: [
            'Gui, Hide',
        ],
    },
    {
        SubCommand: 'Destroy',
        body: 'Gui, Destroy',
        doc: 'Deletes the window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Destroy',
        exp: ['Gui, Destroy'],
    },
    {
        SubCommand: 'Font',
        body:
            'Gui, Font , ${1:cRed s10 } ${2|bold,italic,strike,underline,norm|}, ${3|Arial,Caslon,Times New Roman,Verdana,any FontName|}',
        doc: 'Sets the typeface, size, style, and text color for subsequently created controls.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Font',
        exp: [
            'Gui, Font [, Options, FontName]',
            '',
            'Gui, Font, s10, Verdana ; Set 10-point Verdana.',
            'Gui, Font,, MS Sans Serif',
            'Gui, Font,, Arial',
            'Gui, Font,, Verdana ; Preferred font.',
            '',
            'Gui, Font,cRed w700 strike ; color-Red Weight-700 strike',
        ],
    },
    {
        SubCommand: 'Color',
        body:
            'Gui, Color , ${1|0xEEAA99,Default,Black,Silver,Gray,White,Maroon,Red,Purple,Fuchsia,Green,Lime,Olive,Yellow,Navy,Blue,Teal,Aqua|}, ${2:ControlColor}',
        doc: 'Sets the background color for the window and/or its controls.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Color',
        exp: [
            'Gui, Color [, WindowColor, ControlColor]',
            '',
            'Gui, Color, 0xEEAA99',
        ],
    },
    {
        SubCommand: 'Margin',
        body: 'Gui, Margin , ${1:X}, ${2:Y}',
        doc: 'Sets the margin/spacing used whenever no explicit position has been specified for a control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Margin',
        exp: ['Gui, Margin [, X, Y]'],
    },
    {
        SubCommand: 'Menu',
        body: 'Gui, Menu , ${1:MenuName}',
        doc: 'Adds or removes a menu bar.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Menu',
        exp: [
            'Gui, Menu [, MenuName]',
            '',
            'Menu, FileMenu, Add, &Open`tCtrl+O, MenuFileOpen  ; See remarks below about Ctrl+O.',
            'Menu, FileMenu, Add, E&xit, MenuHandler',
            'Menu, HelpMenu, Add, &About, MenuHandler',
            'Menu, MyMenuBar, Add, &File, :FileMenu  ; Attach the two sub-menus that were created above.',
            'Menu, MyMenuBar, Add, &Help, :HelpMenu',
            'Gui, Menu, MyMenuBar',
        ],
    },
    {
        SubCommand: 'Minimize',
        body: 'Gui, Minimize',
        doc: 'Performs the indicated operation on the window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Minimize',
        exp: ['Gui, Minimize'],
    },
    {
        SubCommand: 'Maximize',
        body: 'Gui, Maximize',
        doc: 'Performs the indicated operation on the window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Maximize',
        exp: ['Gui, Maximize'],
    },
    {
        SubCommand: 'Restore',
        body: 'Gui, Restore',
        doc: 'Performs the indicated operation on the window.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Restore',
        exp: ['Gui, Restore'],
    },
    {
        SubCommand: 'Flash',
        body: 'Gui, Flash , ${1| ,Off|}',
        doc: 'Blinks the window and its taskbar button.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Flash',
        exp: ['Gui, Flash [, Off]'],
    },
    {
        SubCommand: 'Default',
        body: 'Gui, ${1:GuiName}:Default',
        doc: 'Changes the current thread\'s default GUI window name.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Default',
        exp: [
            'Gui, GuiName:Default',
            '',
            'MsgBox % "The name or number of the current thread\'s default GUI.`n is :" A_DefaultGui',
        ],
    },
    {
        SubCommand: 'Options',
        body:
            'Gui, ${1:GuiName:} +-AlwaysOnTop +-Border +-Caption +-Delimiter +-Disabled +-DPIScale +-HwndOutputVar +-LabelName +-LastFound +-LastFoundExist +-MaximizeBox +-MinimizeBox +-MinSize +-MaxSize +-OwnDialogs +-Owner +-Parent +-Resize +-SysMenu +-Theme +-ToolWindow',
        doc: 'One or more options may be specified immediately after the GUI command.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Gui.htm#Options',
        exp: [
            'Gui, +/-Options1 +/-Options2',
            '',
            'Gui +Resize -MaximizeBox  ; Change the settings of the default GUI window.',
            'Gui MyGui:+Resize -MaximizeBox  ; Change the settings of the GUI named MyGui.',
        ],
    },
];

// Options and styles for a window: Sets various options for the appearance and behavior of the window.
