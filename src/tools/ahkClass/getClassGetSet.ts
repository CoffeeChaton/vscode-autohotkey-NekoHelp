import { CAhkClassGetSet } from '../../AhkSymbol/CAhkClass';
import type { TFuncInput } from '../../core/getChildren';
import { getRange } from '../range/getRange';
import { getRangeOfLine } from '../range/getRangeOfLine';

export function getClassGetSet(FuncInput: TFuncInput): CAhkClassGetSet | null {
    const { lStr } = FuncInput.AhkTokenLine;

    const lStrTrim = lStr.trim();
    if (lStrTrim.includes('(') || lStrTrim.includes('=')) return null;

    const ma: RegExpMatchArray | null = lStrTrim.match(/^(\w+)(?:\[\])?\s*\{?$/u);
    if (ma === null) return null;

    const {
        AhkTokenLine,
        uri,
        DocStrMap,
        RangeEndLine,
    } = FuncInput;
    const { line, textRaw } = AhkTokenLine;

    return new CAhkClassGetSet({
        name: ma[1],
        range: getRange(DocStrMap, line, line, RangeEndLine, textRaw.search(/\w/u)),
        selectionRange: getRangeOfLine(line, lStr, textRaw.length),
        uri,
    });
}

// https://www.autohotkey.com/docs/v1/Objects.htm#Custom_Classes_property
// class ClassName extends BaseClassName
// {
//     InstanceVar := Expression
//     static ClassVar := Expression

//     class NestedClass
//     {
//         ...
//     }

//     Method()
//     {
//         ...
//     }

// FIXME: Property is like function!
//     Property[]  ; Brackets are optional ....<<< this way
//     {
//         get {
//             return ...
//         }
//         set {
//             return ... := value
//         }
//     }
// }

// ResultType Script::DefineClassProperty(LPTSTR aBuf)
// {
//     LPTSTR name_end = find_identifier_end(aBuf);
//     if (*name_end == '.')
//         return ScriptError(ERR_INVALID_LINE_IN_CLASS_DEF, aBuf);

//     LPTSTR param_start = omit_leading_whitespace(name_end);
//     if (*param_start == '[')
//     {
//         LPTSTR param_end = aBuf + _tcslen(aBuf);
//         if (param_end[-1] != ']')
//             return ScriptError(ERR_MISSING_CLOSE_BRACKET, aBuf);
//         *param_start = '(';
//         param_end[-1] = ')';
//     }
//     else
//         param_start = _T("()");

//     // Save the property name and parameter list for later use with DefineFunc().
//     mClassPropertyDef = tmalloc(_tcslen(aBuf) + 7); // +7 for ".Get()\0"
//     if (!mClassPropertyDef)
//         return ScriptError(ERR_OUTOFMEM);
//     _stprintf(mClassPropertyDef, _T("%.*s.Get%s"), int(name_end - aBuf), aBuf, param_start);

//     Object *class_object = mClassObject[mClassObjectCount - 1];
//     *name_end = 0; // Terminate for aBuf use below.
//     if (class_object->GetItem(ExprTokenType(), aBuf))
//         return ScriptError(ERR_DUPLICATE_DECLARATION, aBuf);
//     mClassProperty = new Property();
//     if (!mClassProperty || !class_object->SetItem(aBuf, mClassProperty))
//         return ScriptError(ERR_OUTOFMEM);
//     return OK;
// }
