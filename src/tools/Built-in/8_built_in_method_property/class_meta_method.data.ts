export type TClass_meta_method = Readonly<{
    keyRawName: `__${string}()`,
    //
    insert: string,
    doc: readonly string[],
    uri: `https://www.autohotkey.com/docs/v1/Objects.htm#${string}`,
}>;

const doc: readonly string[] = [
    '```ahk',
    'class ClassName {',
    '    ; new / delete',
    '    __New([Key, Key2, ...])',
    '    __Delete()',
    '',
    '    ; meta-Functions',
    '    __Get([Key, Key2, ...])',
    '    __Set([Key, Key2, ...], Value)',
    '    __Call(Name [, Params...])',
    '}',
    '```',
];

export const class_meta_method: readonly TClass_meta_method[] = [
    {
        keyRawName: '__New()',
        insert: '__New($0){\n}',
        doc,
        uri: 'https://www.autohotkey.com/docs/v1/Objects.htm#Custom_NewDelete',
    },
    {
        keyRawName: '__Delete()',
        insert: '__Delete($0){\n}',
        doc,
        uri: 'https://www.autohotkey.com/docs/v1/Objects.htm#Custom_NewDelete',
    },
    {
        keyRawName: '__Get()',
        insert: '__Get($0){\n}',
        doc,
        uri: 'https://www.autohotkey.com/docs/v1/Objects.htm#Meta_Functions',
    },
    {
        keyRawName: '__Set()',
        insert: '__Set($0){\n}',
        doc,
        uri: 'https://www.autohotkey.com/docs/v1/Objects.htm#Meta_Functions',
    },
    {
        keyRawName: '__Call()',
        insert: '__Call($0){\n}',
        doc,
        uri: 'https://www.autohotkey.com/docs/v1/Objects.htm#Meta_Functions',
    },
];
