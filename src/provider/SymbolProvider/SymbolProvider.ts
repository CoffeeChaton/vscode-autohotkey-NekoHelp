import * as path from 'node:path';
import type * as vscode from 'vscode';
import { needDiag, showTimeSpend, useSymbolProvider } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';
import { isAhkTab } from '../../tools/fsTools/isAhk';
import { setBaseDiag } from '../Diagnostic/setBaseDiag';

function SymbolProviderCore(document: vscode.TextDocument): vscode.DocumentSymbol[] {
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return [];

    const { AST, uri } = AhkFileData;
    if (isAhkTab(uri) && needDiag()) {
        setBaseDiag(AhkFileData);
        digDAFile(AhkFileData);
    }

    showTimeSpend(path.basename(document.uri.fsPath));

    return useSymbolProvider()
        ? [...AST]
        : [];
}

export const SymbolProvider: vscode.DocumentSymbolProvider = {
    provideDocumentSymbols(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        return SymbolProviderCore(document);
    },
    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
};
