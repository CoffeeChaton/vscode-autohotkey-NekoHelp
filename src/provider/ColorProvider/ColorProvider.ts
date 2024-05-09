/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { EMultiline } from '../../globalEnum';
import { toBase16 } from '../../tools/Built-in/100_other/Windows_Messages/Windows_Messages.data';

/**
 * ```ahk
 *
 * ;https://www.autohotkey.com/docs/v1/lib/Gui.htm#Font
 * Gui, Add, Text, cRed, My Text
 *
 * Gui, Color , WindowColor, ControlColor
 * Gui, Color, EEAA99
 *
 * WinSet, TransColor, Color
 * WinSet, TransColor, EEAA99
 *
 * PixelSearch, OutputVarX, OutputVarY, X1, Y1, X2, Y2, ColorID , Variation, Mode ;https://www.autohotkey.com/docs/v1/lib/PixelSearch.htm
 * PixelSearch,.........................................0x444444
 *
 * Menu, MenuName, Color, ColorValue , Single ;https://www.autohotkey.com/docs/v1/lib/Menu.htm#Color
 * ;                      ^^^^^^^^^
 *
 * Gui, Add, ListView, cEEAA99, ; https://www.autohotkey.com/docs/v1/lib/ListView.htm
 *
 * ```
 * ---
 * Add a space after each color option if there are any more options that follow it.
 *
 * For example: `cbRed` `ct900000` `cwBlue`.
 */

// dprint-ignore
const colorRegex = /(?<=[," \t=]|^)(?:c[btw]?|#)?(?:0x)?([\da-f]{6}(?:[\da-f]{2})?)|(black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua)\b/giu;
//                               ^ma[0]                 ^ma[1]  only 6 or 8         ^ma[2]

/**
 * https://www.autohotkey.com/docs/v1/lib/Progress.htm#Object_Colors
 */
const colorMap: ReadonlyMap<string, string> = new Map(
    [
        // k and v all all need toLowerCase
        ['black', '000000'],
        ['silver', 'c0c0c0'],
        ['gray', '808080'],
        ['white', 'ffffff'],
        ['maroon', '800000'],
        ['red', 'ff0000'],
        ['purple', '800080'],
        ['fuchsia', 'ff00ff'],
        ['green', '008000'],
        ['lime', '00ff00'],
        ['olive', '808000'],
        ['yellow', 'ffff00'],
        ['navy', '000080'],
        ['blue', '0000ff'],
        ['teal', '008080'],
        ['aqua', '00ffff'],
    ],
);

function str2Color(ma1: string): vscode.Color {
    const s1: string = ma1.toLowerCase(); // all need toLowerCase
    const s2: string = colorMap.get(s1) ?? s1; // now all is toLowerCase

    // has #RR GG BB  or #RR GG BB AA
    //  '#' (RR GG BB) (AA)
    //       01 23 45   67

    // not has #RGB or #RGBA

    const rs = `${s2[0]}${s2[1]}`;
    const r: number = Number.parseInt(rs, 16);

    const gs = `${s2[2]}${s2[3]}`;
    const g: number = Number.parseInt(gs, 16);

    const bs = `${s2[4]}${s2[5]}`;
    const b: number = Number.parseInt(bs, 16);

    const len8 = 8;
    const as: string = s2.length === len8
        ? `${s2[6]}${s2[7]}`
        : 'ff';
    const a: number = Number.parseInt(as, 16);

    return new vscode.Color(r / 255, g / 255, b / 255, a / 255);
}

function provideDocumentColors(document: vscode.TextDocument): vscode.ColorInformation[] {
    const AhkFileData: TAhkFileData | undefined = pm.getDocMap(document.uri.fsPath);
    if (AhkFileData === undefined) return [];

    const { DocStrMap } = AhkFileData;
    const arr: vscode.ColorInformation[] = [];
    //
    for (const AhkTokenLine of DocStrMap) {
        const {
            lStr,
            textRaw,
            line,
            multiline,
        } = AhkTokenLine;
        const text: string = textRaw.slice(0, lStr.length);
        if (text.length === 0 || multiline !== EMultiline.none) continue;

        for (const ma of text.matchAll(colorRegex)) {
            const { index } = ma;

            const ma1: string = ma[1] ?? ma[2];

            const char: number = ma[0].length - ma1.length + index;

            const b1: string | undefined = text.at(index - 1);
            const b2: string | undefined = text.at(index - 2);
            if (b1 === '"' || b2 === '"') {
                // 3. lint "#0x00000" or "0x000000" if start with `" need and with`"
                const b3: string | undefined = text.at(char + ma1.length);
                if (b3 !== '"') continue;
            }

            const color: vscode.Color = str2Color(ma1);
            const range: vscode.Range = new vscode.Range(
                new vscode.Position(line, char),
                new vscode.Position(line, char + ma1.length),
            );
            const colorInfo: vscode.ColorInformation = new vscode.ColorInformation(range, color);
            arr.push(colorInfo);
        }
    }
    return arr;
}

function provideColorPresentations(
    color: vscode.Color,
    context: {
        readonly document: vscode.TextDocument,
        readonly range: vscode.Range,
    },
): vscode.ColorPresentation[] {
    const AhkFileData: TAhkFileData | undefined = pm.getDocMap(context.document.uri.fsPath);
    if (AhkFileData === undefined) return [];

    //
    const {
        red,
        green,
        blue,
        alpha,
    } = color;

    const rgb: string = `${toBase16(red * 255)}${toBase16(green * 255)}${toBase16(blue * 255)}`.toLowerCase();
    const a: string = toBase16(alpha * 255).toLowerCase();

    const rgba: string = a === 'ff'
        ? rgb
        : `${rgb}${a}`;

    const arr: vscode.ColorPresentation[] = [
        new vscode.ColorPresentation(rgba),
        new vscode.ColorPresentation(rgba.toUpperCase()),
    ];
    if (a === 'ff') {
        for (const [k, v] of colorMap) {
            if (v === rgb) {
                arr.push(
                    new vscode.ColorPresentation(k),
                    new vscode.ColorPresentation(k[0].toUpperCase() + k.slice(1)),
                );
                break;
            }
        }
    }

    return arr;
}

export const ColorProvider: vscode.DocumentColorProvider = {
    provideDocumentColors(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.ColorInformation[]> {
        return provideDocumentColors(document);
    },

    provideColorPresentations(
        color: vscode.Color,
        context: {
            readonly document: vscode.TextDocument,
            readonly range: vscode.Range,
        },
    ): vscode.ProviderResult<vscode.ColorPresentation[]> {
        return provideColorPresentations(color, context);
    },
};
