import { toHex, joinHex } from "./utils.js";

function handleLongItem(bytes, i, opts) {
    const b = bytes[i];
    const bDataSize = bytes[i + 1];
    const bLongItemTag = bytes[i + 2];

    if (bDataSize === undefined || bLongItemTag === undefined) {
        return { text: "", comment: "ERROR: Unexpected end of data", advance: 1, error: true };
    }

    const line = joinHex(null, [b, bDataSize, bLongItemTag], opts);
    return { text: line, comment: "Long Item", advance: 3, error: false };
}

export { handleLongItem };