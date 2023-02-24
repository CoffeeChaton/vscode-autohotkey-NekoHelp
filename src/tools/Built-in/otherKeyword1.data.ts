/* eslint-disable no-template-curly-in-string */
export type TOtherKeyword1 = Readonly<{
    upName: string,
    keyRawName: string,
    body: string,
    doc: string,
    recommended: boolean,
    link: `https://www.autohotkey.com/docs/v1/${string}.htm${string}`,
    exp: readonly string[],
    //
    /**
     * S -> string?
     * O -> output
     * E -> number?
     * I -> input varName
     * F -> functionName
     * L -> label
     * FO -> funcObject
     */
    _paramType: string[],
}>;

/**
 * after initialization clear
 */
export const otherKeyword1: TOtherKeyword1[] = [
    {
        upName: 'CLASS',
        keyRawName: 'Class',
        body: [
            'Class ${1:className} $0extends ${2:BaseClassName}',
            '{',
            '    InstanceVar := Expression',
            '',
            '    __NEW(){',
            '        ',
            '    }',
            '',
            '}',
        ].join('\n'),
        doc: [
            'At its root, a "class" is a set or category of things having some property or attribute in common.',
            'Since a [base](https://www.autohotkey.com/docs/v1/Objects.htm#Custom_Objects) or',
            '[prototype](https://www.autohotkey.com/docs/v1/Objects.htm#Custom_Prototypes) object defines properties and beHaviour for set of objects,',
            'it can also be called a _class_ object.',
            'For convenience, base objects can be defined using the "class" keyword as shown below:',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/Objects.htm#Custom_Classes',
        exp: [
            'class ClassName extends BaseClassName',
            '{',
            '    InstanceVar := Expression',
            '    static ClassVar := Expression',
            '',
            '    class NestedClass',
            '    {',
            '        ...',
            '    }',
            '',
            '    Method()',
            '    {',
            '        ...',
            '    }',
            '',
            '    Property[]  ; Brackets are optional',
            '    {',
            '        get {',
            '            return ...',
            '        }',
            '        set {',
            '            return ... := value',
            '        }',
            '    }',
            '}',
        ],
        _paramType: [],
    },
    {
        upName: 'STATIC',
        keyRawName: 'Static',
        body: 'static',
        doc: 'Static variables are always implicitly local, but differ from locals because their values are remembered between calls.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/Functions.htm#static',
        exp: [
            'LogToFile(TextToLog)',
            '{',
            '    Static LoggedLines := 0',
            '    LoggedLines += 1  ; Maintain a tally locally (its value is remembered between calls).',
            '    global LogFileName',
            '    FileAppend, %LoggedLines%: %TextToLog%`n, %LogFileName%',
            '}',
        ],
        _paramType: [],
    },
    {
        upName: 'GLOBAL',
        keyRawName: 'Global',
        body: 'global',
        doc: 'To refer to an existing global variable inside a function (or create a new one), declare the variable as global prior to using it.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/Functions.htm#Global',
        exp: [
            'global LogFileName  ; This global variable was previously given a value somewhere outside this function.',
        ],
        _paramType: [],
    },
    {
        upName: 'LOCAL',
        keyRawName: 'Local',
        body: 'local',
        doc: [
            'Local variables are specific to a single function and are visible only inside that function.',
            'Consequently, a local variable may have the same name as a global variable and both will have separate contents.',
            'Separate functions may also safely use the same variable names.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/v1/Functions.htm#Local',
        exp: [
            'local a',
            'Local b := 0',
        ],
        _paramType: [],
    },
];
