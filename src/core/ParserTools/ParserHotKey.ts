import * as vscode from 'vscode';
import { CAhkHotKeys } from '../../AhkSymbol/CAhkHotKeys';

import { EDetail } from '../../globalEnum';
import { keyAltTabListUpSet } from '../../tools/Built-in/100_other/Keys_and_other/keyList.data';
import type { TFuncInput } from '../getChildren';
import { checkHotKeyMa2, isHotKeyLine } from './isHotKeyLine';

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

    const AfterString: string = lStr.replace(name, '').trim();

    // https://www.autohotkey.com/docs/v1/HotkeyFeatures.htm#easy-to-reach;
    // https://www.autohotkey.com/docs/v1/misc/Remap.htm#Remap
    const mayRemapUp: string = AfterString.toUpperCase();
    const isRemap: boolean = checkHotKeyMa2(mayRemapUp)
        || keyAltTabListUpSet.has(mayRemapUp)
        || isHotKeyLine(mayRemapUp);

    return new CAhkHotKeys(
        {
            name: isRemap
                ? `${name}${AfterString}`
                : name,
            range: new vscode.Range(
                start,
                new vscode.Position(line, lStr.length),
            ),
            selectionRange: new vscode.Range(
                start,
                new vscode.Position(line, col + name.length),
            ),
            uri,
            AhkTokenLine,
        },
        AfterString,
        isRemap,
    );
}
