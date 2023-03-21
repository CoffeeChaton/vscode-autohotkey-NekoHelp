# diag125

```js
125: {
    msg: '`%` miss to closed',
    path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/main/note#diag125',
},
```

![diag125](./img/diag125.png)

> - [Multiline](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section) style1 / exp1 just support `%varName%` style.
> - at this exp `% var%` `%` has a space, this error is at line `9`, but ahk-L report this error at line `5`.
> - if [Multiline](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section) is very big, this diagnostic can help you to find the problem more quickly.
> - try it [diag125](./ahk/diag125.ahk)
