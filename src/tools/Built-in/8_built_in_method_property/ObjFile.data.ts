import type { TBiObj } from './ObjBase.data';

// File := FileOpen()
export const ObjFile: readonly TBiObj[] = [
    {
        keyRawName: 'Read()',
        insert: 'Read(...Characters)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#Read',
        doc: [
            'Reads a string of characters from the file and advances the file pointer.',
            '*Characters*:The maximum number of characters to read. If omitted, the rest of the file is read and returned as one string. If the File object was created from a handle to a non-seeking device such as a console buffer or pipe, omitting this parameter may cause the method to fail or return only what data is currently available.',
        ],
    },
    {
        keyRawName: 'Write()',
        insert: 'Write()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#Write',
        doc: [
            'Writes a string of characters to the file and advances the file pointer.',
            '*String*: A string to write.',
            '*Returns* the number of bytes (not characters) that were written.',
        ],
    },
    {
        keyRawName: 'ReadLine()',
        insert: 'ReadLine()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#ReadLine',
        doc: [
            'Reads a line of text from the file and advances the file pointer.',
            '*Returns a line of text.* This may include `n, `r`n or `r depending on the file and EOL flags used to open the file.',
            'Lines up to 65,534 characters long can be read. If the length of a line exceeds this, the remainder of the line is returned by subsequent calls to this method.',
        ],
    },
    {
        keyRawName: 'WriteLine()',
        insert: 'WriteLine(...String)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#WriteLine',
        doc: [
            'Writes a string of characters followed by `n or `r`n depending on the flags used to open the file. Advances the file pointer.',
            '*String*: An optional string to write.',
            '*Returns* the number of bytes (not characters) that were written.',
        ],
    },
    {
        keyRawName: 'RawRead()',
        insert: 'RawRead(VarOrAddress, Bytes)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#RawRead',
        doc: [
            '*VarOrAddress*:A variable or memory address to which the data will be copied. Usage is similar to NumGet(). If a variable is specified, it is expanded automatically when necessary.',
            '*Bytes*:The maximum number of bytes to read.',
            '*Returns* the number of bytes that were read.',
            'If a Try statement is active and Bytes is non-zero but no bytes were read, an exception is thrown. AtEOF can be used to avoid this, if needed.',
        ],
    },
    {
        keyRawName: 'RawWrite()',
        insert: 'RawWrite(VarOrAddress, Bytes)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#RawWrite',
        doc: [
            '*VarOrAddress*: A variable containing the data or the address of the data in memory. Usage is similar to ```NumPut().```',
            '*Bytes*: The number of bytes to write.',
            '*Returns* the number of bytes that were written.',
        ],
    },
    {
        keyRawName: 'Seek()',
        insert: 'Seek(Distance , ...Origin := 0)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#Seek',
        doc: [
            'Moves the file pointer.',
            '*Distance*:Distance to move, in bytes. Lower values are closer to the beginning of the file.',
            '*Origin*:Starting point for the file pointer move. Must be one of the following:',
            '> * 0 (SEEK_SET): Beginning of the file. Distance must be zero or greater.',
            '> * 1 (SEEK_CUR): Current position of the file pointer.',
            '> * 2 (SEEK_END): End of the file. Distance should usually be negative.',
            '> If omitted, Origin defaults to SEEK_END when Distance is negative and SEEK_SET otherwise.',
            '*Returns* a non-zero value if successful, otherwise zero.',
        ],
    },
    {
        keyRawName: 'Tell()',
        insert: 'Tell()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#Tell',
        doc: [
            'Returns the current position of the file pointer, where 0 is the beginning of the file.',
        ],
    },
    {
        keyRawName: 'Close()',
        insert: 'Close()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#Close',
        doc: [
            'Closes the file, flushes any data in the cache to disk and releases the share locks.',
            'Although the file is closed automatically when the object is freed, it is recommended to close the file as soon as possible.',
        ],
    },

    // ------------
    {
        keyRawName: 'Position',
        insert: 'Position',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#Pos',
        doc: [
            'Retrieves or sets the position of the file pointer. Equivalent to ```Pos := File.Tell()``` or ```File.Seek(Distance)```.',
        ],
    },
    {
        keyRawName: 'Pos',
        insert: 'Pos',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#Pos',
        doc: [
            'Retrieves or sets the position of the file pointer. Equivalent to ```Pos := File.Tell()``` or ```File.Seek(Distance)```.',
        ],
    },
    {
        keyRawName: 'Length',
        insert: 'Length',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#Length',
        doc: [
            'Retrieves or sets the size of the file.',
            '> FileSize := File.Length',
            '> File.Length := NewSize',
            '*FileSize* and *NewSize* is the size of the file, in bytes.',
            'This property should be used only with an actual file. If the File object was created from a handle to a pipe, it may return the amount of data currently available in the pipe\'s internal buffer, but this behaviour is not guaranteed.',
        ],
    },
    {
        keyRawName: 'AtEOF',
        insert: 'AtEOF',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#AtEOF',
        doc: [
            'Retrieves a non-zero value if the file pointer has reached the end of the file, otherwise zero.',
            '> IsAtEOF := File.AtEOF',
            'This property should be used only with an actual file. If the File object was created from a handle to a non-seeking device such as a console buffer or pipe, the returned value may not be meaningful, as such devices do not logically have an "end of file".',
        ],
    },
    {
        keyRawName: 'Encoding',
        insert: 'Encoding',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#Encoding',
        doc: [
            'Retrieves or sets the text encoding used by this file object.',
            '> RetrievedEncoding := File.Encoding',
            '> File.Encoding := NewEncoding',
            'RetrievedEncoding and NewEncoding is a numeric code page identifier (see [MSDN](https://docs.microsoft.com/zh-tw/windows/win32/intl/code-page-identifiers?redirectedfrom=MSDN)) or one of the following strings:',
            '* UTF-8: Unicode UTF-8, equivalent to CP65001.',
            '* UTF-16: Unicode UTF-16 with little endian byte order, equivalent to CP1200.',
            '* CPnnn: a code page with numeric identifier nnn.',
            'RetrievedEncoding is never a value with the ```-RAW``` suffix, regardless of how the file was opened or whether it contains a byte order mark (BOM). Setting NewEncoding never causes a BOM to be added or removed, as the BOM is normally written to the file when it is first created.',
            '*[v1.1.15.04+]*: Setting NewEncoding to UTF-8-RAW or UTF-16-RAW is valid, but the -RAW suffix is ignored. In earlier versions, UTF-8-RAW and UTF-16-RAW behaved like an invalid 8-bit encoding, causing all non-ASCII characters to be discarded. This only applies to File.Encoding, not ```FileOpen()```.',
        ],
    },
    {
        keyRawName: 'Handle',
        insert: 'Handle',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#Handle',
        doc: [
            'Alias of [__Handle](https://www.autohotkey.com/docs/v1/lib/File.htm#__Handle).',
            '*Returns* a system file ```handle```, intended for use with ```DllCall()```. See [CreateFile](https://docs.microsoft.com/zh-tw/windows/win32/api/fileapi/nf-fileapi-createfilea?redirectedfrom=MSDN).',
            '> File.__Handle',
            'File objects internally buffer reads or writes. If data has been written into the object\'s internal buffer, it is committed to disk before the handle is returned. If the buffer contains data read from file, it is discarded and the actual file pointer is reset to the logical position indicated by ```File.Pos```.',
        ],
    },
    {
        keyRawName: '__Handle',
        insert: '__Handle',
        uri: 'https://www.autohotkey.com/docs/v1/lib/File.htm#Handle',
        doc: [
            '*Returns* a system file ```handle```, intended for use with ```DllCall()```. See [CreateFile](https://docs.microsoft.com/zh-tw/windows/win32/api/fileapi/nf-fileapi-createfilea?redirectedfrom=MSDN).',
            '> File.__Handle',
            'File objects internally buffer reads or writes. If data has been written into the object\'s internal buffer, it is committed to disk before the handle is returned. If the buffer contains data read from file, it is discarded and the actual file pointer is reset to the logical position indicated by ```File.Pos```.',
        ],
    },
];

// TODO
// for (
//     const v of [
//         'ReadUInt()',
//         'ReadInt()',
//         'ReadInt64()',
//         'ReadShort()',
//         'ReadUShort()',
//         'ReadChar()',
//         'ReadUChar()',
//         'ReadDouble()',
//         'ReadFloat()',
//     ]
// ) {

// for (
//     const v of [
//         'WriteUInt(Num)',
//         'WriteInt(Num)',
//         'WriteInt64(Num)',
//         'WriteShort(Num)',
//         'WriteUShort(Num)',
//         'WriteChar(Num)',
//         'WriteUChar(Num)',
//         'WriteDouble(Num)',
//         'WriteFloat(Num)',
//     ]
// ) {}
