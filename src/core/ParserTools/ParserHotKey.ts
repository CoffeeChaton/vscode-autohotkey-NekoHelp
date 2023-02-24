import * as vscode from 'vscode';
import { CAhkHotKeys } from '../../AhkSymbol/CAhkLine';

import { EDetail } from '../../globalEnum';
import type { TFuncInput } from '../getChildren';

/**
 * ```ahk
 * ~F10::
 *     MsgBox % "text"
 * Return
 *
 * ~F11:: foo()
 *
 * ;https://www.autohotkey.com/docs/v1/Hotkeys.htm#Function
 * ~F1::
 * ~F2::
 *     boo(){
 *     }
 * ```
 *
 *  - <https://www.autohotkey.com/docs/v1/Hotkeys.htm>
 *  - Hotkey labels consist of a hotkey followed by double-colon.
 */
export function ParserHotKey(FuncInput: TFuncInput): CAhkHotKeys | null {
    const { AhkTokenLine, uri } = FuncInput;
    const {
        textRaw,
        line,
        lStr,
        detail,
    } = AhkTokenLine;

    if (!detail.includes(EDetail.isHotKeyLine)) return null;

    const textRawTrimStart: string = textRaw.trimStart();
    const ma: RegExpMatchArray | null = textRawTrimStart.match(/^([^:]+::)/u);
    if (ma === null) return null;

    const name: string = ma[1].trim();
    const col: number = textRaw.length - textRawTrimStart.length;
    const start: vscode.Position = new vscode.Position(line, col);

    return new CAhkHotKeys({
        name,
        range: new vscode.Range(
            start,
            new vscode.Position(line, textRaw.length),
        ),
        selectionRange: new vscode.Range(
            start,
            new vscode.Position(line, col + name.length),
        ),
        uri,
        AhkTokenLine,
    }, lStr.replace(name, '').trim());
}
