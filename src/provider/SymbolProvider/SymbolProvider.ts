import * as path from 'node:path';
import type * as vscode from 'vscode';
import { CAhkInclude } from '../../AhkSymbol/CAhkInclude';
import type { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { getConfig, needDiag, setStatusBarText } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { isAhkTab } from '../../tools/fsTools/isAhk';
import { digDAFile } from '../Diagnostic/digDAFile';
import { setBaseDiag } from '../Diagnostic/setBaseDiag';

function SymbolProviderCore(document: vscode.TextDocument): vscode.DocumentSymbol[] {
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return [];

    const { AST, uri } = AhkFileData;
    if (isAhkTab(uri) && needDiag()) {
        setBaseDiag(AhkFileData);
        digDAFile(AhkFileData);
    }

    setStatusBarText(path.basename(document.uri.fsPath), pm.DocMap.size);

    const { useSymbolProvider, showInclude } = getConfig().SymbolProvider;
    if (!useSymbolProvider) return [];

    return showInclude
        ? [...AST]
        : [...AST].filter((topSymbol: TTopSymbol): boolean => !(topSymbol instanceof CAhkInclude));
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
