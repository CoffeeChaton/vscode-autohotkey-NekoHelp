import type { TTokenStream } from '../../../globalEnum';
import type { CDiagBase } from './CDiagBase';
import { getCommandErr } from './lineErr/getCommandErr';

export function getLineErr(DocStrMap: TTokenStream): CDiagBase[] {
    const errList: CDiagBase[] = [];

    for (const token of DocStrMap) {
        if (!token.displayErr) continue;

        const ed2: CDiagBase | null = getCommandErr(token);
        if (ed2 !== null) errList.push(ed2);
    }

    return errList;
}
