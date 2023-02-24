import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getDAListTop } from './getDAList';

export function getDAWithPos(
    AstRoot: TAstRoot,
    position: vscode.Position,
): CAhkFunc | null {
    const MethodOrFunc: CAhkFunc | undefined = getDAListTop(AstRoot)
        .find((top: CAhkFunc): boolean => top.range.contains(position));

    return MethodOrFunc === undefined
        ? null
        : MethodOrFunc;
}
