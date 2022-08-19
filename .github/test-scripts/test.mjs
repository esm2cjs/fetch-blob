import { Blob as Blob1 } from "@esm2cjs/fetch-blob";
import assert from "assert";
assert(typeof Blob1 === "function");

import { Blob as Blob2 } from "@esm2cjs/fetch-blob/from.js";
assert(typeof Blob2 === "function");

import { File } from "@esm2cjs/fetch-blob/file.js";
assert(typeof File === "function");
