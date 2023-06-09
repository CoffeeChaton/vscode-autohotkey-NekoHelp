type TOperator = {
    upName: string,
    keyRawName: string,
    body: string,
    doc: string,

    recommended: boolean,
    link: `https://www.autohotkey.com/docs/v1/${string}`,
    exp: readonly string[],
};

/**
 * after initialization clear
 */
export const operatorDataList: TOperator[] = [
    {
        upName: 'AND',
        keyRawName: 'and',
        body: 'and',
        doc: 'Both of these are **logical-AND**. For example: `x > 3 and x < 10`. To enhance performance, [short-circuit evaluation](https://www.autohotkey.com/docs/v1/Functions.htm#ShortCircuit) is applied. Also, a line that begins with AND/OR/&&/|| (or any other operator) is automatically [appended to](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation) the line above it.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/Variables.htm#and',
        exp: [
            ';exp of "And"',
            'x > 3 and x < 10',
            'x > 3 && x < 10',
            ';exp2',
            'if (Color = "Red" or Color = "Green" or Color = "Blue"        ; Comment.',
            '   or Color = "Black" or Color = "Gray" or Color = "White")   ; Comment.',
            '   and ProductIsAvailableInColor(Product, Color)              ; Comment.',
        ],
    },
    {
        upName: 'BETWEEN',
        keyRawName: 'Between',
        body: 'between',
        doc: 'Checks whether a [variable\'s](https://www.autohotkey.com/docs/v1/Variables.htm) contents are numerically or alphabetically between two values (inclusive).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/lib/IfBetween.htm',
        exp: [
            'if Var Between LowerBound and UpperBound',
            'if Var not Between LowerBound and UpperBound',
            '; exp',
            'var := 2',
            'if var between 1 and 5',
            '    MsgBox, % var "is in the range 1 to 5, inclusive."',
        ],
    },
    {
        upName: 'CONTAINS',
        keyRawName: 'contains',
        body: 'contains',
        doc: 'Checks whether a [variable\'s](https://www.autohotkey.com/docs/v1/Variables.htm) contents match one of the items in a list.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/lib/IfIn.htm',
        exp: [
            'if Var in MatchList',
            'if Var not in MatchList',
            '',
            'if Var contains MatchList',
            'if Var not contains MatchList',
        ],
    },
    {
        upName: 'IN',
        keyRawName: 'in',
        body: 'in',
        doc: 'Checks whether a [variable\'s](https://www.autohotkey.com/docs/v1/Variables.htm) contents match one of the items in a list.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/lib/IfIn.htm',
        exp: [
            ';EXP of If In',
            'if Var in MatchList',
            'if Var not in MatchList',
            '',
            'if Var contains MatchList',
            'if Var not contains MatchList',
        ],
    },
    {
        upName: 'IS',
        keyRawName: 'is',
        body: 'is',
        doc: 'Checks whether a [variable\'s](https://www.autohotkey.com/docs/v1/Variables.htm) contents are numeric, uppercase, etc.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/lib/IfIs.htm',
        exp: [
            ';EXP of If Is',
            'if Var is Type',
            'if Var is not Type',
        ],
    },
    {
        upName: 'NEW',
        keyRawName: 'new',
        body: 'new',
        doc: 'Creates a new object derived from another object.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/Variables.htm#new',
        exp: [
            'x := new y(z) ; (where y is a variable, not a function name)',
            '',
            '; https://www.autohotkey.com/docs/v1/Objects.htm#Custom_NewDelete',
            'm1 := new GMem(0, 20)',
            '',
            'class GMem',
            '{',
            '    __New(aFlags, aSize)',
            '    {',
            '        this.ptr := DllCall("GlobalAlloc", "UInt", aFlags, "Ptr", aSize, "Ptr")',
            '        if !this.ptr',
            '            return ""',
            '        MsgBox % "New GMem of " aSize " bytes at address " this.ptr "."',
            '        return this  ; This line can be omitted when using the \'new\' operator.',
            '    }',
            '',
            '    __Delete()',
            '    {',
            '        MsgBox % "Delete GMem at address " this.ptr "."',
            '        DllCall("GlobalFree", "Ptr", this.ptr)',
            '    }',
            '}',
        ],
    },
    {
        upName: 'NOT',
        keyRawName: 'not',
        body: 'not',
        doc: '**Logical-NOT**. Except for its lower precedence, this is the same as the **!** operator.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/Variables.htm#not',
        exp: [
            '; exp of "Not"',
            'not (x = 3 or y = 3)',
            '!(x = 3 or y = 3)',
        ],
    },
    {
        upName: 'OR',
        keyRawName: 'or',
        body: 'or',
        doc: 'Both of these are **logical-OR**. For example: `x <= 3 or x >= 10`. To enhance performance, [short-circuit evaluation](https://www.autohotkey.com/docs/v1/Functions.htm#ShortCircuit) is applied.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/Variables.htm#or',
        exp: [
            '; exp of "Or"',
            'x <= 3 or x >= 10',
            'x <= 3 || x >= 10',
        ],
    },
    {
        upName: 'BYREF',
        keyRawName: 'ByRef',
        body: 'ByRef',
        doc: '**ByRef Parameters**: From the function\'s point of view, parameters are essentially the same as [local variables](https://www.autohotkey.com/docs/v1/Functions.htm#Local) unless they are defined as _ByRef_ as in this example:',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/v1/Functions.htm#ByRef',
        exp: [
            'Swap(ByRef Left, ByRef Right)',
            '{',
            '    temp := Left',
            '    Left := Right',
            '    Right := temp',
            '}',
        ],
    },
];
