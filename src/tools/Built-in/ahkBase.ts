/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-lines */
import * as vscode from 'vscode';
import type { TAhkBaseObj } from './ahkBase_tools';

type TDescription = Readonly<{
    label: string,
    documentation: string[],
}>;

const ItemOfAhkObj: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    // Obj := Object(...
    // Obj := {}
    // Methods:
    //      InsertAt / RemoveAt
    //      Push / Pop
    //      Delete
    //      MinIndex / MaxIndex / Length / Count
    //      SetCapacity / GetCapacity
    //      GetAddress
    //      _NewEnum
    //      HasKey
    //      Clone

    // Properties:
    //      Base
    const BaseObj: readonly TDescription[] = [
        {
            label: 'InsertAt(Pos, Value1, ...ValueN)',
            documentation: [
                'Inserts one or more values at a given position within a linear array.',
                '*Pos* : The position to insert Value1 at. Subsequent values are inserted at Pos+1, Pos+2, etc.',
                '*Value1 ...*: One or more values to insert. To insert an array of values, pass theArray* as the last parameter.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#InsertAt',
            ],
        },
        {
            label: 'RemoveAt(Pos, ...Length)',
            documentation: [
                'Removes items from the given position in a linear array.',
                '*Pos* : The position of the value or values to remove.',
                '*Length*: The length of the range of values to remove. Items from Pos to Pos+Length-1 are removed. If omitted, one item is removed.',

                '*Return Value*: If Length is omitted, the value removed from Pos is returned (blank if none). Otherwise the return value is the number of removed items which had values, which can differ from Length in a sparse array, but is always between 0 and Length (inclusive).',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#RemoveAt',
            ],
        },
        {
            label: 'Push(Value, ...Value2,)',
            documentation: [
                'Appends values to the end of an array.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#Push',
            ],
        },
        {
            label: 'Pop()',
            documentation: [
                'Removes and returns the last array element.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#Pop',
            ],
        },
        {
            label: 'Delete(Key)',
            documentation: [
                'Removes key-value pairs from an object.',
                '*Key*: Any single key.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#Delete',
            ],
        },
        {
            label: 'Delete(FirstKey, LastKey)',
            documentation: [
                'Removes key-value pairs from an object.',
                '*FirstKey*, *LastKey* : Any valid range of integer or string keys, where FirstKey <= LastKey. Both keys must be the same type.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#Delete',
            ],
        },
        {
            label: 'MinIndex()',
            documentation: [
                'If any integer keys are present, MinIndex returns the lowest and MaxIndex returns the highest. Otherwise an empty string is returned.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#MinMaxIndex',
            ],
        },
        {
            label: 'MaxIndex()',
            documentation: [
                'If any integer keys are present, MinIndex returns the lowest and MaxIndex returns the highest. Otherwise an empty string is returned.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#MinMaxIndex',
            ],
        },
        {
            label: 'Length()',
            documentation: [
                '*Returns* the length of a linear array beginning at position 1; that is, the highest positive integer key contained by the object, or 0 if there aren\'t any.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#Length',
            ],
        },
        {
            label: 'Count()',
            documentation: [
                '*Returns* the number of key-value pairs present in the object.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#Count',
            ],
        },
        {
            label: 'SetCapacity(MaxItems)',
            documentation: [
                'Adjusts the capacity of an object or one of its fields.',
                '*MaxItems*: The maximum number of key-value pairs the object should be able to contain before it must be automatically expanded. If less than the current number of key-value pairs, that number is used instead, and any unused space is freed.',
                '*Returns*: The new capacity if successful, otherwise an empty string.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#SetCapacity',
            ],
        },
        {
            label: 'SetCapacity(Key, ByteSize)',
            documentation: [
                'Adjusts the capacity of an object or one of its fields.',
                '*Key*: Any valid key.',
                '*ByteSize*: The new size in bytes of the field\'s string buffer, excluding the null-terminator. If the field does not exist, it is created. If ByteSize is zero, the buffer is freed but the empty field is not removed. If ByteSize is less than the current size, excess data is truncated; otherwise all existing data is preserved.',
                '*Returns*: The new capacity if successful, otherwise an empty string.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#SetCapacity',
            ],
        },
        {
            label: 'GetCapacity(...Key)',
            documentation: [
                '*Returns* the current capacity of an object or one of its fields.',
                '*Returns* an empty string if the field does not exist or does not contain a string.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#GetCapacity',
            ],
        },
        {
            label: 'GetAddress(Key)',
            documentation: [
                '*Returns* the current address of the field\'s string buffer, if it has one.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#GetAddress',
            ],
        },
        {
            label: '_NewEnum()',
            documentation: [
                '*Returns* a new enumerator to enumerate this object\'s key-value pairs. This method is usually not called directly, but by the for-loop.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#NewEnum',
            ],
        },
        {
            label: 'HasKey(Key)',
            documentation: [
                '*Returns* true if Key is associated with a value (even "") within Object, otherwise false.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#HasKey',
            ],
        },
        {
            label: 'Clone()',
            documentation: [
                '*Returns* a shallow copy of the object.',
                'https://www.autohotkey.com/docs/v1/objects/Object.htm#Clone',
            ],
        },
    ];
    const itemS: vscode.CompletionItem[] = [];
    for (const { label, documentation } of BaseObj) {
        const item = new vscode.CompletionItem({
            label,
            description: 'BaseObj',
        }, vscode.CompletionItemKind.Method);
        item.detail = 'neko help : AhkObj Methods';
        item.documentation = new vscode.MarkdownString(documentation.join('\n\n'), true);
        itemS.push(item);
    }

    const BaseItem = new vscode.CompletionItem({
        label: 'Base',
        description: 'BaseObj',
    }, vscode.CompletionItemKind.Property);
    BaseItem.detail = 'neko help : AhkObj  Property';
    BaseItem.documentation = new vscode.MarkdownString(
        [
            '*Returns* a shallow copy of the object.',
            '> BaseObject := Object.Base',
            '> Object.Base := BaseObject',
            'BaseObject must be an object or an empty string.',

            'Properties and methods defined by a base object are accessible only while that base object is in use. Therefore, changing Object\'s base also changes the set of available properties and methods.',
            'https://www.autohotkey.com/docs/v1/objects/Object.htm#Base',
        ].join('\n\n'),
        true,
    );
    itemS.push(BaseItem);
    return itemS;
})();

