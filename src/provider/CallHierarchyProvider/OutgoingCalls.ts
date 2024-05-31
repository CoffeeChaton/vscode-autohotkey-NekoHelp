import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { getAllClass } from '../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { fileFuncRef } from '../Def/getFnRef';
import { classRefOnePage } from '../Def/searchAllClassRef';

function OutgoingCalls_core(item: vscode.CallHierarchyItem): vscode.CallHierarchyOutgoingCall[] {
    const SourceSymbol: CAhkFunc | CAhkClass | null | undefined = item.kind === vscode.SymbolKind.Function
        ? getFuncWithName(ToUpCase(item.name))
        : getAllClass().get(ToUpCase(item.name));
    if (SourceSymbol === null || SourceSymbol === undefined) {
        return [];
    }

    const AhkFileData: TAhkFileData | undefined = pm.DocMap.get(SourceSymbol.uri.fsPath);
    if (AhkFileData === undefined) return [];

    const need: vscode.CallHierarchyOutgoingCall[] = [];

    // in range call func
    for (const [k, v] of fileFuncRef.up(AhkFileData)) {
        for (const funcRef of v) {
            const { line, col } = funcRef;
            const pos = new vscode.Position(line, col);
            if (SourceSymbol.range.contains(pos) && !SourceSymbol.selectionRange.contains(pos)) {
                const DA: CAhkFunc | null = getFuncWithName(k);
                if (DA === null) continue;

                const range = new vscode.Range(pos, new vscode.Position(line, col + k.length));
                need.push(
                    new vscode.CallHierarchyOutgoingCall(
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
                break; // ...
            }
        }
    }

    // in range call class
    for (const ahkClass of getAllClass().values()) {
        const loc0: vscode.Location | undefined = classRefOnePage(ahkClass, AhkFileData)
            .find((loc: vscode.Location): boolean => SourceSymbol.range.contains(loc.range));
        if (loc0 === undefined) continue;
        need.push(
            new vscode.CallHierarchyOutgoingCall(
                new vscode.CallHierarchyItem(
                    vscode.SymbolKind.Function,
                    ahkClass.name,
                    '', // detail
                    ahkClass.uri,
                    ahkClass.range,
                    ahkClass.selectionRange,
                ),
                [loc0.range],
            ),
        );
    }

    //
    return need;
}

export function OutgoingCalls(
    item: vscode.CallHierarchyItem,
    _token: vscode.CancellationToken,
): vscode.CallHierarchyOutgoingCall[] {
    if (
        item.kind === vscode.SymbolKind.Function
        || item.kind === vscode.SymbolKind.Class
    ) {
        return OutgoingCalls_core(item);
    }

    //
    return [];
}
