# Self-hosted fonts

Some scripts (Japanese, Simplified Chinese, Cyrillic — see project history)
aren't usable through the `@compai/font-*` CDN the rest of the app's fonts
come from: those packages only carry a basic Latin subset despite being
named after e.g. "Noto Sans JP", confirmed by inspecting the actual glyph
data. The fonts in this directory were generated ourselves instead.

License: SIL Open Font License 1.1 (see `OFL-NotoSansJP.txt`). The OFL
permits subsetting and redistribution; it must not be sold on its own.

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
