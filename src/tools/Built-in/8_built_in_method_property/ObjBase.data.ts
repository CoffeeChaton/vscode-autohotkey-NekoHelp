export type TBiObj = Readonly<{
    keyRawName: string,
    insert: string,
    doc: readonly string[],
    uri: `https://www.autohotkey.com/docs/v1/lib/${string}`,
}>;

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
//      Insert (deprecated)
//      Remove(deprecated)

// Properties:
//      Base
export const ObjBase: readonly TBiObj[] = [
    {
        keyRawName: 'InsertAt()',
        insert: 'InsertAt(Pos, Value1, ...ValueN)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#InsertAt',
        doc: [
            'Inserts one or more values at a given position within a linear array.',
            '*Pos* : The position to insert Value1 at. Subsequent values are inserted at Pos+1, Pos+2, etc.',
            '*Value1 ...*: One or more values to insert. To insert an array of values, pass theArray* as the last parameter.',
        ],
    },
    {
        keyRawName: 'RemoveAt()',
        insert: 'RemoveAt(Pos, ...Length)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#RemoveAt',
        doc: [
            'Removes items from the given position in a linear array.',
            '*Pos* : The position of the value or values to remove.',
            '*Length*: The length of the range of values to remove. Items from Pos to Pos+Length-1 are removed. If omitted, one item is removed.',

            '*Return Value*: If Length is omitted, the value removed from Pos is returned (blank if none). Otherwise the return value is the number of removed items which had values, which can differ from Length in a sparse array, but is always between 0 and Length (inclusive).',
        ],
    },
    {
        keyRawName: 'Push()',
        insert: 'Push()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#Push',
        doc: [
            'Appends values to the end of an array.',
        ],
    },
    {
        keyRawName: 'Pop()',
        insert: 'Pop()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#Pop',
        doc: [
            'Removes and returns the last array element.',
        ],
    },
    {
        keyRawName: 'Delete()',
        insert: 'Delete(Key)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#Delete',
        doc: [
            'Removes key-value pairs from an object.',
            '*Key*: Any single key.',
        ],
    },
    {
        keyRawName: 'Delete()',
        insert: 'Delete(FirstKey, LastKey)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#Delete',
        doc: [
            'Removes key-value pairs from an object.',
            '*FirstKey*, *LastKey* : Any valid range of integer or string keys, where FirstKey <= LastKey. Both keys must be the same type.',
        ],
    },
    {
        keyRawName: 'MinIndex()',
        insert: 'MinIndex()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#MinMaxIndex',
        doc: [
            'If any integer keys are present, MinIndex returns the lowest and MaxIndex returns the highest. Otherwise an empty string is returned.',
        ],
    },
    {
        keyRawName: 'MaxIndex()',
        insert: 'MaxIndex()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#MinMaxIndex',
        doc: [
            'If any integer keys are present, MinIndex returns the lowest and MaxIndex returns the highest. Otherwise an empty string is returned.',
        ],
    },
    {
        keyRawName: 'Length()',
        insert: 'Length()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#Length',
        doc: [
            '*Returns* the length of a linear array beginning at position 1; that is, the highest positive integer key contained by the object, or 0 if there aren\'t any.',
        ],
    },
    {
        keyRawName: 'Count()',
        insert: 'Count()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#Count',
        doc: [
            '*Returns* the number of key-value pairs present in the object.',
        ],
    },
    {
        keyRawName: 'SetCapacity()',
        insert: 'SetCapacity(MaxItems)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#SetCapacity',
        doc: [
            'Adjusts the capacity of an object or one of its fields.',
            '*MaxItems*: The maximum number of key-value pairs the object should be able to contain before it must be automatically expanded. If less than the current number of key-value pairs, that number is used instead, and any unused space is freed.',
            '*Returns*: The new capacity if successful, otherwise an empty string.',
        ],
    },
    {
        keyRawName: 'SetCapacity()',
        insert: 'SetCapacity(Key, ByteSize)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#SetCapacity',
        doc: [
            'Adjusts the capacity of an object or one of its fields.',
            '*Key*: Any valid key.',
            '*ByteSize*: The new size in bytes of the field\'s string buffer, excluding the null-terminator. If the field does not exist, it is created. If ByteSize is zero, the buffer is freed but the empty field is not removed. If ByteSize is less than the current size, excess data is truncated; otherwise all existing data is preserved.',
            '*Returns*: The new capacity if successful, otherwise an empty string.',
        ],
    },
    {
        keyRawName: 'GetCapacity()',
        insert: 'GetCapacity(...Key)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#GetCapacity',
        doc: [
            '*Returns* the current capacity of an object or one of its fields.',
            '*Returns* an empty string if the field does not exist or does not contain a string.',
        ],
    },
    {
        keyRawName: 'GetAddress()',
        insert: 'GetAddress(Key)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#GetAddress',
        doc: [
            '*Returns* the current address of the field\'s string buffer, if it has one.',
        ],
    },
    {
        keyRawName: '_NewEnum()',
        insert: '_NewEnum()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#NewEnum',
        doc: [
            '*Returns* a new enumerator to enumerate this object\'s key-value pairs. This method is usually not called directly, but by the for-loop.',
        ],
    },
    {
        keyRawName: 'HasKey()',
        insert: 'HasKey(Key)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#HasKey',
        doc: [
            '*Returns* true if Key is associated with a value (even "") within Object, otherwise false.',
        ],
    },
    {
        keyRawName: 'Clone()',
        insert: 'Clone()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#Clone',
        doc: [
            '*Returns* a shallow copy of the object.',
        ],
    },
    {
        keyRawName: 'Base',
        insert: 'Base',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#Base',
        doc: [
            '*Returns* a shallow copy of the object.',
            '> BaseObject := Object.Base',
            '> Object.Base := BaseObject',
            'BaseObject must be an object or an empty string.',

            'Properties and methods defined by a base object are accessible only while that base object is in use. Therefore, changing Object\'s base also changes the set of available properties and methods.',
        ],
    },
    {
        keyRawName: 'Insert()',
        insert: 'Insert(Value)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#Insert',
        doc: [
            '**Deprecated:** Insert is not recommended for use in new scripts. Use [InsertAt](https://www.autohotkey.com/docs/v1/lib/Object.htm#InsertAt), [Push](https://www.autohotkey.com/docs/v1/lib/Object.htm#Push), [ObjRawSet](https://www.autohotkey.com/docs/v1/lib/Object.htm#RawSet) or a simple assignment instead.',
            '```ahk',
            'Object.Insert(Pos, Value1 [, Value2, ... ValueN])',
            'Object.Insert(Value)',
            'Object.Insert(StringOrObjectKey, Value)',
            '```',
            'The behaviour of Insert depends on the number and type of its parameters:',
            '',
            '- If there are multiple parameters and the first parameter is an integer, Insert behaves like [InsertAt](https://www.autohotkey.com/docs/v1/lib/Object.htm#InsertAt).',
            '- If there are multiple parameters and the first parameter is not an integer, Insert behaves like [ObjRawSet](https://www.autohotkey.com/docs/v1/lib/Object.htm#RawSet).',
            '- If there is only one parameter, Insert behaves like [Push](https://www.autohotkey.com/docs/v1/lib/Object.htm#Push).',
            '',
            'Insert returns 1 (true). In [\\[v1.1.21+\\]](https://www.autohotkey.com/docs/v1/AHKL_ChangeLog.htm#v1.1.21.00 "Applies to AutoHotkey v1.1.21 and later"), an exception is thrown if a memory allocation fails. Earlier versions returned an empty string in that case.',
        ],
    },

    {
        keyRawName: 'Remove()',
        insert: 'Remove(FirstKey, LastKey)',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Object.htm#Remove',
        doc: [
            '**Deprecated:** Remove is not recommended for use in new scripts. Use [RemoveAt](https://www.autohotkey.com/docs/v1/lib/Object.htm#RemoveAt), [Delete](https://www.autohotkey.com/docs/v1/lib/Object.htm#Delete) or [Pop](https://www.autohotkey.com/docs/v1/lib/Object.htm#Pop) instead.',
            'Removes key-value pairs from an object.',
            '',
            '```ahk',
            'Object.Remove(FirstKey, LastKey)',
            '```',
            '',
            'The behaviour of Remove depends on the number and type of its parameters:',
            '',
            '- `Object.Remove(Integer)` behaves like `Object.RemoveAt(Integer)`.',
            '- `Object.Remove(Integer, "")` behaves like `Object.Delete(Integer)`.',
            '- `Object.Remove(Integer1, Integer2)` behaves like `Object.RemoveAt(Integer1, Integer2 - Integer1 + 1)`.',
            '- `Object.Remove()` behaves like `Object.Pop()`.',
            '- Any other valid combination of parameters behaves like [Delete](https://www.autohotkey.com/docs/v1/lib/Object.htm#Delete).',
        ],
    },
];
