import { handleShortItem } from "./parser-short.js";
import { handleLongItem } from "./parser-long.js";


// hid1_11.pdf 6.2.2 Report Descriptor
function parseDescriptor(bytes, opts) {
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
                result = handleLongItem(bytes, i, opts);
            } else {
                result = handleShortItem(bytes, i, opts, indent, usagePage);
            }
        } catch (error) {
            console.error("Error processing byte:", b, error);
            output += `${opts.comment} ERROR: ${error.message}\n`;
            break;
        }

        if (result.usagePage) {
            usagePage = result.usagePage;
        }
        
        const spaces = " ".repeat(indent * 2);
        const pad = " ".repeat(Math.max(0, maxLineLength - result.text.length));
        output += `${result.text}${pad}${opts.comment} ${spaces}${result.comment}\n`;
        indent += result.indentChange;
        i += result.advance;
    }

    return output;
}

function stripComments(input) {
    input = input.replace(/\/\*[\s\S]*?\*\//g, "");
    input = input.replace(/\/\/.*$/gm, "");
    input = input.replace(/#.*$/gm, "");
    return input;
}

document.getElementById("parseBtn").addEventListener("click", () => {
    let input = document.getElementById("descriptorInput").value.trim();
    input = stripComments(input);

    const bytes = input.split(/[\s,]+/).map(b => parseInt(b, 16)).filter(n => !isNaN(n));
    const opts = {
        separator: document.getElementById("separator").value || ",",
        prefix: document.getElementById("prefix").value || "0x",
        comment: document.getElementById("commentSymbol").value || "//",
    };

    const parsed = parseDescriptor(bytes, opts);
    document.getElementById("output").textContent = parsed;
});
