/* cSpell:disable */

/**
 * FindExprDelim: The successor to FindNextDelimiter(), ported from the v2 branch.
 *
 * Returns the index of the next delimiter, taking into account quotes, parentheses, etc.
 *
 * If the delimiter is not found, returns the length of aBuf.
 * @param aBuf LPCTSTR
 * @param aDelimiter TCHAR
 * @param aStartIndex Int
 * @returns Returns the index of the next delimiter, If not found, returns the length of aBuf.
 * @from https://github.com/Lexikos/AutoHotkey_L/blob/master/source/util.cpp#L2788
 */
export function FindExprDelim(aBuf: string, aDelimiter: string, aStartIndex: number): number {
    let close_char = '';

    for (let mark = aStartIndex; mark <= aBuf.length; ++mark) {
        if (aBuf[mark] === aDelimiter && (aDelimiter !== ':' || aBuf[mark + 1] !== '=')) return mark;

        switch (aBuf[mark]) {
            case undefined: // '\0':
                // Reached the end of the string without finding a delimiter.  Return the
                // index of the null-terminator since that's typically what the caller wants.
                return mark;
            case '"':
                do {
                    ++mark;
                    // if (!aBuf[mark])
                    if (mark > aBuf.length) return mark; // See case '\0' for comments.
                } while (aBuf[mark] !== '"');
                continue;
            case ')':
            case ']':
            case '}':
                if (aDelimiter !== ':') { // Caller wants to find a specific symbol and it's not this one.
                    continue;
                } // Unbalanced parentheses etc are caught at a later stage.
                return mark;
            case ':':
                if (aBuf[mark + 1] === '=') continue;
                // // Since aDelimiter is zero, this colon doesn't belong to a ternary expression
                // // or object literal which is part of this sub-expression, so should effectively
                // // terminate the sub-expression (likely a fat arrow function).
                // return mark;
                continue;
            case '?':
                if (aDelimiter !== ':') continue; // The following isn't needed in this case.
                // Scan for the corresponding ':' (or some other closing symbol if that's missing)
                // so that it won't terminate the sub-expression.
                mark = FindExprDelim(aBuf, ':', mark + 1);
                //    if (!aBuf[mark]) {
                if (mark > aBuf.length) { // i.e. it isn't safe to do ++mark.
                    return mark;
                } // See case '\0' for comments.
                continue; // The colon is also skipped via the loop's increment.
            case '(':
                close_char = ')';
                break;
            case '[':
                close_char = ']';
                break;
            case '{':
                close_char = '}';
                break;
            default:
                // case '`': // May indicate an attempt to escape something when aLiteralMap==NULL, but escape has no meaning here.
                // Not a meaningful character; just have the loop skip over it.
                continue;
        }
        // Since above didn't "return" or "continue":
        mark = FindExprDelim(aBuf, close_char, mark + 1);
        if (mark > aBuf.length) { // i.e. it isn't safe to do ++mark.
            return mark;
        } // See case '\0' for comments.
        // Otherwise, continue the loop.
    } // for each character.

    return aBuf.length;
}
