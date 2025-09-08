export function toHex(val, opts) {
    const prefix = opts.prefix || "0x";
    return prefix + (val >>> 0).toString(16).padStart(2, "0").toUpperCase();
}

export function joinHex(tag, data, opts, nBytes) {
    const sep = opts.separator || " ";
    const result = [];
    
    if(tag !== null)
        result.push(toHex(tag & 0xFF, opts));
    
    for (let i = 0; i < nBytes; i++) {
        const byte = (data >>> (i * 8)) & 0xFF;
        result.push(toHex(byte, opts));
    }
    
    return result.join(sep);
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