# files.exclude

When building the dataset, we exclude certain folders and files using a list of regular expressions. This list includes patterns for excluding folders like 'temp' and 'history', as well as files like '.ahk2' and '.ahk2'.

- Note that I have standardized the two types of paths that can be used in Windows (common `\\` and compatible `/`) to a single Linux-style path `/` that doesn't require JavaScript to escape, and the default regular expression flags are `u` and `i`, [u-flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode), [i-flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/ignoreCase).

| regex            | Description                      |
| :--------------- | :------------------------------- |
| `/\.`            | a file/fold name startWith `.`   |
| `/node_modules/` | the path includes `node_modules` |
| `/build/`        | A built-fold in pattern          |
| `/temp/`         | A temp-fold in pattern           |
| `/ahk2/`         | A ahk2-fold in pattern           |
| `\.ah2$`         | file-name end with ah2           |
| `/backup/`       | A backup-fold in pattern         |
| `/history/`      | A history-fold in pattern        |
