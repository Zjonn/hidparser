import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDescriptor, stripComments } from '../parser.js';

const defaultOpts = { separator: ',', prefix: '0x', comment: '//' };
const simpleDescriptorBytes = [0x05, 0x01, 0x09, 0x02, 0xA1, 0x01, 0x81, 0x02, 0xC0];
const simpleDescriptorOutput = [
    '0x05,0x01,              // Usage Page (Generic Desktop Page)',
    '0x09,0x02,              // Usage (Mouse)',
    '0xA1,0x01,              // Collection (Application)',
    '0x81,0x02,              //   Input (Data,Variable,Absolute,No Wrap,Linear,Preferred State,No Null position,Bit Field)',
    '0xC0,                   //   End Collection',
].join('\n') + '\n';

const noSeparatorDescriptorOutput = [
    '\\x05\\x01' + ' '.repeat(16) + '// Usage Page (Generic Desktop Page)',
    '\\x09\\x02' + ' '.repeat(16) + '// Usage (Mouse)',
    '\\xA1\\x01' + ' '.repeat(16) + '// Collection (Application)',
    '\\x81\\x02' + ' '.repeat(16) + '//   Input (Data,Variable,Absolute,No Wrap,Linear,Preferred State,No Null position,Bit Field)',
    '\\xC0' + ' '.repeat(20) + '//   End Collection',
].join('\n') + '\n';

test('stripComments removes C-style, C++-style and hash comments', () => {
    const input = `0x01, 0x02 // comment\n# another\n/* block\ncomment */\n0x03`;
    const result = stripComments(input);

    assert.ok(!result.includes('//'));
    assert.ok(!result.includes('# another'));
    assert.ok(!result.includes('/*'));

    const tokens = result
        .split(/\s+/)
        .filter(Boolean);
    assert.deepStrictEqual(tokens, ['0x01,', '0x02', '0x03']);
});

test('parseDescriptor formats a simple descriptor with indentation', () => {
    const output = parseDescriptor(simpleDescriptorBytes, defaultOpts);
    assert.strictEqual(output, simpleDescriptorOutput);
});

test('parseDescriptor falls back to default formatting options', () => {
    const output = parseDescriptor(simpleDescriptorBytes);
    assert.strictEqual(output, simpleDescriptorOutput);
});

test('parseDescriptor supports empty string separator', () => {
    const output = parseDescriptor(simpleDescriptorBytes, { separator: '', prefix: '\\x' });
    assert.strictEqual(output, noSeparatorDescriptorOutput);
});

test('parseDescriptor reports parsing errors in the output', () => {
    const originalError = console.error;
    let loggedMessage = '';
    console.error = (...args) => {
        loggedMessage = args.join(' ');
    };

    try {
        const output = parseDescriptor([0xC1, 0x00], defaultOpts);
        assert.strictEqual(output, '// ERROR: End Collection: (0-byte arg) expected\n');
        assert.match(loggedMessage, /Error processing byte/);
    } finally {
        console.error = originalError;
    }
});
