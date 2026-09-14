# Name Plate Generator

A single-file, in-browser parametric generator for 3D-printable name plates, keychains,
and pet tags. Built with three.js — no build step, no dependencies to install.

**Live app:** https://doccaz.github.io/nameplate-generator/

## Features

- Multi-line text with a wide range of fonts (sans-serif, script/handwriting, bubble/bold)
- Base plate shapes: Rounded, Rectangle, Oval, or Contour (outline follows the letters)
- Mounting holes (1/2/4) or a keychain-style loop (left / right / both ends)
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
