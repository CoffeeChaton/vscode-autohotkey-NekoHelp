export function inCommentBlock(textTrimStart: string, CommentBlock: boolean): boolean {
    if (CommentBlock) {
        if (textTrimStart.startsWith('*/')) {
            return false;
        }
    } else if (textTrimStart.startsWith('/*')) {
        return true;
    }
    return CommentBlock;
}

/* eslint-disable no-magic-numbers */
export const enum EDocBlock {
    other = 0, // false
    inDocCommentBlockStart = 1, // /**
    inDocCommentBlockMid = 2, //
    inDocCommentBlockEnd = 3, // */
}

export function docCommentBlock(textRawTrim: string, flag: EDocBlock): EDocBlock {
    if (
        flag === EDocBlock.other
        || flag === EDocBlock.inDocCommentBlockEnd
    ) {
        return textRawTrim.startsWith('/**') // textRaw.indexOf('/**') > -1
            ? EDocBlock.inDocCommentBlockStart
            : EDocBlock.other;
    }

    // if (
    //     flag === EDocBlock.inDocCommentBlockStart
    //     || flag === EDocBlock.inDocCommentBlockMid // i know this always true
    // ) {
    return textRawTrim.startsWith('*/') // textRaw.indexOf('*/') > -1
        ? EDocBlock.inDocCommentBlockEnd
        : EDocBlock.inDocCommentBlockMid;
}
