# Google Docs Dark Mode - Project Goals

## What It Does

A Chrome extension that applies dark mode to Google Docs by inverting the page's colors, while preserving the original colors of images and media.

## Core Goals

- **Dark mode via CSS invert** - Apply `filter: invert(1) hue-rotate(180deg)` to the root `<html>` element so the entire page flips dark
- **Preserve image colors** - Counter-apply the same filter to `<img>`, `<canvas>`, `<video>`, and `<iframe>` elements so they render with their original colors
- **Persistent preference** - Remember the on/off state via `chrome.storage.local` so it survives page reloads and new tabs
- **Popup toggle** - Simple on/off switch in the extension popup to enable/disable dark mode without reloading the page
- **Default on** - Dark mode is enabled by default when the extension is first installed

## Approach

Google Docs renders the document inside a dynamically injected iframe. The CSS filter cascades visually through cross-origin iframes, so inverting `<html>` darkens the document canvas. For same-origin accessible iframes, a small style tag is injected directly to re-invert images inside them. A MutationObserver watches for lazily loaded iframes and handles them as they appear.

## Non-Goals (for now)

- Supporting Google Sheets / Slides (separate content script matches would be needed)
- Fine-grained control over hue or brightness
- Per-document preferences

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension manifest (MV3) |
| `dark.css` | CSS injected at document_start - applies invert filter and re-inverts media |
| `content.js` | Reads persisted state, toggles the CSS class, listens for popup messages |
| `popup.html` | Toggle UI |
| `popup.js` | Reads/writes storage and sends toggle message to active tab |
| `icons/` | Extension icons (16, 48, 128px) |
