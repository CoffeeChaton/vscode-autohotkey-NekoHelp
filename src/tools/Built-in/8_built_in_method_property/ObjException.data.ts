/* eslint-disable sonarjs/no-duplicate-string */
import type { TBiObj } from './ObjBase.data';

export const ObjException: readonly TBiObj[] = [
    {
        keyRawName: 'Message',
        insert: 'Message',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception',
        doc: [
            'An error message or [ErrorLevel](https://www.autohotkey.com/docs/v1/misc/ErrorLevel.htm) value.',
        ],
    },
    {
        keyRawName: 'What',
        insert: 'What',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception',
        doc: [
            'The name of the command, function or label which was executing or about to execute when the error occurred.',
        ],
    },
    {
        keyRawName: 'Extra',
        insert: 'Extra',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception',
        doc: [
            'Additional information about the error, if available.',
        ],
    },
    {
        keyRawName: 'File',
        insert: 'File',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception',
        doc: [
            'Set automatically to the full path of the script file which contains the line at which the error occurred.',
        ],
    },
    {
        keyRawName: 'Line',
        insert: 'Line',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception',
        doc: [
            'Set automatically to the line number at which the error occurred.',
        ],
    },
];
