/* eslint no-magic-numbers: ["error", { "ignore": [-5,-1,0,1,10] }] */
import * as vscode from 'vscode';
import type { TAstRoot, TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import type { TFsPath, TTokenStream } from '../../globalEnum';
import type { TModuleVar } from '../../tools/DeepAnalysis/getModuleVarMap';
import { getModuleVarMap } from '../../tools/DeepAnalysis/getModuleVarMap';
import { isAhk } from '../../tools/fsTools/isAhk';
import { getChildren } from '../getChildren';
import { getClass } from '../getClass';
import { ParserBlock } from '../Parser';
import { Pretreatment } from '../Pretreatment';
import type { TGValMap, TGValMapReadOnly } from './ahkGlobalDef';
import { ahkGlobalMain } from './ahkGlobalDef';
import { getFunc } from './ParserFunc';
import { ParserHotKey } from './ParserHotKey';
import { ParserHotStr } from './ParserHotStr';
import { ParserLine } from './ParserLine';

/**
 * Never user this, just for Memo...
 */
class CTopClass extends vscode.DocumentSymbol {
    declare public readonly children: TTopSymbol[];
}

export type TMemo = Readonly<{
    readonly AST: TAstRoot,
    readonly DocStrMap: TTokenStream,
    readonly DocFullSize: number,
    readonly uri: vscode.Uri,
    readonly ModuleVar: TModuleVar,
    readonly GValMap: TGValMapReadOnly,
    readonly ms: number,
}>;

function strListDeepEq(DocStrMap: TTokenStream, fullTextList: readonly string[]): boolean {
    const len: number = DocStrMap.length;
    if (len !== fullTextList.length) return false;
    for (let i = 0; i < len; i++) {
        if (fullTextList[i].length !== DocStrMap[i].textRaw.length) return false;
        if (fullTextList[i] !== DocStrMap[i].textRaw) return false;
    }
    return true;
}

export const BaseScanMemo = {
    memo: new Map<TFsPath, TMemo[]>(),

    memoSizeFix(fsPath: TFsPath): TMemo[] {
        const oldCache: TMemo[] | undefined = this.memo.get(fsPath);

        for (const [key, value] of this.memo) {
            if (key === fsPath) continue;

            const tempVal: TMemo | undefined = value.at(-1); // last
            if (tempVal !== undefined) {
                value.length = 0;
                value.push(tempVal);
            }
        }

        if (oldCache === undefined) return [];

        return oldCache.length > 10
            ? oldCache.slice(-5)
            : oldCache;
    },

    setMemo(fsPath: TFsPath, AhkCache: TMemo): void {
        if (!isAhk(fsPath)) return;

        const oldCache: TMemo[] = this.memoSizeFix(fsPath);
        oldCache.push(AhkCache);
        this.memo.set(fsPath, oldCache);
    },

    getMemo(fsPath: TFsPath, fullTextList: readonly string[], DocFullSize: number): TMemo | undefined {
        return this.memo
            .get(fsPath)
            ?.find((v: TMemo): boolean => v.DocFullSize === DocFullSize && strListDeepEq(v.DocStrMap, fullTextList));
    },

    clear(): void {
        this.memo.clear();
    },
} as const;

export function getFileAST(document: vscode.TextDocument): TMemo | 'isAhk2' {
    const t1: number = Date.now();
    const fullText: string = document.getText();
    const fullTextList: string[] = fullText.split(/\r?\n/u);
    if (fullTextList.at(-1)?.trim() !== '') fullTextList.push('');

    const DocFullSize: number = fullText.length;
    const { uri } = document;
    const { fsPath } = uri;

    const oldCache: TMemo | undefined = BaseScanMemo.getMemo(fsPath, fullTextList, DocFullSize);
    if (oldCache !== undefined) return oldCache;

    const DocStrMap: TTokenStream | 'isAhk2' = Pretreatment(fullTextList, document);
    if (DocStrMap === 'isAhk2') return 'isAhk2';

    const GValMap: TGValMap = ahkGlobalMain(DocStrMap);
    const AST: TAstRoot = getChildren<CTopClass>(
        [getClass, getFunc, ParserBlock.getSwitchBlock, ParserHotStr, ParserLine, ParserHotKey],
        {
            DocStrMap,
            RangeStartLine: 0,
            RangeEndLine: DocStrMap.length,
            defStack: [],
            uri,
            GValMap,
        },
    );

    const ModuleVar: TModuleVar = getModuleVarMap(DocStrMap, GValMap, AST, fsPath);
    const AhkCache: TMemo = {
        DocStrMap,
        AST,
        DocFullSize,
        uri,
        ModuleVar,
        GValMap,
        ms: Date.now() - t1,
    };
    BaseScanMemo.setMemo(fsPath, AhkCache);

    // const ms = Date.now() - t1;
    // if (ms > 30) {
    //     .log('getFileAST', { ms, fsPath });
    // }

    // {
    //     13k line, 13921 line
    //     "ms": 360 ~ 370, (20 cycles)
    //     "fsPath": ... "AHK-Studio-master\\AHK-Studio.ahk"
    // }

    // {
    //     8K line ,8979 line
    //     "ms": 46~48, (20 cycles)
    //     "fsPath": ... "Lib\\Gdip_all_2020_08_24.ahk"
    // }

    return AhkCache;
}
