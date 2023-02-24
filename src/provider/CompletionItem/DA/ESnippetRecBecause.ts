export const enum ESnippetRecBecause {
    paramNeverUsed = 'param is assigned but never used.\n\n',
    paramStartWith = 'param start with(Case Sensitive)\n\n',
    varStartWith = 'var start with(Case Sensitive)\n\n',
}

type TKeyRawName = string;
export type TSnippetRecMap = Map<TKeyRawName, ESnippetRecBecause>;
