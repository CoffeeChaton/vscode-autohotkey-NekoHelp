import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import type { TAElement } from './A_Variables.data';
import { AVariablesList } from './A_Variables.data';

/**
 * https://www.autohotkey.com/docs/v1/Variables.htm id="XXXX"
 */
const idList: ReadonlySet<string> = new Set([
    'toc',
    'Variables',
    'Intro',
    'assigning',
    'retrieving',
    'Expressions',
    'Boolean',
    'True',
    'False',
    'percent-space',
    'Operators',
    'operators',
    'ref',
    'new',
    'IncDec',
    'pow',
    'unary',
    'amp',
    'MulDiv',
    'divide',
    'FloorDivide',
    'AddSub',
    'bitwise',
    'concat',
    'regex',
    'compare',
    'equal',
    'not',
    'and',
    'or',
    'ternary',
    'AssignOp',
    'comma',
    'CommaPerf',
    'BuiltIn',
    'BuiltIn_TOC',
    'Special_Characters',
    'Space',
    'Tab',
    'prop',
    'CommandLine',
    'Args',
    'WorkingDir',
    'InitialWorkingDir',
    'ScriptDir',
    'ScriptName',
    'ScriptFullPath',
    'ScriptHwnd',
    'LineNumber',
    'LineFile',
    'ThisFunc',
    'ThisLabel',
    'AhkVersion',
    'AhkPath',
    'IsUnicode',
    'IsCompiled',
    'ExitReason',
    'date',
    'YYYY',
    'MM',
    'DD',
    'MMMM',
    'MMM',
    'DDDD',
    'DDD',
    'WDay',
    'YDay',
    'YWeek',
    'Hour',
    'Min',
    'Sec',
    'MSec',
    'Now',
    'NowUTC',
    'TickCount',
    'settings',
    'IsSuspended',
    'IsPaused',
    'IsCritical',
    'BatchLines',
    'ListLines',
    'TitleMatchMode',
    'TitleMatchModeSpeed',
    'DetectHiddenWindows',
    'DetectHiddenText',
    'AutoTrim',
    'StringCaseSense',
    'FileEncoding',
    'FormatInteger',
    'FormatFloat',
    'SendMode',
    'SendLevel',
    'StoreCapslockMode', // FIXME StoreCapslockMode -> StoreCapsLockMode
    'KeyDelay',
    'KeyDelayPlay',
    'WinDelay',
    'ControlDelay',
    'MouseDelay',
    'DefaultMouseSpeed',
    'CoordMode',
    'RegView',
    'IconHidden',
    'IconTip',
    'IconFile',
    'IconNumber',
    'User_Idle_Time',
    'TimeIdle',
    'TimeIdlePhysical',
    'TimeIdleKeyboard',
    'TimeIdleMouse',
    'gui',
    'DefaultGui',
    'DefaultListView',
    'DefaultTreeView',
    'Gui',
    'GuiControl',
    'GuiWidth',
    'GuiX',
    'GuiY',
    'GuiEvent',
    'GuiControlEvent',
    'EventInfo',
    'h',
    'ThisMenuItem',
    'ThisMenu',
    'ThisMenuItemPos',
    'ThisHotkey',
    'PriorHotkey',
    'PriorKey',
    'TimeSinceThisHotkey',
    'TimeSincePriorHotkey',
    'EndChar',
    'os',
    'ComSpec',
    'Temp',
    'OSType',
    'OSVersion',
    'Is64bitOS',
    'PtrSize',
    'Language',
    'ComputerName',
    'UserName',
    'WinDir',
    'ProgramFiles',
    'AppData',
    'AppDataCommon',
    'Desktop',
    'DesktopCommon',
    'StartMenu',
    'StartMenuCommon',
    'Programs',
    'ProgramsCommon',
    'Startup',
    'StartupCommon',
    'MyDocuments',
    'IsAdmin',
    'RequireAdmin',
    'Screen',
    'ScreenDPI',
    'IPAddress',
    'misc',
    'Cursor',
    'Caret',
    'Clipboard',
    'A_Clipboard',
    'ClipboardAll',
    'ErrorLevel',
    'LastError',
    'TrueFalse',
    'loop',
    'Index',
    'cap',
]);