const ItemOfFileOpen: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    // File := FileOpen()
    const itemS: vscode.CompletionItem[] = [];
    const ahkFileOpenMethod: readonly TDescription[] = [
        {
            label: 'Read(...Characters)',
            documentation: [
                'Reads a string of characters from the file and advances the file pointer.',
                '*Characters*:The maximum number of characters to read. If omitted, the rest of the file is read and returned as one string. If the File object was created from a handle to a non-seeking device such as a console buffer or pipe, omitting this parameter may cause the method to fail or return only what data is currently available.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#Read',
            ],
        },
        {
            label: 'Write(String)',
            documentation: [
                'Writes a string of characters to the file and advances the file pointer.',
                '*String*: A string to write.',
                '*Returns* the number of bytes (not characters) that were written.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#Write',
            ],
        },
        {
            label: 'ReadLine()',
            documentation: [
                'Reads a line of text from the file and advances the file pointer.',
                '*Returns a line of text.* This may include `n, `r`n or `r depending on the file and EOL flags used to open the file.',
                'Lines up to 65,534 characters long can be read. If the length of a line exceeds this, the remainder of the line is returned by subsequent calls to this method.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#ReadLine',
            ],
        },
        {
            label: 'WriteLine(...String)',
            documentation: [
                'Writes a string of characters followed by `n or `r`n depending on the flags used to open the file. Advances the file pointer.',
                '*String*: An optional string to write.',
                '*Returns* the number of bytes (not characters) that were written.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#WriteLine',
            ],
        },
        {
            label: 'RawRead(VarOrAddress, Bytes)',
            documentation: [
                '*VarOrAddress*:A variable or memory address to which the data will be copied. Usage is similar to NumGet(). If a variable is specified, it is expanded automatically when necessary.',
                '*Bytes*:The maximum number of bytes to read.',
                '*Returns* the number of bytes that were read.',
                'If a Try statement is active and Bytes is non-zero but no bytes were read, an exception is thrown. AtEOF can be used to avoid this, if needed.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#RawRead',
            ],
        },
        {
            label: 'RawWrite(VarOrAddress, Bytes)',
            documentation: [
                '*VarOrAddress*: A variable containing the data or the address of the data in memory. Usage is similar to ```NumPut().```',
                '*Bytes*: The number of bytes to write.',
                '*Returns* the number of bytes that were written.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#RawWrite',
            ],
        },
        {
            label: 'Seek(Distance , ...Origin := 0)',
            documentation: [
                'Moves the file pointer.',
                '*Distance*:Distance to move, in bytes. Lower values are closer to the beginning of the file.',
                '*Origin*:Starting point for the file pointer move. Must be one of the following:',
                '> * 0 (SEEK_SET): Beginning of the file. Distance must be zero or greater.',
                '> * 1 (SEEK_CUR): Current position of the file pointer.',
                '> * 2 (SEEK_END): End of the file. Distance should usually be negative.',
                '> If omitted, Origin defaults to SEEK_END when Distance is negative and SEEK_SET otherwise.',
                '*Returns* a non-zero value if successful, otherwise zero.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#Seek',
            ],
        },
        {
            label: 'Tell()',
            documentation: [
                'Returns the current position of the file pointer, where 0 is the beginning of the file.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#Tell',
            ],
        },
        {
            label: 'Close()',
            documentation: [
                'Closes the file, flushes any data in the cache to disk and releases the share locks.',
                'Although the file is closed automatically when the object is freed, it is recommended to close the file as soon as possible.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#Close',
            ],
        },
    ];
    for (const { label, documentation } of ahkFileOpenMethod) {
        const item = new vscode.CompletionItem({
            label, // Left
            description: 'File := FileOpen()', // Right
        }, vscode.CompletionItemKind.Method);
        item.detail = 'neko help : FileOpen() Method';
        item.documentation = new vscode.MarkdownString(documentation.join('\n\n'), true);
        itemS.push(item);
    }

    const ahkFileOpenProperties: readonly TDescription[] = [
        {
            label: 'Position ',
            documentation: [
                'Retrieves or sets the position of the file pointer. Equivalent to ```Pos := File.Tell()``` or ```File.Seek(Distance)```.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#Members',
            ],
        },
        {
            label: 'Pos ',
            documentation: [
                'Retrieves or sets the position of the file pointer. Equivalent to ```Pos := File.Tell()``` or ```File.Seek(Distance)```.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#Members',
            ],
        },
        {
            label: 'Length ',
            documentation: [
                'Retrieves or sets the size of the file.',
                '> FileSize := File.Length',
                '> File.Length := NewSize',
                '*FileSize* and *NewSize* is the size of the file, in bytes.',
                'This property should be used only with an actual file. If the File object was created from a handle to a pipe, it may return the amount of data currently available in the pipe\'s internal buffer, but this behaviour is not guaranteed.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#Length',
            ],
        },
        {
            label: 'AtEOF ',
            documentation: [
                'Retrieves a non-zero value if the file pointer has reached the end of the file, otherwise zero.',
                '> IsAtEOF := File.AtEOF',
                'This property should be used only with an actual file. If the File object was created from a handle to a non-seeking device such as a console buffer or pipe, the returned value may not be meaningful, as such devices do not logically have an "end of file".',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#AtEOF',
            ],
        },
        {
            label: 'Encoding ',
            documentation: [
                'Retrieves or sets the text encoding used by this file object.',
                '> RetrievedEncoding := File.Encoding',
                '> File.Encoding := NewEncoding',
                'RetrievedEncoding and NewEncoding is a numeric code page identifier (see [MSDN](https://docs.microsoft.com/zh-tw/windows/win32/intl/code-page-identifiers?redirectedfrom=MSDN)) or one of the following strings:',
                '* UTF-8: Unicode UTF-8, equivalent to CP65001.',
                '* UTF-16: Unicode UTF-16 with little endian byte order, equivalent to CP1200.',
                '* CPnnn: a code page with numeric identifier nnn.',
                'RetrievedEncoding is never a value with the ```-RAW``` suffix, regardless of how the file was opened or whether it contains a byte order mark (BOM). Setting NewEncoding never causes a BOM to be added or removed, as the BOM is normally written to the file when it is first created.',
                '*[v1.1.15.04+]*: Setting NewEncoding to UTF-8-RAW or UTF-16-RAW is valid, but the -RAW suffix is ignored. In earlier versions, UTF-8-RAW and UTF-16-RAW behaved like an invalid 8-bit encoding, causing all non-ASCII characters to be discarded. This only applies to File.Encoding, not ```FileOpen()```.',
                'https://www.autohotkey.com/docs/v1/objects/File.htm#Encoding',
            ],
        },
        {
            label: 'Handle ',
            documentation: [
                'Alias of [__Handle](https://www.autohotkey.com/docs/v1/objects/File.htm#__Handle).',
                '*Returns* a system file ```handle```, intended for use with ```DllCall()```. See [CreateFile](https://docs.microsoft.com/zh-tw/windows/win32/api/fileapi/nf-fileapi-createfilea?redirectedfrom=MSDN).',
                '> File.__Handle',
                'File objects internally buffer reads or writes. If data has been written into the object\'s internal buffer, it is committed to disk before the handle is returned. If the buffer contains data read from file, it is discarded and the actual file pointer is reset to the logical position indicated by ```File.Pos```.',
            ],
        },
        {
            label: '__Handle ',
            documentation: [
                '*Returns* a system file ```handle```, intended for use with ```DllCall()```. See [CreateFile](https://docs.microsoft.com/zh-tw/windows/win32/api/fileapi/nf-fileapi-createfilea?redirectedfrom=MSDN).',
                '> File.__Handle',
                'File objects internally buffer reads or writes. If data has been written into the object\'s internal buffer, it is committed to disk before the handle is returned. If the buffer contains data read from file, it is discarded and the actual file pointer is reset to the logical position indicated by ```File.Pos```.',
            ],
        },
    ];
    for (const { label, documentation } of ahkFileOpenProperties) {
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label,
            description: 'File := FileOpen()',
        }, vscode.CompletionItemKind.Property);
        item.detail = 'neko help : FileOpen() -> Properties';
        item.documentation = new vscode.MarkdownString(documentation.join('\n\n'), true);
        itemS.push(item);
    }

    for (
        const v of [
            'ReadUInt()',
            'ReadInt()',
            'ReadInt64()',
            'ReadShort()',
            'ReadUShort()',
            'ReadChar()',
            'ReadUChar()',
            'ReadDouble()',
            'ReadFloat()',
        ]
    ) {
        const documentation: string[] = [
            'Reads a number from the file and advances the file pointer.',
            '```NumType``` is either UInt, Int, Int64, Short, UShort, Char, UChar, Double, or Float. These type names have the same meanings as with ```DllCall()```.',
            '*Returns* a number if successful, otherwise an empty string.',
            'If a Try statement is active and no bytes were read, an exception is thrown. However, no exception is thrown if at least one byte was read, even if the size of the given NumType is greater than the number of bytes read. Instead, the missing bytes are assumed to be zero.',
            'https://www.autohotkey.com/docs/v1/objects/File.htm#ReadNum',
        ];
        const item = new vscode.CompletionItem({
            label: v,
            description: 'File := FileOpen()',
        }, vscode.CompletionItemKind.Method);
        item.detail = 'neko help : FileOpen() -> ReadNumType';
        item.documentation = new vscode.MarkdownString(documentation.join('\n\n'), true);
        itemS.push(item);
    }

    for (
        const v of [
            'WriteUInt(Num)',
            'WriteInt(Num)',
            'WriteInt64(Num)',
            'WriteShort(Num)',
            'WriteUShort(Num)',
            'WriteChar(Num)',
            'WriteUChar(Num)',
            'WriteDouble(Num)',
            'WriteFloat(Num)',
        ]
    ) {
        const documentation: string[] = [
            'Writes a number to the file and advances the file pointer.',
            '```Num```:A number to write.',
            '```NumType``` is either UInt, Int, Int64, Short, UShort, Char, UChar, Double, or Float. These type names have the same meanings as with ```DllCall()```.',
            '*Returns* the number of bytes that were written. For instance, WriteUInt returns 4 if successful.',
            'https://www.autohotkey.com/docs/v1/objects/File.htm#WriteNum',
        ];
        const item = new vscode.CompletionItem({
            label: v,
            description: 'File := FileOpen()',
        }, vscode.CompletionItemKind.Method);
        item.detail = 'neko help : FileOpen() -> WriteNumType';
        item.documentation = new vscode.MarkdownString(documentation.join('\n\n'), true);
        itemS.push(item);
    }
    return itemS;
})();

