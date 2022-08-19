# @esm2cjs/fetch-blob

This is a fork of https://github.com/node-fetch/fetch-blob, but automatically patched to support ESM **and** CommonJS, unlike the original repository.

## Install

You can use an npm alias to install this package under the original name:

```
npm i fetch-blob@npm:@esm2cjs/fetch-blob
```

```jsonc
// package.json
"dependencies": {
    "fetch-blob": "npm:@esm2cjs/fetch-blob"
}
```

but `npm` might dedupe this incorrectly when other packages depend on the replaced package. If you can, prefer using the scoped package directly:

```
npm i @esm2cjs/fetch-blob
```

```jsonc
// package.json
"dependencies": {
    "@esm2cjs/fetch-blob": "^ver.si.on"
}
```

## Usage

```js
// Using ESM import syntax
import { Blob } from "@esm2cjs/fetch-blob";
import { Blob } from "@esm2cjs/fetch-blob/from.js";
import { File } from "@esm2cjs/fetch-blob/file.js";

// Using CommonJS require()
const { Blob } = require("@esm2cjs/fetch-blob");
const { Blob } = require("@esm2cjs/fetch-blob/from.js");
const { File } = require("@esm2cjs/fetch-blob/file.js");
```

For more details, please see the original [repository](https://github.com/node-fetch/fetch-blob).

## Sponsoring

To support my efforts in maintaining the ESM/CommonJS hybrid, please sponsor [here](https://github.com/sponsors/AlCalzone).

To support the original author of the module, please sponsor [here](https://github.com/node-fetch/fetch-blob).
