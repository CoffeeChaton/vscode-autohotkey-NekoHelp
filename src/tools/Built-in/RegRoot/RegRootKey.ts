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
