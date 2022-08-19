var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var from_exports = {};
__export(from_exports, {
  Blob: () => import_index.default,
  File: () => import_file.default,
  blobFrom: () => blobFrom,
  blobFromSync: () => blobFromSync,
  createTemporaryBlob: () => createTemporaryBlob,
  createTemporaryFile: () => createTemporaryFile,
  default: () => from_default,
  fileFrom: () => fileFrom,
  fileFromSync: () => fileFromSync
});
module.exports = __toCommonJS(from_exports);
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_node_os = require("node:os");
var import_node_process = __toESM(require("node:process"));
var import_node_domexception = __toESM(require("node-domexception"));
var import_file = __toESM(require("./file.js"));
var import_index = __toESM(require("./index.js"));
var _path, _start;
const { stat, mkdtemp } = import_node_fs.promises;
let i = 0, tempDir, registry;
const blobFromSync = (path, type) => fromBlob((0, import_node_fs.statSync)(path), path, type);
const blobFrom = (path, type) => stat(path).then((stat2) => fromBlob(stat2, path, type));
const fileFrom = (path, type) => stat(path).then((stat2) => fromFile(stat2, path, type));
const fileFromSync = (path, type) => fromFile((0, import_node_fs.statSync)(path), path, type);
const fromBlob = (stat2, path, type = "") => new import_index.default([new BlobDataItem({
  path,
  size: stat2.size,
  lastModified: stat2.mtimeMs,
  start: 0
})], { type });
const fromFile = (stat2, path, type = "") => new import_file.default([new BlobDataItem({
  path,
  size: stat2.size,
  lastModified: stat2.mtimeMs,
  start: 0
})], (0, import_node_path.basename)(path), { type, lastModified: stat2.mtimeMs });
const createTemporaryBlob = async (data, { signal, type } = {}) => {
  registry = registry || new FinalizationRegistry(import_node_fs.promises.unlink);
  tempDir = tempDir || await mkdtemp((0, import_node_fs.realpathSync)((0, import_node_os.tmpdir)()) + import_node_path.sep);
  const id = `${i++}`;
  const destination = (0, import_node_path.join)(tempDir, id);
  if (data instanceof ArrayBuffer)
    data = new Uint8Array(data);
  await import_node_fs.promises.writeFile(destination, data, { signal });
  const blob = await blobFrom(destination, type);
  registry.register(blob, destination);
  return blob;
};
const createTemporaryFile = async (data, name, opts) => {
  const blob = await createTemporaryBlob(data);
  return new import_file.default([blob], name, opts);
};
const _BlobDataItem = class {
  constructor(options) {
    __privateAdd(this, _path, void 0);
    __privateAdd(this, _start, void 0);
    __privateSet(this, _path, options.path);
    __privateSet(this, _start, options.start);
    this.size = options.size;
    this.lastModified = options.lastModified;
    this.originalSize = options.originalSize === void 0 ? options.size : options.originalSize;
  }
  slice(start, end) {
    return new _BlobDataItem({
      path: __privateGet(this, _path),
      lastModified: this.lastModified,
      originalSize: this.originalSize,
      size: end - start,
      start: __privateGet(this, _start) + start
    });
  }
  async *stream() {
    const { mtimeMs, size } = await stat(__privateGet(this, _path));
    if (mtimeMs > this.lastModified || this.originalSize !== size) {
      throw new import_node_domexception.default("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.", "NotReadableError");
    }
    yield* (0, import_node_fs.createReadStream)(__privateGet(this, _path), {
      start: __privateGet(this, _start),
      end: __privateGet(this, _start) + this.size - 1
    });
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
};
let BlobDataItem = _BlobDataItem;
_path = new WeakMap();
_start = new WeakMap();
import_node_process.default.once("exit", () => {
  tempDir && (0, import_node_fs.rmdirSync)(tempDir, { recursive: true });
});
var from_default = blobFromSync;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Blob,
  File,
  blobFrom,
  blobFromSync,
  createTemporaryBlob,
  createTemporaryFile,
  fileFrom,
  fileFromSync
});
//# sourceMappingURL=from.js.map
