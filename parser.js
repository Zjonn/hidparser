import { handleShortItem } from "./parser-short.js";
import { handleLongItem } from "./parser-long.js";
import { formatByteSequence } from "./utils.js";

// hid1_11.pdf 6.2.2 Report Descriptor
const DEFAULT_PARSE_OPTIONS = {
    separator: ",",
    prefix: "0x",
    comment: "//",
};

export function parseDescriptor(bytes, opts = {}) {
    const options = { ...DEFAULT_PARSE_OPTIONS, ...opts };
    let output = "";
    let indent = 0;
    let usagePage = null;
    const maxLineLength = 24;

    for (let i = 0; i < bytes.length;) {
        const b = bytes[i];
        const bType = (b >> 2) & 0x03;
        const bTag = (b >> 4) & 0x0F;
        let result = null;
        try {
            // Long item
            if (b == 0xFE) {
                result = handleLongItem(bytes, i, options);
            } else {
                result = handleShortItem(bytes, i, options, indent, usagePage);
            }
        } catch (error) {
            console.error("Error processing byte:", b, error);
            output += `${options.comment} ERROR: ${error.message}\n`;
            break;
        }

        if (bType === 1 && bTag === 0x00 && result?.comment?.includes("Vendor Defined")) {
            const dataLength = Math.max(0, result.advance - 1);
            if (dataLength > 1) {
                const rawBytes = bytes.slice(i + 1, i + 1 + dataLength);
                const formatted = formatByteSequence(rawBytes, options);
                if (formatted) {
                    result.comment = result.comment.replace(/Vendor Defined\s+0x[0-9A-F?]+/i, `Vendor Defined ${formatted}`);
                }
            }
        }

        if (result.usagePage) {
            usagePage = result.usagePage;
        }

        const spaces = " ".repeat(indent * 2);
        const pad = " ".repeat(Math.max(0, maxLineLength - result.text.length));
        output += `${result.text}${pad}${options.comment} ${spaces}${result.comment}\n`;
        indent += result.indentChange;
        i += result.advance;
    }

    return output;
}

export function stripComments(input) {
    input = input.replace(/\/\*[\s\S]*?\*\//g, "");
    input = input.replace(/\/\/.*$/gm, "");
    input = input.replace(/#.*$/gm, "");
    return input;
}

if (typeof document !== "undefined") {
    const parseBtn = document.getElementById("parseBtn");
    if (parseBtn) {
        parseBtn.addEventListener("click", () => {
            const inputField = document.getElementById("descriptorInput");
            if (!inputField) {
                return;
            }

            let input = inputField.value.trim();
            input = stripComments(input);

            const bytes = input
                .split(/[\s,]+/)
                .map(b => parseInt(b, 16))
                .filter(n => !isNaN(n));
            const separatorInput = document.getElementById("separator");
            const prefixInput = document.getElementById("prefix");
            const commentInput = document.getElementById("commentSymbol");

            const opts = {
                separator: separatorInput?.value ?? ",",
                prefix: prefixInput?.value ?? "0x",
                comment: commentInput?.value ?? "//",
            };

            const parsed = parseDescriptor(bytes, opts);
            const outputEl = document.getElementById("output");
            if (outputEl) {
                outputEl.textContent = parsed;
            }
        });
    }
}
