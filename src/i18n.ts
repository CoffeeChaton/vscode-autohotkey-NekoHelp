import * as vscode from 'vscode';
import * as en from '../i18n/en.json';
import * as cn from '../i18n/zh-cn.json';
import * as tw from '../i18n/zh-tw.json';
import { getConfig } from './configUI';

const i18nObj: typeof en = ((): typeof en => {
    const mode: 'en' | 'zh-cn' | 'auto' = getConfig().docLanguage;
    if (mode === 'en') return en;
    if (mode === 'zh-cn') return cn;

    // auto
    const { language } = vscode.env;
    if (language === 'zh-cn') return cn;
    if (language === 'zh-tw') return tw;

    return en;
})();

type Ti18nStr = keyof typeof en;

export function $t(i18nStr: Ti18nStr): string {
    // eslint-disable-next-line no-nested-ternary
    const s: string | string[] = i18nObj[i18nStr];

    return Array.isArray(s)
        ? s.join('\n')
        : s;
}
