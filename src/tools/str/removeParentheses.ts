export function removeParentheses(lStr: string): string {
    let textFix = '';
    let deep = 0;
    const sL = lStr.length;
    for (let i = 0; i < sL; i++) {
        switch (lStr[i]) {
            case '(':
                deep++;
                textFix += '_';
                break;
            case ')':
                deep--;
                textFix += '_';
                break;
            default:
                textFix += deep === 0
                    ? lStr[i]
                    : '_';
                break;
        }
    }
    return textFix;
}