function LoopFileError(group: string, errList: TErrObj[], e: TAElement, uri: string, body: string): void {
    if (group !== 'LoopFile') {
        errList.push({
            msg: 'A_LoopFile group <> LoopFile',
            value: e,
        });
    } else if (uri !== `https://www.autohotkey.com/docs/v1/lib/LoopFile.htm#${body.replace(/^A_/u, '')}`) {
        if (body === 'A_LoopFilePath') {
            if (uri === 'https://www.autohotkey.com/docs/v1/lib/LoopFile.htm#LoopFileFullPath') {
                // not error
            } else {
                errList.push({
                    msg: 'A_LoopFile uri ruler error',
                    value: e,
                });
            }
        } else {
            errList.push({
                msg: 'A_LoopFile uri ruler error',
                value: e,
            });
        }
    }
}

function LoopRegError(group: string, errList: TErrObj[], e: TAElement, uri: string): void {
    if (group !== 'LoopReg') {
        errList.push({
            msg: 'A_LoopReg group Error',
            value: e,
        });
    } else if (uri !== 'https://www.autohotkey.com/docs/v1/lib/LoopReg.htm#vars') {
        errList.push({
            msg: 'A_LoopReg uri Error',
            value: e,
        });
    }
}

function LoopParseError(group: string, errList: TErrObj[], e: TAElement, uri: string): void {
    if (group !== 'LoopParse') {
        errList.push({
            msg: 'LoopParse group Error',
            value: e,
        });
    } else if (uri !== 'https://www.autohotkey.com/docs/v1/lib/LoopParse.htm#LoopField') {
        errList.push({
            msg: 'LoopParse uri Error',
            value: e,
        });
    }
}

type TErrObj = {
    msg: string,
    value: unknown,
};

