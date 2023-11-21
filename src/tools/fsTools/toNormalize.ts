import * as path from 'node:path';

export function toNormalize(mayPath: string): string {
    return path.normalize(mayPath)
        .replace(/^[a-z]/u, (a: string): string => a.toUpperCase());
}
