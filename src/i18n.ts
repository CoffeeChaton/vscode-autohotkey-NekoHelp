import * as vscode from 'vscode';
import * as en from '../i18n/en.json';
import * as cn from '../i18n/zh-cn.json';
import { getConfig } from './configUI';

type TLanguage = 'en' | 'zh-cn';
export const localeLanguage: TLanguage = ((): TLanguage => {
    const mode: 'en' | 'zh-cn' | 'auto' = getConfig().docLanguage;
    if (mode === 'en') return 'en';
    if (mode === 'zh-cn') return 'zh-cn';

    // auto
    const { language } = vscode.env;

    if (language === 'en') return 'en';
    if (language === 'en-US') return 'en';
    if (language === 'zh-cn') return 'zh-cn';
    if (language === 'zh-tw') return 'zh-cn'; // if all languages is call zh-cn, then make it TODO

    return 'en';
})();

type Ti18nStr = keyof typeof en;

export function $t(i18nStr: Ti18nStr): string {
    const s: string | string[] = localeLanguage === 'zh-cn'
        ? cn[i18nStr]
        : en[i18nStr];

    return Array.isArray(s)
        ? s.join('\n')
        : s;
}
