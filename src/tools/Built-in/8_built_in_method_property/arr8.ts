/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint no-magic-numbers: ["error", { "ignore": [8] }] */

import type { TIndexData } from '../data_index.data';

// OK
const arr8_file: TIndexData[] = [
    ['__Handle property (File)', 'lib/File.htm#__Handle', 8],
    ['AtEOF property (File)', 'lib/File.htm#AtEOF', 8],
    ['Encoding property (File)', 'lib/File.htm#Encoding', 8],
    ['Handle property (File)', 'lib/File.htm#Handle', 8],
    ['Length property (File)', 'lib/File.htm#Length', 8],
    ['Pos property (File)', 'lib/File.htm#Seek', 8],

    //
    ['Read method (File)', 'lib/File.htm#Read', 8],
    ['Write method (File)', 'lib/File.htm#Write', 8],
    ['ReadLine method (File)', 'lib/File.htm#ReadLine', 8],
    ['WriteLine method (File)', 'lib/File.htm#WriteLine', 8],
    ['RawRead method (File)', 'lib/File.htm#RawRead', 8],
    ['RawWrite method (File)', 'lib/File.htm#RawWrite', 8],
    ['Seek method (File)', 'lib/File.htm#Seek', 8],
    ['Tell method (File)', 'lib/File.htm#Tell', 8],
    ['Close method (File)', 'lib/File.htm#Close', 8],

    //
    ['ReadNumType method (File)', 'lib/File.htm#ReadNum', 8],
    ['WriteNumType method (File)', 'lib/File.htm#WriteNum', 8],
];

const arr8_InputHook: TIndexData[] = [
    [
        'BackspaceIsUndo property (InputHook)',
        'lib/InputHook.htm#BackspaceIsUndo',
        8,
    ],
    [
        'CaseSensitive property (InputHook)',
        'lib/InputHook.htm#CaseSensitive',
        8,
    ],
    ['EndKey property (InputHook)', 'lib/InputHook.htm#EndKey', 8],
    ['EndMods property (InputHook)', 'lib/InputHook.htm#EndMods', 8],
    [
        'EndReason property (InputHook)',
        'lib/InputHook.htm#EndReason',
        8,
    ],
    [
        'FindAnywhere property (InputHook)',
        'lib/InputHook.htm#FindAnywhere',
        8,
    ],
    [
        'InProgress property (InputHook)',
        'lib/InputHook.htm#InProgress',
        8,
    ],
    ['Input property (InputHook)', 'lib/InputHook.htm#Input', 8],
    ['KeyOpt method (InputHook)', 'lib/InputHook.htm#KeyOpt', 8],
    ['Match property (InputHook)', 'lib/InputHook.htm#Match', 8],
    [
        'MinSendLevel property (InputHook)',
        'lib/InputHook.htm#MinSendLevel',
        8,
    ],
    [
        'NotifyNonText property (InputHook)',
        'lib/InputHook.htm#NotifyNonText',
        8,
    ],
    ['OnChar property (InputHook)', 'lib/InputHook.htm#OnChar', 8],
    ['OnEnd property (InputHook)', 'lib/InputHook.htm#OnEnd', 8],
    [
        'OnKeyDown property (InputHook)',
        'lib/InputHook.htm#OnKeyDown',
        8,
    ],
    ['OnKeyUp property (InputHook)', 'lib/InputHook.htm#OnKeyUp', 8],
    ['Start method (InputHook)', 'lib/InputHook.htm#Start', 8],
    ['Stop method (InputHook)', 'lib/InputHook.htm#Stop', 8],
    ['Timeout property (InputHook)', 'lib/InputHook.htm#Timeout', 8],
    [
        'VisibleNonText property (InputHook)',
        'lib/InputHook.htm#VisibleNonText',
        8,
    ],
    [
        'VisibleText property (InputHook)',
        'lib/InputHook.htm#VisibleText',
        8,
    ],
    ['Wait method (InputHook)', 'lib/InputHook.htm#Wait', 8],
];

