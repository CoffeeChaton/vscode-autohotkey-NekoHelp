// eslint-disable-next-line require-await
export async function sleep(time: number): Promise<void> {
    // eslint-disable-next-line promise/avoid-new
    return new Promise<void>((resolve): void => {
        setTimeout(resolve, time);
    });
}
