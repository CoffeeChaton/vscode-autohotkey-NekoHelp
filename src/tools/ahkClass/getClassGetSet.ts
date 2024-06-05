import * as vscode from 'vscode';
import { CAhkClassPropertyDef, CAhkClassPropertyGetSet } from '../../AhkSymbol/CAhkClass';

import { getChildren, type TFuncInput } from '../../core/getChildren';
import { getRange } from '../range/getRange';

function getCAhkClassGet(FuncInput: TFuncInput): CAhkClassPropertyGetSet | null {
    const {
        AhkTokenLine,
        uri,
        DocStrMap,
        RangeEndLine,
        defStack,
    } = FuncInput;

    const {
        lStr,
        line,
        fistWordUp,
    } = AhkTokenLine;

    if (fistWordUp === '') return null;

    const ma: RegExpMatchArray | null = lStr.match(/\b(get|set)\b/iu);
    if (ma === null) return null;
    const col: number | undefined = ma.index;
    if (col === undefined) return null;

    const name: string = ma[1];

    const searchLine = !lStr.endsWith('{')
            && lStr.replace(name, '').trim() !== ''
        ? line + 1
        : line;

    return new CAhkClassPropertyGetSet({
        name,
        range: getRange(DocStrMap, line, searchLine, RangeEndLine, col),
        selectionRange: new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, col + name.length),
        ),
        uri,
        detail: defStack[0],
    });
}

export function getClassPropertyDef(FuncInput: TFuncInput): CAhkClassPropertyDef | null {
    const { lStr } = FuncInput.AhkTokenLine;

    const lStrTrim = lStr.trim();
    if (lStrTrim.includes('(') || lStrTrim.includes('=')) return null;

    const ma: RegExpMatchArray | null = lStrTrim.match(/^([#$@\w\u{A1}-\u{FFFF}]+)(?:\[\s*\])?[ \t]*\{?$/u);
    if (ma === null) return null;

    const {
        AhkTokenLine,
        uri,
        DocStrMap,
        RangeEndLine,
        GValMap,
    } = FuncInput;
    const { line, textRaw } = AhkTokenLine;

    const name: string = ma[1];
    const col: number = textRaw.search(/[#$@\w\u{A1}-\u{FFFF}]/u);
    const selectionRange: vscode.Range = new vscode.Range(
        new vscode.Position(line, col),
        new vscode.Position(line, col + name.length),
    );

    const range = getRange(DocStrMap, line, line, RangeEndLine, col);

    const ch: CAhkClassPropertyGetSet[] = getChildren<CAhkClassPropertyDef>(
        [getCAhkClassGet],
        {
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            defStack: [name],
            uri,
            GValMap,
        },
    );

    return new CAhkClassPropertyDef({
        name,
        range,
        selectionRange,
        uri,
        ch,
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
