export function arrSum(arr: number[]): number {
    let ed = 0;
    for (const number of arr) {
        ed += number;
    }
    return ed;
}

export function stdDevFn(arr: number[]): number {
    const len: number = arr.length;
    const avg: number = arrSum(arr) / len;
    const s2: number = arrSum(arr.map((n) => (n - avg) ** 2)) / (len - 1);
    return s2 ** (1 / 2);
}

// 166, 170, 164, 165, 166, 165, 165, 165, 165, 165, 163, 162, 165, 165, 164, 164, 164, 164, 164, 166
// σ 1.52561463024
// s 1.56524758425

type TAvgMin5 = {
    subAvg: number,
    subAvgArr: number[],
};

export function avgMin5(arr: readonly number[]): TAvgMin5 {
    const magic = 5;

    let result: TAvgMin5 = {
        subAvg: 999,
        // eslint-disable-next-line no-magic-numbers
        subAvgArr: [999],
    };

    const lenMax = arr.length - magic;
    for (let i = 0; i < lenMax; i++) {
        const subArr: number[] = arr.slice(i, i + magic);
        const subAvg: number = arrSum(subArr) / magic;

        if (result.subAvg > subAvg) {
            result = {
                subAvg,
                subAvgArr: subArr,
            };
        }
    }

    return result;
}

type TStdMin5 = {
    subStd: number,
    subStdArr: number[],
};

export function stdMin5(arr: readonly number[]): TStdMin5 {
    const magic = 5;

    let result: TStdMin5 = {
        subStd: 999,
        // eslint-disable-next-line no-magic-numbers
        subStdArr: [999],
    };

    const lenMax = arr.length - magic;
    for (let i = 0; i < lenMax; i++) {
        const subStdArr: number[] = arr.slice(i, i + magic);
        const subStd: number = stdDevFn(subStdArr);

        if (result.subStd > subStd) {
            result = {
                subStd,
                subStdArr,
            };
        }
    }

    return result;
}
