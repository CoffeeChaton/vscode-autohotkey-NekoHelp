/* eslint-disable no-template-curly-in-string */
type TMenuCmdElement = Readonly<{
    SubCommand: string,
    body: `Menu, ${string}`,
    doc: string,
    link: `https://www.autohotkey.com/docs/v1/lib/Menu.htm#${string}`,
    exp: readonly string[],
}>;

/**
 * after initialization clear
 */
export const MenuSubCmdList: TMenuCmdElement[] = [
    {
        SubCommand: 'Add',
        body: 'Menu, ${1:MenuName}, Add [, ${2:MenuItemName}, LabelOrSubmenu, +-Pn +-Radio +-Right +-Break +-BarBreak]',
        doc: 'Adds a menu item, updates one with a new submenu or label, or converts one from a normal item into a submenu (or vice versa).',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Add',
        exp: [
            'Menu, MenuName, Add [, MenuItemName, LabelOrSubmenu, Options]',
            '',
            'Menu, MySubmenu, Add, Item1',
            'Menu, Tray, Add, This menu item is a submenu, :MySubmenu',
        ],
    },
    {
        SubCommand: 'Insert',
        body:
            'Menu, ${1:MenuName}, Insert [, ${2:MenuItemName}, ItemToInsert, LabelOrSubmenu, +-Pn +-Radio +-Right +-Break +-BarBreak]',
        doc: 'Inserts a new item before the specified menu item.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Insert',
        exp: [
            'Menu, MenuName, Insert [, MenuItemName, ItemToInsert, LabelOrSubmenu, Options]',
        ],
    },
    {
        SubCommand: 'Delete',
        body: 'Menu, ${1:MenuName}, Delete [, ${2:MenuItemName}]',
        doc: 'Deletes the specified menu item from the menu.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Delete',
        exp: [
            'Menu, MenuName, Delete [, MenuItemName]',
        ],
    },
    {
        SubCommand: 'DeleteAll',
        body: 'Menu, ${1:MenuName}, DeleteAll',
        doc: 'Deletes all custom menu items from the menu.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#DeleteAll',
        exp: [
            'Menu, MenuName, DeleteAll',
        ],
    },
    {
        SubCommand: 'Rename',
        body: 'Menu, ${1:MenuName}, Rename, ${2:MenuItemName} [, ${:3NewName}]',
        doc: 'Renames the specified menu item to _NewName_.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Rename',
        exp: [
            'Menu, MenuName, Rename, MenuItemName [, NewName]',
        ],
    },
    {
        SubCommand: 'Check',
        body: 'Menu, ${1:MenuName}, Check, ${2:MenuItemName}',
        doc: 'Adds a visible check mark in the menu next to the specified menu item (if there isn\'t one already).',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Check',
        exp: [
            'Menu, MenuName, Check, MenuItemName',
        ],
    },
    {
        SubCommand: 'Uncheck',
        body: 'Menu, ${1:MenuName}, Uncheck, ${2:MenuItemName}',
        doc: 'Removes the check mark (if there is one) from the specified menu item.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Uncheck',
        exp: [
            'Menu, MenuName, Uncheck, MenuItemName',
        ],
    },
    {
        SubCommand: 'ToggleCheck',
        body: 'Menu, ${1:MenuName}, ToggleCheck, ${2:MenuItemName}',
        doc: 'Adds a check mark to the specified menu item if there wasn\'t one; otherwise, removes it.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#ToggleCheck',
        exp: [
            'Menu, MenuName, ToggleCheck, MenuItemName',
        ],
    },
    {
        SubCommand: 'Enable',
        body: 'Menu, ${1:MenuName}, Enable, ${2:MenuItemName}',
        doc: 'Allows the user to once again select the specified menu item if was previously disabled (grayed).',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Enable',
        exp: [
            'Menu, MenuName, Enable, MenuItemName',
        ],
    },
    {
        SubCommand: 'Disable',
        body: 'Menu, ${1:MenuName}, Disable, ${2:MenuItemName}',
        doc: 'Changes the specified menu item to a gray color to indicate that the user cannot select it.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Disable',
        exp: [
            'Menu, MenuName, Disable, MenuItemName',
        ],
    },
    {
        SubCommand: 'ToggleEnable',
        body: 'Menu, ${1:MenuName}, ToggleEnable, ${2:MenuItemName}',
        doc: 'Disables the specified menu item if it was previously enabled; otherwise, enables it.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#ToggleEnable',
        exp: [
            'Menu, MenuName, ToggleEnable, MenuItemName',
        ],
    },
    {
        SubCommand: 'Default',
        body: 'Menu, ${1:MenuName}, Default [, ${2:MenuItemName}]',
        doc: 'Changes the menu\'s default item to be the specified menu item and makes its font bold.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Default',
        exp: [
            'Menu, MenuName, Default [, MenuItemName]',
        ],
    },
    {
        SubCommand: 'NoDefault',
        body: 'Menu, ${1:MenuName}, NoDefault',
        doc: 'Reverses setting a user-defined default menu item.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#NoDefault',
        exp: [
            'Menu, MenuName, NoDefault',
        ],
    },
    {
        SubCommand: 'Standard',
        body: 'Menu, ${1:MenuName}, Standard',
        doc: 'Inserts the standard menu items at the bottom of the menu (if they are not already present).',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Standard',
        exp: [
            'Menu, MenuName, Standard',
        ],
    },
    {
        SubCommand: 'NoStandard',
        body: 'Menu, ${1:MenuName}, NoStandard',
        doc: 'Removes all standard (non-custom) menu items from the menu (if they are present).',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#NoStandard',
        exp: [
            'Menu, MenuName, NoStandard',
        ],
    },
    {
        SubCommand: 'Icon',
        body: 'Menu, ${1:Tray_or_MenuName}, Icon',
        doc: '1. Setting the tray icon\n2. Setting the menu item\'s icon',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Icon',
        exp: [
            'Menu, Tray, Icon [, FileName, IconNumber, 1] ;Setting the tray icon',
            'Menu, MenuName, Icon, MenuItemName, FileName [, IconNumber, IconWidth] ;Setting the menu item\'s icon',
            '',
            'Menu, MenuName, Icon, MenuItemName, Filename.png,, 0',
        ],
    },
    {
        SubCommand: 'NoIcon',
        body: 'Menu, ${1:Tray_or_MenuName}, NoIcon',
        doc: '1. Removing the tray icon\n2. Removing the menu item\'s icon',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#NoIcon',
        exp: [
            'Menu, Tray, NoIcon',
            'Menu, MenuName, NoIcon, MenuItemName',
        ],
    },
    {
        SubCommand: 'Tip',
        body: 'Menu, Tray, Tip [, ${1:Text}]',
        doc: 'Changes the tray icon\'s tooltip.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Tip',
        exp: [
            'Menu, Tray, Tip [, Text]',
        ],
    },
    {
        SubCommand: 'Show',
        body: 'Menu, ${1:MenuName}, Show [, ${2:X}, ${3:Y}]',
        doc: 'Displays _MenuName_.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Show',
        exp: [
            'Menu, MenuName, Show [, X, Y]',
        ],
    },
    {
        SubCommand: 'Color',
        body:
            'Menu, ${1:MenuName}, Color, ${2|Black,Silver,Gray,White,Maroon,Red,Purple,Fuchsia,Green,Lime,Olive,Yellow,Navy,Blue,Teal,Aqua|} [, ${3:Single}',
        doc: 'Changes the background color of the menu to _ColorValue_..',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Color',
        exp: [
            'Menu, MenuName, Color, ColorValue [, Single]',
        ],
    },
    {
        SubCommand: 'Click',
        body: 'Menu, Tray, Click, ${1:ClickCount}',
        doc: 'Sets the number of clicks to activate the tray menu\'s default menu item.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#Click',
        exp: [
            'Menu, Tray, Click, ClickCount',
        ],
    },
    {
        SubCommand: 'MainWindow',
        body: 'Menu, Tray, MainWindow',
        doc: 'Allows the [main window](https://www.autohotkey.com/docs/v1/Program.htm#main-window) of a script to be opened via the tray icon, which is impossible by default for [compiled](https://www.autohotkey.com/docs/v1/Scripts.htm#ahk2exe) or [embedded](https://www.autohotkey.com/docs/v1/Program.htm#embedded-scripts) scripts.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#MainWindow',
        exp: [
            'Menu, Tray, MainWindow',
        ],
    },
    {
        SubCommand: 'NoMainWindow',
        body: 'Menu, Tray, NoMainWindow',
        doc: 'Prevents the [main window](https://www.autohotkey.com/docs/v1/Program.htm#main-window) from being opened via the tray icon.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#NoMainWindow',
        exp: [
            'Menu, Tray, NoMainWindow',
        ],
    },
    {
        SubCommand: 'UseErrorLevel',
        body: 'Menu, MenuName, UseErrorLevel [, Off]',
        doc: 'Skips any warning dialogs and thread terminations whenever the Menu command generates an error.',
        link: 'https://www.autohotkey.com/docs/v1/lib/Menu.htm#UseErrorLevel',
        exp: [
            'Menu, MenuName, UseErrorLevel [, Off]',
        ],
    },
];
