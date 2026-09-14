# Tagify3D

A single-file, in-browser parametric generator for 3D-printable name plates, keychains,
and pet tags. Built with three.js — no build step, no dependencies to install.

**Live app:** https://tagify3d.com/

## Features

- Multi-line text with independent per-line sizing, line spacing, and letter spacing
- A wide range of fonts, plus Arabic, Hebrew, Hindi, Telugu, Japanese, Chinese, and
  Cyrillic scripts (see `fonts/README.md`), or any custom Google Font by name
- Base plate shapes: Rounded, Rectangle, Oval, License Plate, or Contour (outline
  follows the letters)
- Emboss (raised), Engrave (recessed), or Die Cut (cut through) text styles
- Mounting holes (1/2/4/top-2) or a keychain-style loop (left / right / both ends)
- Decorate the dot on "i"/"j" with a heart, star, crown, or any custom SVG shape
- Optional beveled edges, top/bottom border text ("Hello, my name is..." style tags)
- Auto-fit or manual plate sizing, independent horizontal/vertical text centering
- One-click style presets
- STL export: combined single file, or body + text as two files for multi-color
  (AMS/MMU) printing

## Usage

Open `nameplate-generator.html` directly in a browser (double-click it, or serve the
folder with any static file server) — everything runs client-side.

## Development

This is a single HTML file with an ES module `<script>` block; there's no build step.
Edit `nameplate-generator.html` directly and reload the page to see changes.

## Deployment

Pushing a tag matching `v*` (e.g. `v1.0`) triggers `.github/workflows/pages.yml`,
which publishes `nameplate-generator.html` as `index.html` to GitHub Pages.

## License

MIT — see [LICENSE](LICENSE).
