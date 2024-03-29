/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-template-curly-in-string */

type TData = {
    label: `;@ahk-neko-${string}`,
    insert: `;@ahk-neko-${string}`,
    doc: string,
    exp: readonly string[],
};

/**
 * after initialization clear
 */
export const nekoExCommentData: TData[] = [
    // diag
    {
        label: ';@ahk-neko-ignore XX line',
        insert: ';@ahk-neko-ignore ${1|1,2,999,any number|} line',
        doc: 'ignore diagnosis',
        exp: [
            ';@ahk-neko-ignore 1 line',
            ';@ahk-neko-ignore 2 line',
            ';@ahk-neko-ignore 999 line',
            '',
            ';use 0 to open diag',
            ';@ahk-neko-ignore 0 line',
        ],
    },
    {
        label: ';@ahk-neko-ignore-fn XX line',
        insert: ';@ahk-neko-ignore-fn ${1|1,2,999,any number|} line',
        doc: 'ignore diagnosis (5XX)',
        exp: [
            ';@ahk-neko-ignore-fn 1 line',
            ';@ahk-neko-ignore-fn 2 line',
            ';@ahk-neko-ignore-fn 999 line',
            '',
            ';use 0 to open diag',
            ';@ahk-neko-ignore-fn 0 line',
        ],
    },
    // format
    {
        label: ';@ahk-neko-format-ignore-start',
        insert: ';@ahk-neko-format-ignore-start\n;@ahk-neko-format-ignore-end',
        doc: 'ignore any format',
        exp: [
            ';@ahk-neko-format-ignore-start',
            ';@ahk-neko-format-ignore-end',
        ],
    },
    {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        label: ';@ahk-neko-format-ignore-end',
        insert: ';@ahk-neko-format-ignore-end',
        doc: 'ignore any format',
        exp: [
            ';@ahk-neko-format-ignore-start',
            ';@ahk-neko-format-ignore-end',
        ],
    },
    {
        label: ';@ahk-neko-format-inline-spacing-ignore-start',
        insert: ';@ahk-neko-format-inline-spacing-ignore-start\n;@ahk-neko-format-inline-spacing-ignore-end',
        doc: 'ignore `Alpha test options` format',
        exp: [
            ';@ahk-neko-format-inline-spacing-ignore-start',
            ';@ahk-neko-format-inline-spacing-ignore-end',
        ],
    },
    {
        label: ';@ahk-neko-format-inline-spacing-ignore-end',
        insert: ';@ahk-neko-format-inline-spacing-ignore-end',
        doc: 'ignore `Alpha test options` format',
        exp: [
            ';@ahk-neko-format-inline-spacing-ignore-start',
            ';@ahk-neko-format-inline-spacing-ignore-end',
        ],
    },
];
