import * as vscode from 'vscode';
import { CAhkHotString } from '../../AhkSymbol/CAhkLine';

import { EDetail } from '../../globalEnum';
import type { TFuncInput } from '../getChildren';

/**
 * <https://www.autohotkey.com/docs/v1/misc/Labels.htm#syntax-and-usage>
 * > - HotString labels consist of a colon, zero or more options, another colon, an abbreviation and double-colon.
 * > - if (!strTrim.startsWith(':')) return false;
 *
 * ```ahk
 *     :?:; btu::; but
 *     ;^has ;
 *     ::hs,,::HotString
 * ```
 */
export function ParserHotStr(FuncInput: TFuncInput): CAhkHotString | null {
    if (!FuncInput.AhkTokenLine.detail.includes(EDetail.isHotStrLine)) {
        return null;
    }

    // lock as getLStrHotStr
    const { AhkTokenLine, uri } = FuncInput;
    const { textRaw, line } = AhkTokenLine;

    const ma: RegExpMatchArray | null = textRaw.match(/^(\s*:[^:]*:[^:]+::)/u);
    if (ma === null) return null;

    const col: number = textRaw.indexOf(':'); // first :

    const name: string = ma[1].trim();

    const AfterString: string = textRaw
        .replace(name, '')
        .replace(/[ \t];.*/u, '')
        .trim();

    return new CAhkHotString({
        name,
        range: new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, textRaw.length),
        ),
        selectionRange: new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, col + name.length),
        ),
        uri,
        AhkTokenLine,
    }, AfterString);
}
