/* eslint no-magic-numbers: "off" */

// action_args = aLineText;

/**
 * enum enum_act::ACT_INVALID = 0
 */
const ACT_INVALID = 0;
const ACT_FIRST_COMMAND = 24;
const g_delimiter = ',';
// TCHAR g_delimiter = ',';
// TCHAR g_DerefChar = '%';
// TCHAR g_EscapeChar = '`';

const end_flags = [
    ' ',
    g_delimiter,
    '(',
    '\t',
    '<',
    '>',
    ':',
    '=',
    '+',
    '-',
    '*',
    '/',
    '!',
    '~',
    '&',
    '|',
    '^',
    '[',
    '.',
    '?',
    '{',
] as const;

const enum_act: ReadonlyMap<string, number> = new Map<string, number>([
    ['=', 1],
    [':=', 2],

    /**
     * // ACT_EXPRESSION, which is a stand-alone expression outside of any IF or assignment-command;
     * // e.g. fn1(123, fn2(y)) or x&=3
     * // Its name should be "" so that Line::ToText() will properly display it.
     */
    ['', 3],
    ['+=', 4],
    ['-=', 5],
    ['*=', 6],
    ['/=', 7],
    ['STATIC', 8],
    ['IN', 9],
    ['NOT IN', 10],
    ['CONTAINS', 11],
    ['NOT CONTAINS', 12],
    ['IS', 13],
    ['IS NOT', 14],
    ['BETWEEN', 15],
    ['NOT BETWEEN', 16],
    ['', 17],
    ['=', 18],
    ['<>', 19],
    ['>', 20],
    ['>=', 21],
    ['<', 22],
    ['<=', 23],
    ['IFWINEXIST', 24], // 24
    ['IFWINNOTEXIST', 25],
    ['IFWINACTIVE', 26],
    ['IFWINNOTACTIVE', 27],
    ['IFINSTRING', 28],
    ['IFNOTINSTRING', 29],
    ['IFEXIST', 30],
    ['IFNOTEXIST', 31],
    ['IFMSGBOX', 32],
    ['ELSE', 33],
    ['MSGBOX', 34],
    ['INPUTBOX', 35],
    ['SPLASHTEXTON', 36],
    ['SPLASHTEXTOFF', 37],
    ['PROGRESS', 38],
    ['SPLASHIMAGE', 39],
    ['TOOLTIP', 40],
    ['TRAYTIP', 41],
    ['INPUT', 42],
    ['TRANSFORM', 43],
    ['STRINGLEFT', 44],
    ['STRINGRIGHT', 45],
    ['STRINGMID', 46],
    ['STRINGTRIMLEFT', 47],
    ['STRINGTRIMRIGHT', 48],
    ['STRINGLOWER', 49],
    ['STRINGUPPER', 50],
    ['STRINGLEN', 51],
    ['STRINGGETPOS', 52],
    ['STRINGREPLACE', 53],
    ['STRINGSPLIT', 54],
    ['SPLITPATH', 55],
    ['SORT', 56],
    ['ENVGET', 57],
    ['ENVSET', 58],
    ['ENVUPDATE', 59],
    ['RUNAS', 60],
    ['RUN', 61],
    ['RUNWAIT', 62],
    ['URLDOWNLOADTOFILE', 63],
    ['GETKEYSTATE', 64],
    ['SEND', 65],
    ['SENDRAW', 66],
    ['SENDINPUT', 67],
    ['SENDPLAY', 68],
    ['SENDEVENT', 69],
    ['CONTROLSEND', 70],
    ['CONTROLSENDRAW', 71],
    ['CONTROLCLICK', 72],
    ['CONTROLMOVE', 73],
    ['CONTROLGETPOS', 74],
    ['CONTROLFOCUS', 75],
    ['CONTROLGETFOCUS', 76],
    ['CONTROLSETTEXT', 77],
    ['CONTROLGETTEXT', 78],
    ['CONTROL', 79],
    ['CONTROLGET', 80],
    ['SENDMODE', 81],
    ['SENDLEVEL', 82],
    ['COORDMODE', 83],
    ['SETDEFAULTMOUSESPEED', 84],
    ['CLICK', 85],
    ['MOUSEMOVE', 86],
    ['MOUSECLICK', 87],
    ['MOUSECLICKDRAG', 88],
    ['MOUSEGETPOS', 89],
    ['STATUSBARGETTEXT', 90],
    ['STATUSBARWAIT', 91],
    ['CLIPWAIT', 92],
    ['KEYWAIT', 93],
    ['SLEEP', 94],
    ['RANDOM', 95],
    ['GOTO', 96],
    ['GOSUB', 97],
    ['ONEXIT', 98],
    ['HOTKEY', 99],
    ['SETTIMER', 100],
    ['CRITICAL', 101],
    ['THREAD', 102],
    ['RETURN', 103],
    ['EXIT', 104],
    ['LOOP', 105],
    ['FOR', 106],
    ['WHILE', 107],
    ['UNTIL', 108],
    ['BREAK', 109],
    ['CONTINUE', 110],
    ['TRY', 111],
    ['CATCH', 112],
    ['FINALLY', 113],
    ['THROW', 114],
    ['SWITCH', 115],
    ['CASE', 116],
    ['{', 117],
    ['}', 118],
    ['WINACTIVATE', 119],
    ['WINACTIVATEBOTTOM', 120],
    ['WINWAIT', 121],
    ['WINWAITCLOSE', 122],
    ['WINWAITACTIVE', 123],
    ['WINWAITNOTACTIVE', 124],
    ['WINMINIMIZE', 125],
    ['WINMAXIMIZE', 126],
    ['WINRESTORE', 127],
    ['WINHIDE', 128],
    ['WINSHOW', 129],
    ['WINMINIMIZEALL', 130],
    ['WINMINIMIZEALLUNDO', 131],
    ['WINCLOSE', 132],
    ['WINKILL', 133],
    ['WINMOVE', 134],
    ['WINMENUSELECTITEM', 135],
    ['PROCESS', 136],
    ['WINSET', 137],
    ['WINSETTITLE', 138],
    ['WINGETTITLE', 139],
    ['WINGETCLASS', 140],
    ['WINGET', 141],
    ['WINGETPOS', 142],
    ['WINGETTEXT', 143],
    ['SYSGET', 144],
    ['POSTMESSAGE', 145],
    ['SENDMESSAGE', 146],
    ['PIXELGETCOLOR', 147],
    ['PIXELSEARCH', 148],
    ['IMAGESEARCH', 149],
    ['GROUPADD', 150],
    ['GROUPACTIVATE', 151],
    ['GROUPDEACTIVATE', 152],
    ['GROUPCLOSE', 153],
    ['DRIVESPACEFREE', 154],
    ['DRIVE', 155],
    ['DRIVEGET', 156],
    ['SOUNDGET', 157],
    ['SOUNDSET', 158],
    ['SOUNDGETWAVEVOLUME', 159],
    ['SOUNDSETWAVEVOLUME', 160],
    ['SOUNDBEEP', 161],
    ['SOUNDPLAY', 162],
    ['FILEAPPEND', 163],
    ['FILEREAD', 164],
    ['FILEREADLINE', 165],
    ['FILEDELETE', 166],
    ['FILERECYCLE', 167],
    ['FILERECYCLEEMPTY', 168],
    ['FILEINSTALL', 169],
    ['FILECOPY', 170],
    ['FILEMOVE', 171],
    ['FILECOPYDIR', 172],
    ['FILEMOVEDIR', 173],
    ['FILECREATEDIR', 174],
    ['FILEREMOVEDIR', 175],
    ['FILEGETATTRIB', 176],
    ['FILESETATTRIB', 177],
    ['FILEGETTIME', 178],
    ['FILESETTIME', 179],
    ['FILEGETSIZE', 180],
    ['FILEGETVERSION', 181],
    ['SETWORKINGDIR', 182],
    ['FILESELECTFILE', 183],
    ['FILESELECTFOLDER', 184],
    ['FILEGETSHORTCUT', 185],
    ['FILECREATESHORTCUT', 186],
    ['INIREAD', 187],
    ['INIWRITE', 188],
    ['INIDELETE', 189],
    ['REGREAD', 190],
    ['REGWRITE', 191],
    ['REGDELETE', 192],
    ['SETREGVIEW', 193],
    ['OUTPUTDEBUG', 194],
    ['SETKEYDELAY', 195],
    ['SETMOUSEDELAY', 196],
    ['SETWINDELAY', 197],
    ['SETCONTROLDELAY', 198],
    ['SETBATCHLINES', 199],
    ['SETTITLEMATCHMODE', 200],
    ['SETFORMAT', 201],
    ['FORMATTIME', 202],
    ['SUSPEND', 203],
    ['PAUSE', 204],
    ['AUTOTRIM', 205],
    ['STRINGCASESENSE', 206],
    ['DETECTHIDDENWINDOWS', 207],
    ['DETECTHIDDENTEXT', 208],
    ['BLOCKINPUT', 209],
    ['SETNUMLOCKSTATE', 210],
    ['SETSCROLLLOCKSTATE', 211],
    ['SETCAPSLOCKSTATE', 212],
    ['SETSTORECAPSLOCKMODE', 213],
    ['KEYHISTORY', 214],
    ['LISTLINES', 215],
    ['LISTVARS', 216],
    ['LISTHOTKEYS', 217],
    ['EDIT', 218],
    ['RELOAD', 219],
    ['MENU', 220],
    ['GUI', 221],
    ['GUICONTROL', 222],
    ['GUICONTROLGET', 223],
    ['EXITAPP', 224],
    ['SHUTDOWN', 225],
    ['FILEENCODING', 226],
    ['#IF', 227],
]);

