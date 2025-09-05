# HID Descriptor Parser

Small toolset to parse and display USB HID (Human Interface Device) report descriptors in a readable form.

## Features

- Parse HID report descriptor bytes (Main / Global / Local items)
- Decode Usage Pages, Collections and common usages
- Little-endian multi-byte handling (signed by default)
- Optional PDF extraction helpers to build usage tables

## Local testing

- From project root run:
```bash
python -m http.server 8000
```
- Open http://localhost:8000/index.html and paste descriptor bytes, click "Parse".

## Usage notes

- For better results include `data/usages_page_01.json` (optional). See `tools/extract_usages.py` to generate from PDF.
- The parser expects hex bytes (space-separated). Multi-byte values are shown little-endian.

## License

GPL-3.0 — modifications must be distributed under the same license.
