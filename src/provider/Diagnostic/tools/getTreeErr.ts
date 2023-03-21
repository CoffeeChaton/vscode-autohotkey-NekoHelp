import type { TAhkSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import type { TTokenStream } from '../../../globalEnum';
import type { CDiagBase } from './CDiagBase';
import { getDirectivesErr } from './TreeErr/getDirectivesErr';
import { getLabelErr } from './TreeErr/getLabelErr';
import { getSwErr } from './TreeErr/getSwErr';

export function getTreeErr(
    children: readonly TAhkSymbol[],
    displayErr: readonly boolean[],
    DocStrMap: TTokenStream,
): CDiagBase[] {
    const digS: CDiagBase[] = [];
    for (const ch of children) {
        if (displayErr[ch.range.start.line]) {
            digS.push(
                ...getSwErr(ch, DocStrMap),
                ...getLabelErr(ch),
                ...getDirectivesErr(ch),
            );
        }
        digS.push(
            ...getTreeErr(ch.children, displayErr, DocStrMap),
        );
    }
    return digS;
}
