# Google Dark Mode - Dev Notes

## Version

Current version: **1.2.0** (in `manifest.json`)

**Always bump the version in `manifest.json` when making changes before zipping for the Chrome Web Store.**

Use semantic versioning:
- Patch (1.2.x) - bug fixes
- Minor (1.x.0) - new features (new app support, UI changes)
- Major (x.0.0) - architectural changes

## Architecture

### How dark mode works (triple-inversion trick)

1. CSS `filter: invert(1) hue-rotate(180deg)` on `html.gdm-dark` - inverts the entire page dark
2. CSS `filter: invert(1) hue-rotate(180deg)` on `canvas.kix-canvas-tile-content` - cancels step 1 on Docs canvas tiles
3. `canvas-patch.js` inverts `fillStyle`/`strokeStyle`/`shadowColor` at draw time - makes text/backgrounds dark

Net result: text is light, backgrounds are dark, images drawn via `drawImage()` are NOT patched so they keep original colors.

### Why canvas-patch.js is scoped to `/document/*` only

Google Sheets runs at `docs.google.com/spreadsheets/`, which matches `docs.google.com/*`. If canvas-patch ran on Sheets, it would double-invert the canvas (CSS invert + JS invert = no dark mode). Sheets uses pure CSS inversion only.

### Known limitation - stale canvas on toggle

When the user toggles dark mode off, canvas tiles drawn with JS-inverted colors remain until Docs redraws them (on scroll or interaction). The popup shows a Refresh button after toggling to work around this.

### Why image re-inversion CSS doesn't help

Document images in Google Docs are drawn via `drawImage()` onto canvas tiles - they are NOT `<img>` DOM elements. CSS selectors can't target them. canvas-patch.js deliberately skips `drawImage` to preserve image colors.

## Zipping for Chrome Web Store

```bash
cd /c/Users/Jack/Workspace/chrome-plugins
VERSION=$(node -p "require('./google-dark-mode/manifest.json').version")
cd google-dark-mode
zip -r "$HOME/Downloads/google-dark-mode-v${VERSION}.zip" . --exclude "*.git*" --exclude ".playwright-mcp/*" --exclude "CLAUDE.md" --exclude "GOALS.md"
```