const ItemOfFunc: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    // FIXME add doc of https://www.autohotkey.com/docs/v1/lib/FuncObj.htm
    const itemS: vscode.CompletionItem[] = [];
    for (
        const v of [
            'Name',
            'IsBuiltIn',
            'IsVariadic',
            'MinParams',
            'MaxParams',
            '__Handle',
        ]
    ) {
        const item = new vscode.CompletionItem({
            label: v,
            description: 'fn := Func()',
        }, vscode.CompletionItemKind.Property);
        item.detail = 'neko help : Func() Property';
        itemS.push(item);
    }
    for (
        const v of [
            'Call(',
            'Bind(',
            'IsByRef(',
            'IsOptional(',
        ]
    ) {
        const item = new vscode.CompletionItem({
            label: `${v})`,
            description: 'fn := Func()',
        }, vscode.CompletionItemKind.Method);
        item.detail = 'neko help : Func() Methods';
        item.insertText = new vscode.SnippetString(v)
            .appendTabstop()
            .appendText(')'); // SnippetString;
        itemS.push(item);
    }
    return itemS;
})();

const ItemOfAhkCatch: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    // IObject *Line::CreateRuntimeException(LPCTSTR aErrorText, LPCTSTR aWhat, LPCTSTR aExtraInfo)
    // ResultType Line::ThrowRuntimeException(LPCTSTR aErrorText, LPCTSTR aWhat, LPCTSTR aExtraInfo)

    const ahkCatchProperties: readonly TDescription[] = [
        {
            label: 'Message',
            documentation: [
                'An error message or [ErrorLevel](https://www.autohotkey.com/docs/v1/misc/ErrorLevel.htm) value.',
            ],
        },
        {
            label: 'What',
            documentation: [
                'The name of the command, function or label which was executing or about to execute when the error occurred.',
            ],
        },
        {
            label: 'Extra',
            documentation: [
                'Additional information about the error, if available.',
            ],
        },
        {
            label: 'File',
            documentation: [
                'Set automatically to the full path of the script file which contains the line at which the error occurred.',
            ],
        },
        {
            label: 'Line',
            documentation: [
                'Set automatically to the line number at which the error occurred.',
            ],
        },
    ];

    const itemS: vscode.CompletionItem[] = [];
    for (const { label, documentation } of ahkCatchProperties) {
        const md = new vscode.MarkdownString(documentation.join('\n\n'), true)
            .appendMarkdown('\n[(read doc)](https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception)')
            .appendCodeblock([
                'Key1 := "F11"',
                'Try, Hotkey, %Key1%, label1',
                '',
                'Catch err {',
                '    MsgBox, % "Extra : " err.Extra ;Extra : label1',
                '    MsgBox, % "File : " err.File ; C:\\XXXX\\exp.ahk',
                '    MsgBox, % "Line : " err.Line ; 10',
                '    MsgBox, % "Message : " err.Message ;Target label does not exist.',
                '    MsgBox, % "What : " err.What ;Hotkey',
                '}',
            ].join('\n'));
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label,
            description: 'catch err',
        }, vscode.CompletionItemKind.Property);
        item.detail = 'neko help: error -> Exception()';
        item.documentation = md;
        itemS.push(item);
    }

    return itemS;
})();

export function ahkBaseWrap(Obj: TAhkBaseObj): vscode.CompletionItem[] {
    const itemS: vscode.CompletionItem[] = [];
    // if (Obj.ahkArray) itemS.push(...ItemOfAhkArray);
    if (Obj.ahkFileOpen) itemS.push(...ItemOfFileOpen);
    if (Obj.ahkFuncObject) itemS.push(...ItemOfFunc);
    if (Obj.ahkBase) itemS.push(...ItemOfAhkObj);
    if (Obj.ahkCatch) itemS.push(...ItemOfAhkCatch);
    return itemS;
}
