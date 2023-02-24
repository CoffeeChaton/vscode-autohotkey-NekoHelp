import * as vscode from 'vscode';
import type { TAstRoot, TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { pm } from '../../core/ProjectManager';
import { CMemo } from '../../tools/CMemo';

// dprint-ignore
const DocSymbol2SymbolInfo = new CMemo<TAstRoot, vscode.SymbolInformation[]>( // 4ms -> 0ms
    (AstRoot: TAstRoot): vscode.SymbolInformation[] => AstRoot.map((AhkSymbol: TTopSymbol): vscode.SymbolInformation => {
        const {
            name,
            kind,
            range,
            detail,
            uri,
        } = AhkSymbol;

        let nameFix = name;
        switch (kind) {
            case vscode.SymbolKind.Class:
                nameFix = `class ${name}`;
                break;
            case vscode.SymbolKind.Function:
                nameFix = `fn ${name}()`;
                break;
            case vscode.SymbolKind.Namespace:
                nameFix = `label ${name}`;
                break;
            case vscode.SymbolKind.Event:
                // eslint-disable-next-line sonarjs/no-nested-switch
                switch (detail) {
                    case 'HotKeys':
                        nameFix = `HK ${name}`;
                        break;
                    case 'HotString':
                        nameFix = `HS ${name}`;
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

        return new vscode.SymbolInformation(nameFix, kind, detail, new vscode.Location(uri, range));
    })
);

function WorkspaceSymbolCore(): vscode.SymbolInformation[] {
    const result: vscode.SymbolInformation[] = [];

    for (const { AST } of pm.DocMap.values()) { // keep output order is OK
        result.push(...DocSymbol2SymbolInfo.up(AST));
    }

    return result;
}

/**
 * ctrl + T, go to Symbol in Workspace
 */
export const WorkspaceSymbolProvider: vscode.WorkspaceSymbolProvider = {
    provideWorkspaceSymbols(
        _query: string,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.SymbolInformation[]> {
        return WorkspaceSymbolCore();
    },
};
