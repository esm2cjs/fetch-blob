const { Blob: Blob1 } = require("@esm2cjs/fetch-blob");
const assert = require("assert");
assert(typeof Blob1 === "function");

const { Blob: Blob2 } = require("@esm2cjs/fetch-blob/from.js");
assert(typeof Blob2 === "function");

const { File } = require("@esm2cjs/fetch-blob/file.js");
assert(typeof File === "function");