describe('check A_Variables ruler', () => {
    const arr1: string[] = AVariablesList
        .map((v): string => v.body.replace('A_', ''));

    const max = 158;

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const st1 = (repository.builtin_variable.patterns[0].match)
            .replace('(?<![.#])\\b(?i:A_(?:', '')
            .replace('))\\b', '');

        expect(arr1).toHaveLength(max);
        expect(st1).toBe(arr1.join('|'));
    });

    it('check uri', () => {
        expect.hasAssertions();

        const errList: TErrObj[] = [];
        const LoopFileList: string[] = [];
        const LoopRegList: string[] = [];
        const SpecialUriList: [`https:${string}`, `A_${string}`][] = [];
        for (const e of AVariablesList) {
            const { uri, body, group } = e;
            if (body.startsWith('A_LoopFile')) {
                LoopFileList.push(body);
                LoopFileError(group, errList, e, uri, body);
                continue;
            }

            if (body.startsWith('A_LoopReg')) {
                LoopRegList.push(body);
                LoopRegError(group, errList, e, uri);
                continue;
            }

            if (body === 'A_LoopField') {
                LoopParseError(group, errList, e, uri);
                continue;
            }
            if (body === 'A_LoopReadLine') {
                if (group !== 'LoopReadFile') {
                    errList.push({
                        msg: 'LoopReadFile group Error',
                        value: e,
                    });
                } else if (uri !== 'https://www.autohotkey.com/docs/v1/lib/LoopReadFile.htm#LoopReadLine') {
                    errList.push({
                        msg: 'LoopReadFile uri Error',
                        value: e,
                    });
                }
                continue;
            }

            // other
            if (!uri.startsWith('https://www.autohotkey.com/docs/v1/Variables.htm#')) {
                errList.push({
                    msg: 'A_var uri Error',
                    value: e,
                });
                continue;
            }
            if (group === 'LoopReg' || group === 'LoopFile' || group === 'LoopParse') {
                errList.push({
                    msg: 'A_var group Error',
                    value: e,
                });
                continue;
            }
            const tag = uri.replace('https://www.autohotkey.com/docs/v1/Variables.htm#', '');
            if (tag !== body.replace(/^A_/u, '')) {
                SpecialUriList.push([uri, body]);
            }
            if (!idList.has(tag)) {
                if (body === 'A_StoreCapsLockMode') continue;
                errList.push({
                    msg: 'idList Error',
                    value: e,
                });
            }
        }

        expect(SpecialUriList).toStrictEqual([
            // TODO need to check with Humanity...
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#BatchLines',
                'A_NumBatchLines', // A_BatchLines (synonymous with A_NumBatchLines)
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#Caret',
                'A_CaretX',
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#Caret',
                'A_CaretY',
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#CoordMode',
                'A_CoordModeCaret',
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#CoordMode',
                'A_CoordModeMenu',
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#CoordMode',
                'A_CoordModeMouse',
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#CoordMode',
                'A_CoordModePixel',
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#CoordMode',
                'A_CoordModeToolTip',
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#DD',
                'A_MDay', // `A_MDay` or `A_DD`
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#GuiWidth',
                'A_GuiHeight', // doc === A_GuiWidth
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#IPAddress',
                'A_IPAddress1',
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#IPAddress',
                'A_IPAddress2',
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#IPAddress',
                'A_IPAddress3',
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#IPAddress',
                'A_IPAddress4',
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#KeyDelay',
                'A_KeyDuration', // doc === A_KeyDelay
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#KeyDelayPlay',
                'A_KeyDurationPlay', // doc === A_KeyDelayPlay
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#MM',
                'A_Mon', // `A_Mon` or `A_MM`
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#MouseDelay',
                'A_MouseDelayPlay', // doc === A_MouseDelay
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#Screen',
                'A_ScreenHeight', // doc === A_ScreenHeight === A_ScreenWidth
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#Screen',
                'A_ScreenWidth', // doc === A_ScreenHeight === A_ScreenWidth
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#StoreCapslockMode',
                'A_StoreCapsLockMode', // FIXME StoreCapslockMode -> StoreCapsLockMode
            ],
            [
                'https://www.autohotkey.com/docs/v1/Variables.htm#YYYY',
                'A_Year', // Synonymous with `A_Year` or `A_YYYY`.
            ],
        ]);
        expect(LoopRegList).toStrictEqual([
            'A_LoopRegKey',
            'A_LoopRegName',
            'A_LoopRegSubKey',
            'A_LoopRegTimeModified',
            'A_LoopRegType',
        ]);
        expect(LoopFileList).toStrictEqual([
            'A_LoopFileAttrib',
            'A_LoopFileDir',
            'A_LoopFileExt',
            'A_LoopFileFullPath',
            'A_LoopFileLongPath',
            'A_LoopFileName',
            'A_LoopFilePath',
            'A_LoopFileShortName',
            'A_LoopFileShortPath',
            'A_LoopFileSize',
            'A_LoopFileSizeKB',
            'A_LoopFileSizeMB',
            'A_LoopFileTimeAccessed',
            'A_LoopFileTimeCreated',
            'A_LoopFileTimeModified',
            // https://www.autohotkey.com/docs/v1/lib/LoopFile.htm#Special_Variables
        ]);
        expect(errList).toHaveLength(0);
    });

    it('check : doc with human censored', () => {
        expect.hasAssertions();

        const docList: string[] = [];
        for (const e of AVariablesList) {
            const { doc, body, group } = e;

            if (doc.includes('(https://www.autohotkey.com/docs/v1/')) continue;
            if (doc.includes('```ahk\n') && doc.includes(body)) continue;
            if (group === 'LoopFile' || group === 'LoopReg') continue;

            docList.push(body);
        }

        expect(arr1).toHaveLength(max);
        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        expect(docList.sort()).toStrictEqual([
            'A_ComputerName',
            'A_Cursor',
            'A_DD',
            'A_DDD',
            'A_DDDD',
            'A_IconNumber',
            'A_IconTip',
            'A_InitialWorkingDir',
            'A_IPAddress1',
            'A_IPAddress2',
            'A_IPAddress3',
            'A_IPAddress4',
            'A_LoopField',
            'A_LoopReadLine',
            'A_MDay',
            'A_Min',
            'A_MM',
            'A_MMM',
            'A_MMMM',
            'A_Mon',
            'A_OSType',
            'A_PriorHotkey',
            'A_ScriptDir',
            'A_Sec',
            'A_ThisMenu',
            'A_ThisMenuItemPos',
            'A_TimeSincePriorHotkey',
            'A_TimeSinceThisHotkey',
            'A_UserName',
            'A_WDay',
            'A_YDay',
        ].sort());
    });
});
