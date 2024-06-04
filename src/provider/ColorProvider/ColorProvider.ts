/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import type { TVarData } from '../../AhkSymbol/CAhkFunc';
import { getConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { EDetail, EMultiline } from '../../globalEnum';
import { toBase16 } from '../../tools/Built-in/100_other/Windows_Messages/Windows_Messages.data';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { hoverMsgBoxMagicNumber } from '../Hover/tools/hoverMsgBoxMagicNumber';
import { getColorPickerIgnoreList } from './getColorPickerIgnore';
import { checkBGR } from './isBGR';

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
 * PixelSearch, OutputVarX, OutputVarY, X1, Y1, X2, Y2, 0x444444 , Variation, Mode ;https://www.autohotkey.com/docs/v1/lib/PixelSearch.htm
 * PixelSearch, ........................................^^^^^^^^
 *
 * Menu, MenuName, Color, ColorValue , Single ;https://www.autohotkey.com/docs/v1/lib/Menu.htm#Color
 * Menu, MenuName, Color, 0x444444 , Single ;https://www.autohotkey.com/docs/v1/lib/Menu.htm#Color
 * ;                      ^^^^^^^^
 *
 * Gui, Add, ListView, cEEAA99, ; https://www.autohotkey.com/docs/v1/lib/ListView.htm
 *
 * GuiControl, +BackgroundFF9977, MyListView ;https://www.autohotkey.com/docs/v1/lib/Gui.htm#Color
 * ;                      ^^^^^^
 * ```
 * ---
 * Add a space after each color option if there are any more options that follow it.
 *
 * For example: `cbRed` `ct900000` `cwBlue` `+BackgroundFF9977`
 */
const colorRegex1 = /(?<=[," \t:=+-]|^)(?:c[btw]?|#|Background)?(?:0x)?([\da-f]{6}(?:[\da-f]{2})?)\b/giu;
// dprint-ignore //                                            ^ split
const colorRegex2 = /(?<=[," \t:=+-]|^)(?:c[btw]?|#|Background)?(?:0x)?(black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua)\b/giu;
//                                   ^ma[0]                    ^ma[1]

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

function bgr2Rgb(s1: string): string {
    const rgba: string | undefined = colorMap.get(s1);
    if (rgba !== undefined) return rgba;

    // BGR case
    //  '#' (BB GG RR) (AA)
    //       01 23 45   67

    const bb = `${s1[0]}${s1[1]}`;
    const gg = `${s1[2]}${s1[3]}`;
    const rr = `${s1[4]}${s1[5]}`;
    const aa: string = s1.length === 8
        ? `${s1[6]}${s1[7]}`
        : 'ff';

    return `${rr}${gg}${bb}${aa}`;
}

function str2Color(ma1: string, isRGB: boolean): vscode.Color {
    const s1: string = ma1.toLowerCase(); // all need toLowerCase
    const s2: string = colorMap.get(s1) ?? s1; // now all is toLowerCase
    const s3: string = isRGB
        ? s2
        : bgr2Rgb(s1);
    // has #RR GG BB  or #RR GG BB AA
    //  '#' (RR GG BB) (AA)
    //       01 23 45   67

    // not has #RGB or #RGBA

    const rr = `${s3[0]}${s3[1]}`;
    const gg = `${s3[2]}${s3[3]}`;
    const bb = `${s3[4]}${s3[5]}`;
    const aa: string = s3.length === 8
        ? `${s3[6]}${s3[7]}`
        : 'ff';

    const r: number = Number.parseInt(rr, 16);
    const g: number = Number.parseInt(gg, 16);
    const b: number = Number.parseInt(bb, 16);
    const a: number = Number.parseInt(aa, 16);

    return new vscode.Color(r / 255, g / 255, b / 255, a / 255);
}

function varNameEQcolorName(AhkFileData: TAhkFileData, range: vscode.Range, nameUp: string): boolean {
    const { AST, ModuleVar } = AhkFileData;

    const eqName3 = getDAWithPos(AST, range.start)?.paramMap.get(nameUp)
        ?? getDAWithPos(AST, range.start)?.valMap.get(nameUp)
        ?? ModuleVar.ModuleValMap.get(nameUp);
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (
        eqName3 !== undefined
        && [...eqName3.defRangeList, ...eqName3.refRangeList]
            .some((value: TVarData): boolean => value.range.contains(range))
    ) {
        return true;
    }

    return false;
}

function provideDocumentColors(document: vscode.TextDocument): vscode.ColorInformation[] {
    const AhkFileData: TAhkFileData | undefined = pm.getDocMap(document.uri.fsPath);
    if (AhkFileData === undefined) return [];
    if (!getConfig().useColorProvider) return [];

    const { DocStrMap } = AhkFileData;
    const ignoreArr: readonly boolean[] = getColorPickerIgnoreList(DocStrMap);
    const arr: vscode.ColorInformation[] = [];
    //
    for (const AhkTokenLine of DocStrMap) {
        const {
            lStr,
            textRaw,
            line,
            multiline,
            detail,
        } = AhkTokenLine;
        const text: string = textRaw.slice(0, lStr.length);

        // 'red'.length === 3
        if (
            text.length < 3
            || multiline !== EMultiline.none
            || ignoreArr[line]
            || detail.includes(EDetail.isLabelLine)
        ) continue;

        for (const ma of [...text.matchAll(colorRegex1), ...text.matchAll(colorRegex2)]) {
            const { index } = ma;
            const ma1: string = ma[1];
            const char: number = ma[0].length - ma1.length + index;

            if (text.at(char + ma1.length) === '(') continue;
            if (text.at(index - 1) === '"') { // "Red"
                // || text.at(index - 2) === '"' // "cRed"
                // || text.at(index - 3) === '"' // "cbRed"

                // 3. lint "0x00000" or "0x000000" if start with `" need and with`"
                const b3: string | undefined = text.at(char + ma1.length);
                if (b3 !== '"') continue;
            }

            const isRGB = !checkBGR(AhkTokenLine);
            const color: vscode.Color = str2Color(ma1, isRGB);
            const range: vscode.Range = new vscode.Range(
                new vscode.Position(line, char),
                new vscode.Position(line, char + ma1.length),
            );

            if (
                varNameEQcolorName(AhkFileData, range, ToUpCase(ma1))
                || varNameEQcolorName(AhkFileData, range, ToUpCase(ma[0]))
                //
            ) {
                continue; // check val/param def
            }

            const exMsgBox: vscode.Hover | null = hoverMsgBoxMagicNumber(AhkTokenLine, range.start);
            if (exMsgBox !== null) continue;

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
    if (!getConfig().useColorProvider) return [];
    //
    const AhkTokenLine: TAhkTokenLine = AhkFileData.DocStrMap[context.range.start.line];
    const isRGB = !checkBGR(AhkTokenLine);

    const {
        red,
        green,
        blue,
        alpha,
    } = color;

    const rgbRaw: string = `${toBase16(red * 255)}${toBase16(green * 255)}${toBase16(blue * 255)}`.toLowerCase();
    const rgb: string = isRGB
        ? `${toBase16(red * 255)}${toBase16(green * 255)}${toBase16(blue * 255)}`.toLowerCase()
        : `${toBase16(blue * 255)}${toBase16(green * 255)}${toBase16(red * 255)}`.toLowerCase(); // BGR
    const a: string = toBase16(alpha * 255).toLowerCase();

    const rgba: string = a === 'ff'
        ? rgb
        : `${rgb}${a}`;

    const arr: vscode.ColorPresentation[] = [new vscode.ColorPresentation(rgba)];

    if (rgba !== rgba.toUpperCase()) {
        arr.push(new vscode.ColorPresentation(rgba.toUpperCase()));
    }

    if (a === 'ff') {
        for (const [k, v] of colorMap) {
            if (v === rgbRaw) {
                arr.push(
                    new vscode.ColorPresentation(k[0].toUpperCase() + k.slice(1)),
                    new vscode.ColorPresentation(k),
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
