// Converts a subsetted TTF/OTF to three.js's "typeface.json" font format
// (the same format FontLoader.js / TextGeometry consume), matching the
// exact path-command encoding read by FontLoader.js's createPath():
//   m x y            -> moveTo
//   l x y            -> lineTo
//   q endX endY cx cy -> quadraticCurveTo(cx, cy, endX, endY)
//   b endX endY c1x c1y c2x c2y -> bezierCurveTo(c1x,c1y,c2x,c2y,endX,endY)
//   z                -> closePath
'use strict';
const fs = require('fs');
const opentype = require('opentype.js');

const [, , inputPath, outputPath, charsPath, familyName] = process.argv;
if (!inputPath || !outputPath || !charsPath) {
  console.error('Usage: node convert.js <font.ttf> <out.json> <chars.txt> [familyName]');
  process.exit(1);
}

const chars = Array.from(new Set(Array.from(fs.readFileSync(charsPath, 'utf8'))));
const font = opentype.parse(fs.readFileSync(inputPath).buffer);
const upm = font.unitsPerEm;
const scale = 1000 / upm; // normalize to resolution:1000, matching our other fonts

function round(n) {
  return Math.round(n * scale);
}
// opentype.js's Glyph.path (and getPath with a fontSize) flips Y to match
// canvas/SVG's Y-down drawing convention. three.js's typeface format wants
// raw font-unit Y-up (ascenders positive), so flip it back here.
function roundY(n) {
  return -Math.round(n * scale);
}

function encodePath(glyph) {
  const path = glyph.getPath(0, 0, upm); // raw font-unit space
  const tokens = [];
  for (const cmd of path.commands) {
    switch (cmd.type) {
      case 'M':
        tokens.push('m', round(cmd.x), roundY(cmd.y));
        break;
      case 'L':
        tokens.push('l', round(cmd.x), roundY(cmd.y));
        break;
      case 'Q':
        tokens.push('q', round(cmd.x), roundY(cmd.y), round(cmd.x1), roundY(cmd.y1));
        break;
      case 'C':
        tokens.push('b', round(cmd.x), roundY(cmd.y), round(cmd.x1), roundY(cmd.y1), round(cmd.x2), roundY(cmd.y2));
        break;
      case 'Z':
        tokens.push('z');
        break;
    }
  }
  return tokens.join(' ');
}

const glyphs = {};
let missing = 0;
for (const ch of chars) {
  const glyph = font.charToGlyph(ch);
  if (!glyph || glyph.index === 0) { missing++; continue; }
  const bbox = glyph.getBoundingBox();
  glyphs[ch] = {
    ha: Math.round(glyph.advanceWidth * scale),
    x_min: isFinite(bbox.x1) ? round(bbox.x1) : 0,
    x_max: isFinite(bbox.x2) ? round(bbox.x2) : 0,
    o: encodePath(glyph),
  };
}

const out = {
  glyphs,
  familyName: familyName || font.names.fontFamily?.en || 'Custom',
  resolution: 1000,
  underlineThickness: 50,
  boundingBox: {
    xMin: round(font.tables.head.xMin),
    xMax: round(font.tables.head.xMax),
    yMin: roundY(font.tables.head.yMax),
    yMax: roundY(font.tables.head.yMin),
  },
};

fs.writeFileSync(outputPath, JSON.stringify(out));
console.log(`Wrote ${outputPath}: ${Object.keys(glyphs).length} glyphs, ${missing} missing, ${(fs.statSync(outputPath).size / 1024).toFixed(0)} KB`);
