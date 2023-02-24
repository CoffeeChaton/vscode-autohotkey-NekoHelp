import * as vscode from 'vscode';
import type { TClassChildren } from '../AhkSymbol/CAhkClass';
import { CAhkClass } from '../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../AhkSymbol/CAhkFunc';
import type { TAhkSymbolList } from '../AhkSymbol/TAhkSymbolIn';
import { getClassGetSet } from '../tools/ahkClass/getClassGetSet';
import { getClassInstanceVar } from '../tools/ahkClass/getClassInstanceVar';
import { getRange } from '../tools/range/getRange';
import type { TFuncInput } from './getChildren';
import { getChildren } from './getChildren';
import { getFunc } from './ParserTools/ParserFunc';

function setClassInsertText(children: TAhkSymbolList): string {
    for (const ch of children) {
        if (ch instanceof CAhkFunc && ch.upName === '__NEW') {
            return ch.selectionRangeText.replace(/^__NEW/iu, '');
        }
    }
    return '';
}

function setClassBase(lStr: string, colFix: number, name: string): string {
    return lStr
        .slice(colFix + name.length, lStr.length + colFix + name.length)
        .replace(/\bextends\b/iu, '')
        .trim()
        .replace('{', '')
        .trim();
}

export function getClass(FuncInput: TFuncInput): CAhkClass | null {
    const {
        lStr,
        fistWordUp,
        fistWordUpCol,
        line,
    } = FuncInput.AhkTokenLine;

    if (fistWordUp !== 'CLASS') return null;
    const lStrFix: string = lStr
        // eslint-disable-next-line no-magic-numbers
        .slice(fistWordUpCol + 5).trimStart() // 5 === 'CLASS'.len
        .padStart(lStr.length, ' ');

    // class ClassName extends BaseClassName
    //       ^^^^^^^^^
    const ma: RegExpMatchArray | null = lStrFix.match(/(\w+)/iu);
    if (ma === null) return null;

    const {
        DocStrMap,
        RangeEndLine,
        uri,
        GValMap,
        defStack,
    } = FuncInput;

    const range = getRange(DocStrMap, line, line, RangeEndLine, fistWordUpCol);
    const name: string = ma[1];

    const ch: TClassChildren[] = getChildren<CAhkClass>(
        [getClass, getFunc, getClassGetSet, getClassInstanceVar],
        {
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            defStack: [...defStack, name],
            uri,
            GValMap,
        },
    );

    const col: number = ma.index ?? lStrFix.indexOf(name);

    return new CAhkClass({
        name,
        Base: setClassBase(lStr, col, name),
        range,
        selectionRange: new vscode.Range(line, col, line, col + name.length),
        insertText: `${name}${setClassInsertText(ch)}`,
        uri,
        ch,
    });
}

// TODO use isClassDefinition replace... regex

// inline LPTSTR IsClassDefinition(LPTSTR aBuf, bool &aHasOTB)
// {
//     if (_tcsnicmp(aBuf, _T("Class"), 5) || !IS_SPACE_OR_TAB(aBuf[5])) // i.e. it's not "Class" followed by a space or tab.
//         return NULL;
// ...
