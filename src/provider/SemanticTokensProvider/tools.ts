import type * as vscode from 'vscode';

/*
 * https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers
 * Standard token types:
 */
export const TokenTypes = [
    'namespace',
    'class',
    'enum',
    'interface',
    'struct',
    'typeParameter',
    'type',
    'parameter',
    'variable',
    'property',
    'enumMember',
    'decorator',
    'event',
    'function',
    'method',
    'macro',
    'label',
    'comment',
    'string',
    'keyword',
    'number',
    'regexp',
    'operator',
] as const;

// Standard token modifiers:
export const TokenModifiers = [
    'declaration',
    'definition',
    'readonly',
    'static',
    'deprecated',
    'abstract',
    'async',
    'modification',
    'documentation',
    'defaultLibrary',
] as const;

/**
 * exp
 * ```js
 * {
 * range,
 * tokenType:'parameter',
 * tokenModifiers:[],
 * }
 * ```
 */
export type TSemanticTokensLeaf = {
    /**
     * The range of the token. Must be single-line.
     */
    range: vscode.Range,

    /**
     * tokenType The token type.
     */
    tokenType: typeof TokenTypes[number],

    /**
     * tokenModifiers The token modifiers.
     */
    tokenModifiers: (typeof TokenModifiers[number])[] | [],
};

export function pushToken(token: TSemanticTokensLeaf[], tokensBuilder: vscode.SemanticTokensBuilder): void {
    for (const { range, tokenType, tokenModifiers } of token) {
        tokensBuilder.push(
            range,
            tokenType,
            tokenModifiers,
        );
    }
}
