type TFuncCompletion = {
    keyRawName: string,
    uri: `https://www.autohotkey.com/docs/v1/lib/Func.htm#${string}`,
    doc: readonly string[],
    exp: readonly string[],
};

export const ObjFunc: readonly TFuncCompletion[] = [
    {
        keyRawName: 'Name',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Func.htm#Name',
        doc: ['Returns the functions name.'],
        exp: ['FunctionName := Func.Name'],
    },
    {
        keyRawName: 'IsBuiltIn',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Func.htm#IsBuiltIn',
        doc: [
            'Returns _true_ if the function is [built-in](https://www.autohotkey.com/docs/v1/Functions.htm#BuiltIn) and _false_ otherwise.',
        ],
        exp: [
            'Boolean := Func.IsBuiltIn',
            '',
            'fn := Func("StrLen")',
            'MsgBox % fn.Name "() is " (fn.IsBuiltIn ? "built-in." : "user-defined.")',
        ],
    },
    {
        keyRawName: 'IsVariadic',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Func.htm#IsVariadic',
        doc: [
            'Returns _true_ if the function is [variadic](https://www.autohotkey.com/docs/v1/Functions.htm#Variadic) and _false_ otherwise.',
        ],
        exp: [
            'Boolean := Func.IsVariadic',
        ],
    },
    {
        keyRawName: 'MinParams',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Func.htm#MinParams',
        doc: ['Returns the number of required parameters.'],
        exp: [
            'intParamCount := Func.MinParams',
        ],
    },
    {
        keyRawName: 'MaxParams',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Func.htm#MaxParams',
        doc: [
            'Returns the number of formally-declared parameters for a user-defined function or maximum parameters for a built-in function.\n\nIf the function is [variadic](https://www.autohotkey.com/docs/v1/Functions.htm#Variadic), _ParamCount_ indicates the maximum number of parameters which can be accepted by the function without overflowing into the "variadic\\*" parameter.',
        ],
        exp: [
            'intParamCount := Func.MaxParams',
        ],
    },

    //
    {
        keyRawName: 'Bind()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Func.htm#Bind',
        doc: [
            'Binds parameters to the function and returns a [BoundFunc object](https://www.autohotkey.com/docs/v1/misc/Functor.htm#BoundFunc).',
        ],
        exp: ['BoundFunc := Func.Bind(Param1, Param2, ...)'],
    },
    {
        keyRawName: 'Call()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Func.htm#Call',
        doc: ['Calls the function.'],
        exp: ['Func.Call(Param1, Param2, ...)  ; Requires [v1.1.19+]'],
    },
    {
        keyRawName: 'IsByRef()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Func.htm#IsByRef',
        doc: ['Determines whether a parameter is ByRef.'],
        exp: ['Boolean_or_space := Func.IsByRef([ParamIndex]) ;one-based index of a parameter.'],
    },
    {
        keyRawName: 'IsOptional()',
        uri: 'https://www.autohotkey.com/docs/v1/lib/Func.htm#IsOptional',
        doc: ['Determines whether a parameter is optional.'],
        exp: ['Boolean_or_space := Func.IsOptional([ParamIndex]) ;one-based index of a parameter.'],
    },
];
