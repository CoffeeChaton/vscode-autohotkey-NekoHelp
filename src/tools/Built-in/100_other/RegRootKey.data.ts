/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
/* eslint-disable no-magic-numbers */

// static RegRootKeyType sRegRootKeyTypes[] =
// {
//     {_T("HKLM"), _T("HKEY_LOCAL_MACHINE"), HKEY_LOCAL_MACHINE},
//     {_T("HKCR"), _T("HKEY_CLASSES_ROOT"), HKEY_CLASSES_ROOT},
//     {_T("HKCC"), _T("HKEY_CURRENT_CONFIG"), HKEY_CURRENT_CONFIG},
//     {_T("HKCU"), _T("HKEY_CURRENT_USER"), HKEY_CURRENT_USER},
//     {_T("HKU"), _T("HKEY_USERS"), HKEY_USERS}
// };

// export const enum ERegRootKEy {
//     HKLM = 'HKEY_LOCAL_MACHINE',
//     HKCR = 'HKEY_CLASSES_ROOT',
//     HKCC = 'HKEY_CURRENT_CONFIG',
//     HKCU = 'HKEY_CURRENT_USER',
//     HKU = 'HKEY_USERS',
// }

/**
 * <https://www.autohotkey.com/docs/v1/lib/RegRead.htm>
 * ```
 * \\workstation01:HKEY_LOCAL_MACHINE
 * ```
 */
export const RegRootList = [
    'HKLM',
    'HKEY_LOCAL_MACHINE',
    'HKCR',
    'HKEY_CLASSES_ROOT',
    'HKCC',
    'HKEY_CURRENT_CONFIG',
    'HKCU',
    'HKEY_CURRENT_USER',
    'HKU',
    'HKEY_USERS',
] as const;

// const z = [
//     // eslint-disable-next-line sonarjs/no-duplicate-string
//     ['HKEY_CLASSES_ROOT (HKCR)', 'lib/RegRead.htm'],
//     ['HKEY_CURRENT_CONFIG (HKCC)', 'lib/RegRead.htm'],
//     ['HKEY_CURRENT_USER (HKCU)', 'lib/RegRead.htm'],
//     ['HKEY_LOCAL_MACHINE (HKLM)', 'lib/RegRead.htm'],
//     ['HKEY_USERS (HKU)', 'lib/RegRead.htm'],
// ];

// \\workstation01:HKEY_LOCAL_MACHINE
// [, \t:](HKCR|)[, \t\\]

// LoopReg.htm              Loop, Reg, KeyName , Mode
// LoopReg.htm-2            Loop, RootKey , Key, IncludeSubKeys?, Recurse?
// RegRead.htm              RegRead, OutputVar, KeyName [, ValueName]
// RegWrite.htm             RegWrite, ValueType, KeyName [, ValueName, Value]
// RegDelete.htm            RegDelete, KeyName [, ValueName]

// RegExMatch.htm           RegExMatch()
// RegExReplace.htm         RegExReplace()
// RegisterCallback.htm     RegisterCallback()

// SetRegView.htm
