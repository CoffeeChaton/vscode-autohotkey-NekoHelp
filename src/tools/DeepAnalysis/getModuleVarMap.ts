import * as path from 'node:path';
import type * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type {
    CAhkFunc,
    TParamMapIn,
    TTextMapIn,
    TTextMapOut,
    TValMapIn,
    TValMapOut,
    TValMetaIn,
} from '../../AhkSymbol/CAhkFunc';

import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import type { TGValMap } from '../../core/ParserTools/ahkGlobalDef';
import type { TTokenStream } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import { ToUpCase } from '../str/ToUpCase';
import { getFileAllClass } from '../visitor/getFileAllClassList';
import { getFileAllFunc } from '../visitor/getFileAllFuncList';
import { wrapFnValDef } from './FnVar/def/wrapFnValDef';
import { EFnMode } from './FnVar/EFnMode';
import { getFnVarDef } from './FnVar/getFnVarDef';
import { getDAListTop } from './getDAList';
import { getUnknownTextMap } from './getUnknownTextMap';
import { pushDef } from './pushDef';
import { pushRef } from './pushRef';

export type TModuleVar = {
    readonly ModuleValMap: TValMapOut,
    readonly ModuleTextMap: TTextMapOut,
    readonly allowList: readonly boolean[],
};

function getModuleAllowList(DocStrMap: TTokenStream, Ast: TAstRoot): readonly boolean[] {
    const rangeList: readonly vscode.Range[] = [
        ...getFileAllClass(Ast),
        ...getFileAllFunc.up(Ast),
    ]
        .map((TopSymbol: CAhkClass | CAhkFunc): vscode.Range => TopSymbol.range);

    if (rangeList.length === 0) {
        return DocStrMap.map((): true => true);
    }

    let i = 0; // refer to rangeList i
    const allowList: boolean[] = Array.from({ length: DocStrMap.length });

    allowList.fill(true);

    // wtf style..
    for (const { line, detail } of DocStrMap) {
        if (detail.includes(EDetail.isLabelLine)) {
            allowList[line] = false;
            continue;
        }
        if (line < rangeList[i].start.line) {
            // none   allowList[line] = true;
        } else if (line >= rangeList[i].start.line && line <= rangeList[i].end.line) {
            allowList[line] = false;
        } else if (line > rangeList[i].end.line) {
            if ((i + 1) < rangeList.length) {
                i++;
            } else {
                break;
            }

            // fix this line is next func() start.line
            if (line < rangeList[i].start.line) {
                // none  allowList[line] = true;
            } else if (line >= rangeList[i].start.line && line <= rangeList[i].end.line) {
                allowList[line] = false;
            }
        }
    }

    return allowList;
}

function moveGValMap2ModuleMap(GValMap: TGValMap, ModuleValMap: TValMapIn): void {
    for (const [upName, { defRangeList, refRangeList }] of GValMap) {
        for (const { rawName, range } of defRangeList) {
            const oldDef: TValMetaIn | undefined = ModuleValMap.get(ToUpCase(rawName));
            if (oldDef === undefined) {
                const value: TValMetaIn = wrapFnValDef({
                    RawNameNew: rawName,
                    valMap: ModuleValMap,
                    defRange: range,
                    lineComment: '',
                    fnMode: EFnMode.global,
                    Associated: null,
                });
                ModuleValMap.set(upName, value);
            } else {
                pushDef(oldDef, rawName, range.start.line, range.start.character);
            }
        }

        //
        for (const { rawName, range } of refRangeList) {
            const oldDef: TValMetaIn | undefined = ModuleValMap.get(ToUpCase(rawName));
            if (oldDef !== undefined) {
                pushRef(oldDef, rawName, range.start.line, range.start.character);
            }
        }
    }
}

function moveTextMap2ModuleMap(AST: TAstRoot, valMap: TValMapIn): void {
    for (const vv of getDAListTop(AST)) {
        const textMapRW: TTextMapIn = vv.textMap as TTextMapIn; // eval
        if (vv.fnMode === EFnMode.forceLocal) continue;
        for (const [k, v] of textMapRW) {
            const oldVal: TValMetaIn | undefined = valMap.get(k);
            if (oldVal === undefined) continue;
            oldVal.refRangeList.push(...v.refRangeList);
            textMapRW.delete(k); // eval
        }
    }
}

export function getModuleVarMap(
    DocStrMap: TTokenStream,
    GValMap: TGValMap,
    AST: TAstRoot,
    fsPath: string,
): TModuleVar {
    const AhkTokenList: TTokenStream = DocStrMap;
    const paramMap: TParamMapIn = new Map();
    const name: string = path.basename(fsPath);

    const allowList: readonly boolean[] = getModuleAllowList(DocStrMap, AST);
    // dprint-ignore
    const { valMap: ModuleValMap } = getFnVarDef(allowList, AhkTokenList, paramMap, new Map(), EFnMode.global, DocStrMap);
    const ModuleTextMap: TTextMapIn = getUnknownTextMap(allowList, AhkTokenList, paramMap, ModuleValMap, GValMap, name);

    moveGValMap2ModuleMap(GValMap, ModuleValMap);
    moveTextMap2ModuleMap(AST, ModuleValMap);

    return {
        ModuleValMap,
        ModuleTextMap,
        allowList,
    };
}
