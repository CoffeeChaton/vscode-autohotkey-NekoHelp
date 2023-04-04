import type { TFmtCore } from './FormatType';

export function ToFmtCore({ line, textRaw, newText }: { line: number, textRaw: string, newText: string }): TFmtCore {
    return {
        line,
        oldText: textRaw,
        newText,
        hasOperatorFormat: newText.trim() !== textRaw.trim(),
    };
}
