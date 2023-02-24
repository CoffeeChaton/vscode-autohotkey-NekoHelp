import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { CMemo } from '../CMemo';
import { getFileAllFunc } from './getFileAllFuncList';

export type TFnMap = ReadonlyMap<string, CAhkFunc>;

const FileAllFuncMemo = new CMemo<TAstRoot, TFnMap>((ASTRoot: TAstRoot): TFnMap => {
    type TMapMake = [string, CAhkFunc];
    return new Map<string, CAhkFunc>(
        getFileAllFunc.up(ASTRoot)
            .map((ahkFunc: CAhkFunc): TMapMake => [ahkFunc.upName, ahkFunc]),
    );
});

export function getFileAllFuncMap(ASTRoot: TAstRoot): TFnMap {
    return FileAllFuncMemo.up(ASTRoot);
}
