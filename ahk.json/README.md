# about this

## .en.ahk.json

- `data.ts` -> `nls_json.tools.ts` -> `.en.ahk.json`
- `data.ts` -> `.unit.test.ts` 
- `data.ts` -> type def

## .zn_cn.ahk.json

`.en.ahk.json` -> google Translation  -> `.zn_cn.ahk.json`

## scheme

```ts
interface ISchema {
    keyRawName:string,
    doc:string[]
}
```