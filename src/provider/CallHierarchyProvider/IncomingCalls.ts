import * as path from 'node:path';
import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { getAllClass } from '../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { getFileAllClass } from '../../tools/visitor/getFileAllClassList';
import { getFileAllFunc } from '../../tools/visitor/getFileAllFuncList';
import { RefLike2Location } from '../Def/getFnRef';
import { searchAllClassRef } from '../Def/searchAllClassRef';

function IncomingCalls_core(
    item: vscode.CallHierarchyItem,
): vscode.CallHierarchyIncomingCall[] {
    const SourceSymbol: CAhkFunc | CAhkClass | null | undefined = item.kind === vscode.SymbolKind.Function
        ? getFuncWithName(ToUpCase(item.name))
        : getAllClass().get(ToUpCase(item.name));
    if (SourceSymbol === null || SourceSymbol === undefined) {
        return [];
    }

    const Locations: readonly vscode.Location[] = SourceSymbol instanceof CAhkFunc
        ? RefLike2Location(SourceSymbol)
        : searchAllClassRef(SourceSymbol);
    const need: vscode.CallHierarchyIncomingCall[] = [];

    for (const { uri, range } of Locations) {
        const AhkFileData: TAhkFileData | undefined = pm.DocMap.get(uri.fsPath);
        if (AhkFileData === undefined) continue;

        if (uri.fsPath === SourceSymbol.uri.fsPath && SourceSymbol.selectionRange.contains(range)) {
            continue; // def pos
        }

        const { AST } = AhkFileData;
        //  const DA: CAhkFunc | undefined = getDAListTop(AST)
        const DA: CAhkFunc | undefined = getFileAllFunc.up(AST)
            .find((DA0: CAhkFunc): boolean => DA0.range.contains(range) && !DA0.nameRange.contains(range));
        if (DA !== undefined) {
            need.push(
                new vscode.CallHierarchyIncomingCall(
                    new vscode.CallHierarchyItem(
                        vscode.SymbolKind.Function,
                        DA.name,
                        '', // detail
                        DA.uri,
                        DA.range,
                        DA.selectionRange,
                    ),
                    [range],
                ),
            );
            continue;
        }

        const AhkClass: CAhkClass | undefined = getFileAllClass(AST)
            .find((c: CAhkClass): boolean => c.range.contains(range));
        if (AhkClass !== undefined) {
            need.push(
                new vscode.CallHierarchyIncomingCall(
                    new vscode.CallHierarchyItem(
                        vscode.SymbolKind.Class,
                        AhkClass.name,
                        '', // detail
                        AhkClass.uri,
                        AhkClass.range,
                        AhkClass.selectionRange,
                    ),
                    [range],
                ),
            );
            continue;
        }
        // unknown
        need.push(
            new vscode.CallHierarchyIncomingCall(
                new vscode.CallHierarchyItem(
                    vscode.SymbolKind.File,
                    path.basename(uri.fsPath),
                    '',
                    uri,
                    range,
                    range,
                ),
                [range],
            ),
        );
    }

    return need;
}

export function IncomingCalls(
    item: vscode.CallHierarchyItem,
    _token: vscode.CancellationToken,
): vscode.CallHierarchyIncomingCall[] {
    if (
        item.kind === vscode.SymbolKind.Function
        || item.kind === vscode.SymbolKind.Class
    ) {
        return IncomingCalls_core(item);
    }

    //
    return [];
}
