import type * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { SignatureCmd } from './SignatureCmd';
import { SignatureFunc } from './SignatureFunc';

function SignatureHelpProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.SignatureHelp | null {
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) return null;

    return SignatureFunc(AhkFileData, position)
        ?? SignatureCmd(AhkFileData, position);
}

// just of 1

export const SignatureHelpProvider: vscode.SignatureHelpProvider = {
    provideSignatureHelp(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        _context: vscode.SignatureHelpContext,
    ): vscode.ProviderResult<vscode.SignatureHelp> {
        return SignatureHelpProviderCore(document, position);
    },
};
