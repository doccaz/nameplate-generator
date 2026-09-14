# Self-hosted fonts

Some scripts (Japanese, Simplified Chinese, Cyrillic — see project history)
aren't usable through the `@compai/font-*` CDN the rest of the app's fonts
come from: those packages only carry a basic Latin subset despite being
named after e.g. "Noto Sans JP", confirmed by inspecting the actual glyph
data. The fonts in this directory were generated ourselves instead.

License: SIL Open Font License 1.1 (see `OFL-NotoSansJP.txt`, `OFL-NotoSans.txt`,
`OFL-NotoSansSC.txt`). The OFL permits subsetting and redistribution; it
must not be sold on its own.

## `noto-sans-jp.json`

Source: [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP)
(variable font, `google/fonts` repo), instanced to weight 400, subsetted to
the 2,136 Jōyō kanji + hiragana + katakana + Latin/punctuation (~2,580
glyphs total), then converted to three.js's typeface JSON format.

Regenerate with:

```bash
# 1. Download the variable font
curl -L -o notosansjp-variable.ttf \
  "https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf"

# 2. Instance a static weight
python3 -m fontTools.varLib.instancer notosansjp-variable.ttf wght=400 \
  -o notosansjp-400.ttf

# 3. Subset to Joyo kanji + kana + Latin (jp-chars.txt: one file containing
#    every character to keep, built from a Joyo kanji list plus the
#    U+3040-30FF/U+3000-303F/U+FF01-FF5E/U+0020-007E ranges)
python3 -m fontTools.subset notosansjp-400.ttf \
  --text-file=jp-chars.txt \
  --unicodes="U+3040-309F,U+30A0-30FF,U+0020-007E,U+3000-303F,U+FF01-FF5E,U+2018,U+2019,U+201C,U+201D" \
  --output-file=notosansjp-subset.ttf \
  --layout-features='' --no-hinting --desubroutinize --notdef-outline

# 4. Convert to three.js typeface JSON (needs opentype.js: npm i opentype.js)
node convert.js notosansjp-subset.ttf noto-sans-jp.json jp-chars.txt "Noto Sans JP"
```

`convert.js` (kept alongside this README) replicates the exact path-command
encoding `FontLoader.js`'s `createPath()` expects — note it negates Y:
opentype.js's `Glyph.getPath()` returns canvas-style Y-down coordinates,
while three.js's typeface format is Y-up (ascenders positive).

## `noto-sans-cyrillic.json`

Source: [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans)
(variable font), instanced to `wght=400 wdth=100`, subsetted to
U+0400-04FF (Cyrillic) + Latin/punctuation (367 glyphs, ~165KB). Same
pipeline as above, just a much smaller character set - no Joyo-style list
needed, the whole Cyrillic block fits comfortably.

## `noto-sans-sc.json`

Source: [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC)
(variable font), instanced to weight 400, subsetted to the GB2312 Level-1
common-character set (3,755 hanzi - reconstructed with Python's built-in
`gb2312` codec by decoding every valid two-byte sequence in the Level-1
row range 0xB0-0xD7, since no ready-made list was readily fetchable) +
Latin/punctuation + CJK punctuation (4,008 glyphs, ~5MB).

```python
# How cn-common.txt (the GB2312 Level-1 character list) was built:
chars = []
for b1 in range(0xB0, 0xD8):       # Level-1 rows only
    for b2 in range(0xA1, 0xFF):
        try:
            ch = bytes([b1, b2]).decode('gb2312')
            if len(ch) == 1 and ch.isprintable():
                chars.append(ch)
        except Exception:
            pass
# -> 3755 characters, matching the known GB2312 Level-1 count
```
