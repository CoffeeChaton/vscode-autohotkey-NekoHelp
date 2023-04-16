export const keyList: readonly string[] = [
    //
    'Joy1',
    'Joy2',
    'Joy3',
    'Joy4',
    'Joy5',
    'Joy6',
    'Joy7',
    'Joy8',
    'Joy9',
    'Joy10',
    'Joy11',
    'Joy12',
    'Joy13',
    'Joy14',
    'Joy15',
    'Joy16',
    'Joy17',
    'Joy18',
    'Joy19',
    'Joy20',
    'Joy21',
    'Joy22',
    'Joy23',
    'Joy24',
    'Joy25',
    'Joy26',
    'Joy27',
    'Joy28',
    'Joy29',
    'Joy30',
    'Joy31',
    'Joy32',
    'JoyX',
    'JoyY',
    'JoyZ',
    'JoyR',
    'JoyU',
    'JoyV',
    'JoyPOV',
    'JoyName',
    'JoyButtons',
    'JoyAxes',
    'JoyInfo',
    //

    'NumLock',
    'Numpad0',
    'Numpad1',
    'Numpad2',
    'Numpad3',
    'Numpad4',
    'Numpad5',
    'NumpadClear',
    'Numpad6',
    'Numpad7',
    'Numpad8',
    'Numpad9',
    'NumpadMult',
    'NumpadAdd',
    'NumpadSub',
    'NumpadDiv',
    'NumpadDot',
    'NumpadDel',
    'NumpadIns',
    'NumpadUp',
    'NumpadDown',
    'NumpadLeft',
    'NumpadRight',
    'NumpadHome',
    'NumpadEnd',
    'NumpadPgUp',
    'NumpadPgDn',
    'NumpadEnter',
    //
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'F13',
    'F14',
    'F15',
    'F16',
    'F17',
    'F18',
    'F19',
    'F20',
    'F21',
    'F22',
    'F23',
    'F24',
    //
    'Browser_Back',
    'Browser_Forward',
    'Browser_Refresh',
    'Browser_Stop',
    'Browser_Search',
    'Browser_Favorites',
    'Browser_Home',
    //
    'Volume_Mute',
    'Volume_Down',
    'Volume_Up',
    //
    'Media_Next',
    'Media_Prev',
    'Media_Stop',
    'Media_Play_Pause',
    //
    'Launch_Mail',
    'Launch_Media',
    'Launch_App1',
    'Launch_App2',

    'LButton',
    'MButton',
    'RButton',
    'WheelDown',
    'WheelLeft',
    'WheelRight',
    'WheelUp',
    'XButton1',
    'XButton2',

    //
    'CapsLock',
    'Space',
    'Tab',
    'Enter',
    'Escape',
    'Esc',
    'BackSpace',
    'BS',
    'ScrollLock',
    'Delete',
    'Del',
    'Insert',
    'Ins',
    'Home',
    'End',
    'PgUp',
    'PgDn',
    'Up',
    'Down',
    'Left',
    'Right',
    //
    'LWin',
    'RWin',
    //
    'Control',
    'LControl',
    'RControl',
    'Ctrl',
    'LCtrl',
    'RCtrl',
    //
    'Alt',
    'LAlt',
    'RAlt',
    //
    'Shift',
    'LShift',
    'RShift',
    //

    'AppsKey',
    'PrintScreen',
    'CtrlBreak',
    'Pause',
];

export const keyListUpSet: ReadonlySet<string> = new Set(keyList.map((k: string): string => k.toUpperCase()));