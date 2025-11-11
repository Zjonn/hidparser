const DEFAULT_OPTIONS = {
    prefix: "0x",
    separator: " ",
};

function normalizeOptions(opts = {}) {
    return {
        ...DEFAULT_OPTIONS,
        ...opts,
    };
}

export function toHex(val, opts) {
    const { prefix } = normalizeOptions(opts);
    return prefix + (val >>> 0).toString(16).padStart(2, "0").toUpperCase();
}

export function joinHex(tag, data, opts, nBytes = 0) {
    const options = normalizeOptions(opts);
    const result = [];

    if (Array.isArray(tag)) {
        for (const value of tag) {
            result.push(toHex(value & 0xFF, options));
        }
    } else if (tag !== null && tag !== undefined) {
        result.push(toHex(tag & 0xFF, options));
    }

    if (Array.isArray(data)) {
        for (const value of data) {
            result.push(toHex(value & 0xFF, options));
        }
    } else if (nBytes && data != null) {
        for (let i = 0; i < nBytes; i++) {
            const byte = (data >>> (i * 8)) & 0xFF;
            result.push(toHex(byte, options));
        }
    }

    return result.join(options.separator) + options.separator;
}

export function formatByteSequence(data, opts) {
    const options = normalizeOptions(opts);
    if (!Array.isArray(data) || data.length === 0) {
        return "";
    }

    const values = [];
    for (const value of data) {
        values.push(toHex(value & 0xFF, options));
    }

    return values.join(options.separator);
}

export function readIntLE(bytes, offset, n, signed = true) {
    if (!n || n <= 0) return undefined;

    let v = 0;
    for (let i = 0; i < n; i++) {
        const b = bytes[offset + i];
        if (b == null) return undefined;
        v |= (b & 0xff) << (8 * i);
    }

    if (!signed) {
        return v >>> 0;
    }

    if (n === 4) return v | 0;
    
    const bits = n * 8;
    const sign = 1 << (bits - 1);
    if (v & sign) v = v - (1 << bits); // two's complement
    return v;
}

export function errDataExpected(name) {
    return new Error(`${name}: (at least 1-byte arg) expected`);
}

export function errUnexpectedEnd(name, nBytes) {
    return new Error(`${name}: missing data (requested ${nBytes} bytes)`);
}