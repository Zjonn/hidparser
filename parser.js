import { handleShortItem } from "./parser-short.js";
import { handleLongItem } from "./parser-long.js";

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

    // Copy to clipboard functionality
    const copyBtn = document.getElementById("copyBtn");
    const copyIcon = copyBtn?.querySelector(".copy-icon");
    const checkIcon = copyBtn?.querySelector(".check-icon");

    if (copyBtn && copyIcon && checkIcon) {
        copyBtn.addEventListener("click", async () => {
            const outputEl = document.getElementById("output");
            if (!outputEl || !outputEl.textContent) return;

            const text = outputEl.textContent;
            let success = false;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                success = true;
            } else {
                throw new Error("Clipboard API unavailable");
            }

            if (success) {
                // Show check icon
                copyIcon.style.display = "none";
                checkIcon.style.display = "block";
                copyBtn.classList.add("text-success");
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyIcon.style.display = "";
                    checkIcon.style.display = "none";
                    copyBtn.classList.remove("text-success");
                }, 1000);
            }
        });
    }
}