const arr8_Object: TIndexData[] = [
    ['Base property (Object)', 'lib/Object.htm#Base', 8],
    //
    ['_NewEnum method (Object)', 'lib/Object.htm#NewEnum', 8],
    ['Clone method (Object)', 'lib/Object.htm#Clone', 8],
    ['Count method (Object)', 'lib/Object.htm#Count', 8],
    ['Delete method (Object)', 'lib/Object.htm#Delete', 8],
    ['GetAddress method (Object)', 'lib/Object.htm#GetAddress', 8],
    ['GetCapacity method (Object)', 'lib/Object.htm#GetCapacity', 8],
    ['HasKey method (Object)', 'lib/Object.htm#HasKey', 8],
    ['Insert method (Object)', 'lib/Object.htm#Insert', 8],
    ['InsertAt method (Object)', 'lib/Object.htm#InsertAt', 8],
    ['Length method (Object)', 'lib/Object.htm#Length', 8],
    ['MaxIndex method (Object)', 'lib/Object.htm#MinMaxIndex', 8],
    ['MinIndex method (Object)', 'lib/Object.htm#MinMaxIndex', 8],
    ['Pop method (Object)', 'lib/Object.htm#Pop', 8],
    ['Push method (Object)', 'lib/Object.htm#Push', 8],
    ['Remove method (Object)', 'lib/Object.htm#Remove', 8],
    ['RemoveAt method (Object)', 'lib/Object.htm#RemoveAt', 8],
    ['SetCapacity method (Object)', 'lib/Object.htm#SetCapacity', 8],
];

// OK
const arr8_Func: TIndexData[] = [
    // method
    ['Bind method (Func)', 'lib/Func.htm#Bind', 8],
    ['Call method (Func)', 'lib/Func.htm#Call', 8],
    ['IsByRef method (Func)', 'lib/Func.htm#IsByRef', 8],
    ['IsOptional method (Func)', 'lib/Func.htm#IsOptional', 8],

    // property
    ['Name property (Func)', 'lib/Func.htm#Name', 8],
    ['IsBuiltIn property (Func)', 'lib/Func.htm#IsBuiltIn', 8],
    ['IsVariadic property (Func)', 'lib/Func.htm#IsVariadic', 8],
    ['MinParams property (Func)', 'lib/Func.htm#MinParams', 8],
    ['MaxParams property (Func)', 'lib/Func.htm#MaxParams', 8],
];

// TODO i don't know how to support it
const arr8_Math: TIndexData[] = [
    [
        'Count method/property (Match)',
        'lib/RegExMatch.htm#MatchObject',
        8,
    ],
    [
        'Len method/property (Match)',
        'lib/RegExMatch.htm#MatchObject',
        8,
    ],
    [
        'Mark method/property (Match)',
        'lib/RegExMatch.htm#MatchObject',
        8,
    ],
    [
        'Name method/property (Match)',
        'lib/RegExMatch.htm#MatchObject',
        8,
    ],
    [
        'Pos method/property (Match)',
        'lib/RegExMatch.htm#MatchObject',
        8,
    ],
    [
        'Value method/property (Match)',
        'lib/RegExMatch.htm#MatchObject',
        8,
    ],
];

// OK
const arr8_Exception: TIndexData[] = [
    ['Extra property (Exception)', 'lib/Throw.htm#Exception', 8],
    ['File property (Exception)', 'lib/Throw.htm#Exception', 8],
    ['Line property (Exception)', 'lib/Throw.htm#Exception', 8],
    ['Message property (Exception)', 'lib/Throw.htm#Exception', 8],
    ['What property (Exception)', 'lib/Throw.htm#Exception', 8],
];

// lazy to support
const arr8_Enumerator: TIndexData[] = [
    ['Next method (Enumerator)', 'lib/Enumerator.htm#Next', 8],
];
