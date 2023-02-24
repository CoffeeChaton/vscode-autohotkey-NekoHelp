import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';

export function isPosAtMethodName(DA: CAhkFunc | null, position: vscode.Position): boolean {
    return DA !== null
        && DA.kind === vscode.SymbolKind.Method
        && DA.nameRange.contains(position);
}
