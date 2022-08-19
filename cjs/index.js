var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var esm_exports = {};
__export(esm_exports, {
  Blob: () => Blob,
  default: () => esm_default
});
module.exports = __toCommonJS(esm_exports);
var import_streams = require("../streams.cjs");
var _parts, _type, _size, _endings, _a;
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
const POOL_SIZE = 65536;
async function* toIterator(parts, clone = true) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0, b = part;
      while (position !== b.size) {
        const chunk = b.slice(position, Math.min(b.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
const _Blob = (_a = class {
  constructor(blobParts = [], options = {}) {
    __privateAdd(this, _parts, []);
    __privateAdd(this, _type, "");
    __privateAdd(this, _size, 0);
    __privateAdd(this, _endings, "transparent");
    if (typeof blobParts !== "object" || blobParts === null) {
      throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
    }
    if (typeof blobParts[Symbol.iterator] !== "function") {
      throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
    }
    if (typeof options !== "object" && typeof options !== "function") {
      throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
    }
    if (options === null)
      options = {};
    const encoder = new TextEncoder();
    for (const element of blobParts) {
      let part;
      if (ArrayBuffer.isView(element)) {
        part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
      } else if (element instanceof ArrayBuffer) {
        part = new Uint8Array(element.slice(0));
      } else if (element instanceof _a) {
        part = element;
      } else {
        part = encoder.encode(`${element}`);
      }
      __privateSet(this, _size, __privateGet(this, _size) + (ArrayBuffer.isView(part) ? part.byteLength : part.size));
      __privateGet(this, _parts).push(part);
    }
    __privateSet(this, _endings, `${options.endings === void 0 ? "transparent" : options.endings}`);
    const type = options.type === void 0 ? "" : String(options.type);
    __privateSet(this, _type, /^[\x20-\x7E]*$/.test(type) ? type : "");
  }
  get size() {
    return __privateGet(this, _size);
  }
  get type() {
    return __privateGet(this, _type);
  }
  async text() {
    const decoder = new TextDecoder();
    let str = "";
    for await (const part of toIterator(__privateGet(this, _parts), false)) {
      str += decoder.decode(part, { stream: true });
    }
    str += decoder.decode();
    return str;
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of toIterator(__privateGet(this, _parts), false)) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    const it = toIterator(__privateGet(this, _parts), true);
    return new globalThis.ReadableStream({
      type: "bytes",
      async pull(ctrl) {
        const chunk = await it.next();
        chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
      },
      async cancel() {
        await it.return();
      }
    });
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = __privateGet(this, _parts);
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      if (added >= span) {
        break;
      }
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        let chunk;
        if (ArrayBuffer.isView(part)) {
          chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
          added += chunk.byteLength;
        } else {
          chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
          added += chunk.size;
        }
        relativeEnd -= size2;
        blobParts.push(chunk);
        relativeStart = 0;
      }
    }
    const blob = new _a([], { type: String(type).toLowerCase() });
    __privateSet(blob, _size, span);
    __privateSet(blob, _parts, blobParts);
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
}, _parts = new WeakMap(), _type = new WeakMap(), _size = new WeakMap(), _endings = new WeakMap(), _a);
Object.defineProperties(_Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
const Blob = _Blob;
var esm_default = Blob;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Blob
});
//# sourceMappingURL=index.js.map
