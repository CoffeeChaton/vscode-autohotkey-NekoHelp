/* eslint-disable @typescript-eslint/no-explicit-any */
// -------------

export function debounce<Params extends any[]>(
    func: (...args: Params) => any,
    timeout: number,
): (...args: Params) => void {
    // eslint-disable-next-line init-declarations
    let timer: NodeJS.Timeout;
    return (...args: Params) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
}
