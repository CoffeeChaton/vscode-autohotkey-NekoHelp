export function callDeep2(lStrTrim: string, deep: number): number[] {
    const deepList: number[] = [deep];
    let d = deep;
    for (const s of lStrTrim) {
        switch (s) {
            case ' ':
            case '\t':
                break;

            case '{':
                d++;
                deepList.push(d);
                break;
            case '}':
                d--;
                deepList.push(d);
                break;

            default:
                if (lStrTrim.endsWith('{')) {
                    d++;
                    deepList.push(d);
                }
                return deepList;
        }
    }
    return deepList;
}
