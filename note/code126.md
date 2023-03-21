# code126

```js
126: {
    msg: '`%` variable name contains an illegal character',
    path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/main/note#diag126',
},
```

![diag126](./img/diag126.png)

> - [Multiline](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section) style1 / exp1 just support `%varName%` style.
> - try to write like line `11` `12` `13`, this error is at line `11`, but ahk-L report error at line `6`.

if [Multiline](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section) is very big, this diagnostic can help you to find the problem more quickly.

> try it [diag126](./ahk/diag126.ahk)