/**
 * typedef UCHAR ActionTypeType
 * [0, 255]
 * If ever have more than 256 actions, will have to change this (but it would increase code size due to static data in g_act).
 */
type TActionTypeType = number;

/**
 * ```c++
 * inline LPTSTR StrChrAny(LPTSTR aStr, LPTSTR aCharList)
 * ```
 */
function StrChrAny(aStr: readonly string[], aCharList: readonly string[]): string | null {
    if (aStr.length === 0 || aCharList.length === 0) return null;
    //  LPTSTR look_for_this_char;
    //  TCHAR char_being_analyzed;
    //  for (; *aStr; ++aStr)
    //      for (char_being_analyzed = *aStr, look_for_this_char = aCharList; *look_for_this_char; ++look_for_this_char)
    //          if (char_being_analyzed == *look_for_this_char)
    //              return aStr;  // Match found.
    //  return NULL; // No match.

    for (const _aStr of aStr) {
        if (aCharList.includes(_aStr)) return _aStr;
    }
    return null;
}

/**
 * ```c++
 * inline LPTSTR Script::ParseActionType(LPTSTR aBufTarget, LPTSTR aBufSource, bool aDisplayErrors)
 * ```
 */
function _ParseActionType(aBufTarget: string, aBufSource: readonly string[], _aDisplayErrors: boolean): string {
    // end_flags

    const end_marker: string | null = StrChrAny(aBufSource, end_flags);

    // eslint-disable-next-line sonarjs/no-all-duplicated-branches
    if (end_marker === null) {
        // No delimiter found, so set end_marker to the location of the last char in string.
    } else {
        // Found a delimiter.
    }

    return '';
}

/**
 * script.cpp
 * ```c++
 * inline ActionTypeType Script::ConvertActionType(LPTSTR aActionTypeString)
 * // inline since it's called so often, but don't keep it in the .h due to #include issues.
 * {
 * // For the loop's index:
 *    // Use an int rather than ActionTypeType since it's sure to be large enough to go beyond
 *    // 256 if there happen to be exactly 256 actions in the array:
 *     for (int action_type = ACT_FIRST_COMMAND; action_type < g_ActionCount; ++action_type)
 *        if (!_tcsicmp(aActionTypeString, g_act[action_type].Name)) // Match found.
 *            return action_type;
 *    return ACT_INVALID;  // On failure to find a match.
 * }
 * ```
 */
function _ConvertActionType(aActionTypeString: string): TActionTypeType {
    const upName: string = aActionTypeString.toUpperCase();

    const ed: number | undefined = enum_act.get(upName);
    if (ed === undefined) return ACT_INVALID;

    return ed < ACT_FIRST_COMMAND
        ? ACT_INVALID
        : ed;
}
